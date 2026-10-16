<?php
defined('ABSPATH') || exit;
final class Boopay_Plugin {
    public static function allowed(): array {
        return defined('BOOPAY_ALLOWED_API_ORIGINS') && is_array(BOOPAY_ALLOWED_API_ORIGINS) ? BOOPAY_ALLOWED_API_ORIGINS : [];
    }
    public static function activate(): void {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta("CREATE TABLE {$wpdb->prefix}boopay_revisions (
            revision bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            source_id bigint(20) unsigned NOT NULL,
            PRIMARY KEY  (revision),
            KEY source_id (source_id)
        ) {$wpdb->get_charset_collate()};");
        add_option('boopay_tracking', false, '', false);
        add_option('boopay_sync', ['cursor' => 0, 'state' => 'idle'], '', false);
    }
    public static function deactivate(): void {
        self::cancel_jobs();
        // Credencial local apagada na desativação; revogação remota requer desconectar antes.
        delete_option('boopay_credentials');
        update_option('boopay_tracking', false, false);
    }
    public static function cancel_jobs(): void {
        if (function_exists('as_unschedule_all_actions')) {
            foreach (['boopay_dispatch', 'boopay_initial', 'boopay_parent_refresh'] as $hook) as_unschedule_all_actions($hook, null, 'boopay');
        }
        global $wpdb;
        $names = $wpdb->get_col($wpdb->prepare("SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE %s", $wpdb->esc_like('boopay_job_') . '%'));
        foreach ($names as $name) delete_option($name);
        update_option('boopay_sync', ['cursor' => 0, 'state' => 'idle'], false);
    }
    public static function boot(): void {
        add_action('admin_menu', static function() { add_submenu_page('woocommerce', 'BooPay', 'BooPay', 'manage_woocommerce', 'boopay', [self::class, 'screen']); });
        add_action('admin_post_boopay_settings', [self::class, 'handle']);
        add_action('boopay_dispatch', [Boopay_Catalog::class, 'dispatch']);
        add_action('boopay_initial', [Boopay_Catalog::class, 'initial']);
        Boopay_Catalog::hooks();
        Boopay_Tracking::hooks();
    }
    public static function credentials(): array { return (array) get_option('boopay_credentials', []); }
    public static function client(): Boopay_Signed_Http_Client {
        return new Boopay_Signed_Http_Client((string) get_option('boopay_api', ''), self::allowed(), self::credentials());
    }
    public static function pairing(string $api, string $code) {
        try { $api = Boopay_Signed_Http_Client::validate_base($api, self::allowed()); }
        catch (InvalidArgumentException $e) { return new WP_Error('destination', 'Origem da API não autorizada pelo operador.'); }
        if (parse_url(home_url(), PHP_URL_SCHEME) !== 'https') return new WP_Error('store_https', 'A loja precisa usar HTTPS.');
        $result = wp_safe_remote_post($api . '/v1/integrations/connect', ['timeout' => 10, 'redirection' => 0, 'sslverify' => true,
            'headers' => ['Content-Type' => 'application/json'], 'body' => wp_json_encode(['code' => $code, 'store_url' => untrailingslashit(home_url())]), 'limit_response_size' => 16384]);
        if (is_wp_error($result)) return new WP_Error('unavailable', 'API indisponível. Solicite novo código antes de tentar novamente.');
        if (wp_remote_retrieve_response_code($result) !== 200) return new WP_Error('invalid_code', 'Código inválido, usado ou expirado. Solicite outro código.');
        $data = json_decode(wp_remote_retrieve_body($result), true);
        foreach (['token', 'signing_secret', 'tenant_id', 'integration_id', 'merchant_id'] as $key)
            if (!is_array($data) || empty($data[$key])) return new WP_Error('invalid_response', 'Resposta de pareamento inválida.');
        if (!is_int($data['merchant_id']) || !preg_match('/^[A-Za-z0-9_-]{43}$/', $data['token'])
            || !preg_match('/^[A-Za-z0-9_-]{43}$/', $data['signing_secret'])) return new WP_Error('invalid_response', 'Resposta de pareamento inválida.');
        self::cancel_jobs();
        update_option('boopay_api', $api, false);
        update_option('boopay_credentials', array_intersect_key($data, array_flip(['token','signing_secret','tenant_id','integration_id','merchant_id'])), false);
        update_option('boopay_diagnostic', ['state' => 'connected', 'time' => gmdate('c')], false);
        return true;
    }
    public static function disconnect() {
        $credentials = self::credentials();
        $result = true;
        if ($credentials) {
            try {
                $base = Boopay_Signed_Http_Client::validate_base((string) get_option('boopay_api'), self::allowed());
                $response = wp_safe_remote_post($base . '/v1/integrations/disconnect', ['timeout' => 10, 'redirection' => 0, 'sslverify' => true,
                    'headers' => ['Content-Type' => 'application/json', 'Authorization' => 'Bearer ' . $credentials['token']], 'body' => '{}', 'limit_response_size' => 4096]);
                $result = !is_wp_error($response) && in_array(wp_remote_retrieve_response_code($response), [204, 401], true);
            } catch (InvalidArgumentException $e) { $result = false; }
        }
        self::cancel_jobs(); delete_option('boopay_credentials'); update_option('boopay_tracking', false, false);
        delete_option('boopay_health');
        return $result;
    }
    public static function handle(): void {
        if (!current_user_can('manage_woocommerce')) wp_die('Permissão insuficiente.', '', ['response' => 403]);
        check_admin_referer('boopay_settings');
        $action = sanitize_key(wp_unslash($_POST['operation'] ?? ''));
        $message = 'saved';
        if ($action === 'connect') {
            $api = esc_url_raw(wp_unslash($_POST['api'] ?? ''), ['https']);
            $code = sanitize_text_field(wp_unslash($_POST['code'] ?? ''));
            $result = self::pairing($api, $code);
            unset($_POST['code'], $code); // Não guardar código, nem reapresentar no formulário.
            $message = is_wp_error($result) ? $result->get_error_code() : 'connected';
        } elseif ($action === 'disconnect') { $message = self::disconnect() ? 'disconnected' : 'remote_revoke_pending';
        } elseif ($action === 'sync' && self::credentials()) { Boopay_Catalog::start(); $message = 'queued';
        } elseif ($action === 'retry' && self::credentials()) { Boopay_Catalog::retry_failed(); $message = 'queued';
        } elseif ($action === 'health' && self::credentials()) {
            try {
                $response = self::client()->send('/v1/integrations/health', (object) []);
                if (!is_wp_error($response)) update_option('boopay_health', json_decode(wp_remote_retrieve_body($response), true), false);
                $message = is_wp_error($response) ? 'unavailable' : 'healthy';
            } catch (InvalidArgumentException $e) { $message = 'destination'; }
        } elseif ($action === 'tracking') { update_option('boopay_tracking', !empty($_POST['tracking']) && (bool) self::credentials(), false); }
        wp_safe_redirect(add_query_arg('notice', sanitize_key($message), admin_url('admin.php?page=boopay'))); exit;
    }
    public static function screen(): void {
        if (!current_user_can('manage_woocommerce')) return;
        $messages = ['saved'=>'Preferências salvas.', 'connected'=>'Integração conectada.', 'disconnected'=>'Integração desconectada.',
            'queued'=>'Trabalho agendado. Acompanhe em WooCommerce → Status → Ações agendadas, grupo boopay.',
            'destination'=>'Origem da API não autorizada. Confira a configuração com o operador.', 'store_https'=>'Configure HTTPS na loja antes de conectar.',
            'invalid_code'=>'Código inválido, usado ou expirado. Solicite um novo código.', 'invalid_response'=>'Resposta inválida; contate o operador.',
            'unavailable'=>'API indisponível. Verifique conexão e tente novamente.', 'healthy'=>'Diagnóstico atualizado.',
            'remote_revoke_pending'=>'Envios interrompidos e credenciais locais apagadas. A API estava indisponível: solicite ao operador a revogação remota.'];
        $notice = sanitize_key(wp_unslash($_GET['notice'] ?? ''));
        echo '<div class="wrap"><h1>BooPay</h1><p>Sincronize o catálogo e acompanhe a conexão da sua loja.</p>';
        if (isset($messages[$notice])) echo '<div class="notice notice-info"><p>' . esc_html($messages[$notice]) . '</p></div>';
        echo '<h2>' . (self::credentials() ? 'Conectado' : 'Desconectado') . '</h2>';
        echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '"><input type="hidden" name="action" value="boopay_settings">';
        wp_nonce_field('boopay_settings');
        if (!self::credentials()) {
            echo '<p><label for="boopay-api">URL da API</label><br><input id="boopay-api" class="regular-text" name="api" type="url" required placeholder="https://api.sua-organizacao.com" value="' . esc_attr(get_option('boopay_api', '')) . '"></p>';
            echo '<p><label for="boopay-code">Código temporário</label><br><input id="boopay-code" name="code" type="password" autocomplete="off" required maxlength="100"></p><p>O código vale cinco minutos e uma tentativa de pareamento.</p>';
            echo '<button class="button button-primary" name="operation" value="connect">Conectar</button>';
        } else {
            foreach (['sync'=>'Sincronizar / retomar catálogo', 'retry'=>'Repetir trabalhos com falha', 'health'=>'Atualizar diagnóstico', 'disconnect'=>'Desconectar'] as $value=>$label)
                echo '<button class="button" name="operation" value="' . esc_attr($value) . '">' . esc_html($label) . '</button> ';
        }
        echo '</form>';
        if (self::credentials()) {
            echo '<h2>Eventos da vitrine</h2><form method="post" action="' . esc_url(admin_url('admin-post.php')) . '"><input type="hidden" name="action" value="boopay_settings"><input type="hidden" name="operation" value="tracking">';
            wp_nonce_field('boopay_settings');
            echo '<label><input type="checkbox" name="tracking" value="1" ' . checked(get_option('boopay_tracking', false), true, false) . '> Oferecer coleta opcional com consentimento do visitante</label><p>Desligado por padrão. Nenhum dado de pagamento ou identificação pessoal é enviado.</p><button class="button">Salvar preferência</button></form>';
        }
        foreach (['Sincronização'=>'boopay_sync', 'Último envio'=>'boopay_diagnostic', 'Saúde'=>'boopay_health'] as $label=>$option) {
            echo '<h2>' . esc_html($label) . '</h2><pre>' . esc_html(wp_json_encode(get_option($option, []), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) . '</pre>';
        }
        echo '</div>';
    }
}
