<?php
defined('ABSPATH') || exit;
final class Boopay_Catalog {
    public static function hooks(): void {
        foreach (['woocommerce_new_product','woocommerce_update_product','woocommerce_new_product_variation','woocommerce_update_product_variation'] as $hook)
            add_action($hook, [self::class, 'changed']);
        foreach (['woocommerce_product_set_stock','woocommerce_variation_set_stock'] as $hook)
            add_action($hook, static function($product) { self::changed($product->get_id()); });
        add_action('before_delete_post', [self::class, 'before_delete'], 10, 2);
        add_action('trashed_post', [self::class, 'changed']);
        add_action('untrashed_post', [self::class, 'changed']);
        add_action('boopay_parent_refresh', [self::class, 'changed']);
    }
    public static function revision(int $id): int {
        global $wpdb;
        $table = $wpdb->prefix . 'boopay_revisions';
        $ok = $wpdb->insert($table, ['source_id'=>$id], ['%d']);
        if ($ok === false) throw new RuntimeException('revision_failed');
        return (int) $wpdb->insert_id;
    }
    private static function stock($product): ?int {
        return $product->managing_stock() ? max(0, (int) $product->get_stock_quantity()) : null;
    }
    private static function price($product): string {
        $value = (string) $product->get_price();
        if ($value === '' && $product->is_type('variable') && !$product->get_children()) return '0';
        if (!preg_match('/^\d{1,10}(\.\d{1,6})?$/', $value)) throw new RuntimeException('unsupported_price');
        return $value;
    }
    public static function snapshot(int $id): array {
        $product = wc_get_product($id);
        if (!$product || $product->get_status() !== 'publish') return ['action'=>'delete', 'source_id'=>$id, 'revision'=>self::revision($id)];
        if (!$product->is_type(['simple','variable'])) throw new RuntimeException('unsupported_product_type');
        $children = $product->is_type('variable') ? $product->get_children() : [];
        $images = array_values(array_filter(array_map('wp_get_attachment_url', array_filter(array_merge([$product->get_image_id()], $product->get_gallery_image_ids())))));
        if (count($children) > 100 || count($images) > 20) throw new RuntimeException('product_limit_exceeded');
        $variations = [];
        foreach ($children as $child_id) {
            $child = wc_get_product($child_id);
            if (!$child || $child->get_status() !== 'publish') continue;
            $variations[] = ['source_id'=>(int)$child_id, 'sku'=>$child->get_sku(), 'price'=>self::price($child),
                'stock'=>self::stock($child), 'in_stock'=>$child->is_in_stock(), 'attributes'=>(object)$child->get_attributes()];
        }
        return ['action'=>'upsert', 'source_id'=>$id, 'revision'=>self::revision($id), 'sku'=>$product->get_sku(),
            'name'=>$product->get_name(), 'type'=>$product->get_type(), 'price'=>self::price($product),
            'stock'=>self::stock($product), 'in_stock'=>$product->is_in_stock(), 'url'=>get_permalink($id),
            'images'=>$images, 'variations'=>$variations];
    }
    public static function changed(int $id): void {
        if (!Boopay_Plugin::credentials()) return;
        $product = wc_get_product($id);
        if (!$product) return;
        if ($product->is_type('variation')) $id = $product->get_parent_id();
        try { self::enqueue('/v1/admin/catalog/sync', self::batch([self::snapshot($id)])); }
        catch (RuntimeException $e) { self::diagnostic('serialization_failed', 0); }
    }
    public static function before_delete(int $id, $post): void {
        if (!Boopay_Plugin::credentials() || !in_array($post->post_type, ['product','product_variation'], true)) return;
        if ($post->post_type === 'product_variation') {
            // Executar após a exclusão, para incluir snapshot sem a variação removida.
            as_enqueue_async_action('boopay_parent_refresh', [(int)$post->post_parent], 'boopay');
            return;
        }
        self::enqueue('/v1/admin/catalog/sync', self::batch([['action'=>'delete','source_id'=>$id,'revision'=>self::revision($id)]]));
    }
    private static function batch(array $items): array {
        return ['version'=>1, 'event_id'=>wp_generate_uuid4(), 'merchant_id'=>(int)Boopay_Plugin::credentials()['merchant_id'], 'items'=>$items];
    }
    public static function start(): void {
        $state = get_option('boopay_sync', ['cursor'=>0, 'state'=>'idle']);
        if ($state['state'] === 'running') return;
        if ($state['state'] === 'complete') $state['cursor'] = 0;
        $state['state'] = 'running'; update_option('boopay_sync', $state, false);
        as_enqueue_async_action('boopay_initial', [], 'boopay', true);
    }
    public static function initial(): void {
        if (!Boopay_Plugin::credentials()) return;
        $state = get_option('boopay_sync', ['cursor'=>0,'state'=>'idle']);
        if ($state['state'] !== 'running') return;
        global $wpdb;
        // Keyset por ID evita pular produtos ao excluir itens de páginas anteriores.
        $ids = $wpdb->get_col($wpdb->prepare("SELECT ID FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND ID>%d ORDER BY ID ASC LIMIT 20", $state['cursor']));
        try { $items = array_map(static fn($id) => self::snapshot((int)$id), $ids); }
        catch (RuntimeException $e) { $state['state']='failed'; update_option('boopay_sync',$state,false); self::diagnostic('serialization_failed',0); return; }
        self::enqueue('/v1/admin/catalog/sync', self::batch($items), ['cursor'=>$ids ? (int)end($ids) : $state['cursor'], 'complete'=>count($ids)<20]);
    }
    public static function enqueue(string $path, array $payload, ?array $page = null): string {
        $id = wp_generate_uuid4();
        add_option('boopay_job_' . $id, ['integration_id'=>Boopay_Plugin::credentials()['integration_id'],
            'path'=>$path, 'payload'=>$payload, 'attempt'=>0, 'page'=>$page, 'state'=>'pending'], '', false);
        as_enqueue_async_action('boopay_dispatch', [$id], 'boopay');
        return $id;
    }
    public static function diagnostic(string $state, int $attempt): void {
        update_option('boopay_diagnostic', ['state'=>$state,'attempt'=>$attempt,'time'=>gmdate('c')],false);
        if (function_exists('wc_get_logger')) wc_get_logger()->info('delivery_state=' . sanitize_key($state) . ' attempt=' . $attempt, ['source'=>'boopay']);
    }
    public static function dispatch(string $id): void {
        if (!preg_match('/^[0-9a-f-]{36}$/', $id)) return;
        $name = 'boopay_job_' . $id; $job = get_option($name);
        $credentials = Boopay_Plugin::credentials();
        if (!$job || !$credentials || $job['integration_id'] !== $credentials['integration_id']) { delete_option($name); return; }
        try { $response = Boopay_Plugin::client()->send($job['path'], $job['payload']); }
        catch (InvalidArgumentException $e) { $response = new WP_Error('destination', 'Destino não autorizado.'); }
        if (is_wp_error($response)) {
            $status = (int)($response->get_error_data()['status'] ?? 0);
            $retry = $response->get_error_code() === 'boopay_transport_error' || $status === 429 || $status >= 500;
            $job['attempt']++;
            $job['state'] = $retry && $job['attempt'] < 5 ? 'retry' : 'failed'; update_option($name,$job,false);
            self::diagnostic($job['state'], $job['attempt']);
            if ($job['state'] === 'retry') as_schedule_single_action(time() + min(900, 30 * (2 ** ($job['attempt']-1))), 'boopay_dispatch', [$id], 'boopay');
            elseif ($job['page']) { $state=get_option('boopay_sync'); $state['state']='failed'; update_option('boopay_sync',$state,false); }
            if ($status === 401) { Boopay_Plugin::cancel_jobs(); delete_option('boopay_credentials'); self::diagnostic('reconnect_required',$job['attempt']); }
            return;
        }
        self::diagnostic('delivered', $job['attempt']);
        delete_option($name);
        if ($job['page']) {
            update_option('boopay_sync', ['cursor'=>$job['page']['cursor'], 'state'=>$job['page']['complete']?'complete':'running'], false);
            if (!$job['page']['complete']) as_enqueue_async_action('boopay_initial', [], 'boopay');
        }
    }
    public static function retry_failed(): void {
        global $wpdb;
        $names = $wpdb->get_col($wpdb->prepare("SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE %s", $wpdb->esc_like('boopay_job_') . '%'));
        foreach ($names as $name) {
            $job = get_option($name);
            if (($job['state'] ?? '') !== 'failed') continue;
            $job['attempt']=0; $job['state']='pending'; update_option($name,$job,false);
            if ($job['page']) { $state=get_option('boopay_sync'); $state['state']='running'; update_option('boopay_sync',$state,false); }
            as_enqueue_async_action('boopay_dispatch',[substr($name,11)],'boopay',true);
        }
    }
}
