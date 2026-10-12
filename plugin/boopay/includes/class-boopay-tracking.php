<?php
defined('ABSPATH') || exit;
final class Boopay_Tracking {
    public static function enabled(): bool { return (bool)get_option('boopay_tracking',false) && (bool)Boopay_Plugin::credentials(); }
    public static function hooks(): void {
        add_action('wp_enqueue_scripts',[self::class,'assets']);
        add_action('rest_api_init',static function() {
            register_rest_route('boopay/v1','/consent',['methods'=>'POST','callback'=>[self::class,'consent'],'permission_callback'=>[self::class,'permission']]);
            register_rest_route('boopay/v1','/event',['methods'=>'POST','callback'=>[self::class,'event'],'permission_callback'=>[self::class,'permission']]);
        });
        // Hook de sucesso cobre formulário, AJAX clássico e Store API/Blocks.
        add_action('woocommerce_add_to_cart',static function($key,$product_id) {
            if (self::enabled() && self::session()) self::queue('add_to_cart',(int)$product_id);
        },10,2);
    }
    public static function permission($request) {
        $origin = $request->get_header('origin');
        $home = wp_parse_url(home_url());
        $expected = $home['scheme'] . '://' . $home['host'] . (isset($home['port']) ? ':' . $home['port'] : '');
        return self::enabled() && hash_equals($expected,$origin) && (bool)wp_verify_nonce($request->get_header('x-wp-nonce'),'wp_rest');
    }
    public static function session(): ?string {
        $cookie = wp_unslash($_COOKIE['boopay_consent'] ?? '');
        $parts = explode('.', $cookie);
        if (count($parts)!==3 || !preg_match('/^[0-9a-f]{32}$/',$parts[0]) || !ctype_digit($parts[1]) || (int)$parts[1]<time()) return null;
        if (!hash_equals(hash_hmac('sha256',$parts[0].'.'.$parts[1],wp_salt('auth')),$parts[2])) return null;
        return hash_hmac('sha256',$parts[0],wp_salt('secure_auth'));
    }
    public static function consent($request) {
        $body = $request->get_json_params();
        if (!is_array($body) || array_keys($body)!==['granted'] || !is_bool($body['granted'])) return new WP_Error('invalid_consent','Escolha inválida.',['status'=>400]);
        $expires = $body['granted'] ? time()+DAY_IN_SECONDS : time()-3600;
        $session = bin2hex(random_bytes(16));
        $value = $body['granted'] ? $session.'.'.$expires.'.'.hash_hmac('sha256',$session.'.'.$expires,wp_salt('auth')) : '';
        setcookie('boopay_consent',$value,['expires'=>$expires,'path'=>'/','secure'=>true,'httponly'=>true,'samesite'=>'Lax']);
        return new WP_REST_Response(['granted'=>$body['granted']],200,['Cache-Control'=>'no-store']);
    }
    public static function queue(string $kind, ?int $product_id): bool {
        $session = self::session();
        if (!$session || !self::enabled()) return false;
        $key='boopay_rate_'.substr($session,0,32);
        $count=(int)get_transient($key);
        if ($count>=30) return false;
        set_transient($key,$count+1,MINUTE_IN_SECONDS);
        $payload=['version'=>1,'event_id'=>wp_generate_uuid4(),'kind'=>$kind,'session_hash'=>$session,'occurred_at'=>gmdate('Y-m-d\TH:i:s\Z'),'consent'=>true];
        if ($product_id) $payload['product_id']=$product_id;
        Boopay_Catalog::enqueue('/v1/events',$payload);
        return true;
    }
    public static function event($request) {
        $body=$request->get_json_params();
        if (!is_array($body) || array_diff(array_keys($body),['kind','product_id']) || !in_array($body['kind']??'', ['view','exit_intent'],true)
            || (isset($body['product_id']) && (!is_int($body['product_id']) || $body['product_id']<=0)))
            return new WP_Error('invalid_event','Evento inválido.',['status'=>400]);
        if (!self::queue($body['kind'],$body['product_id']??null)) return new WP_Error('consent_or_limit','Consentimento ausente ou limite atingido.',['status'=>429]);
        return new WP_REST_Response(['status'=>'queued'],202,['Cache-Control'=>'no-store']);
    }
    public static function assets(): void {
        if (!self::enabled() || is_admin()) return;
        wp_enqueue_script('boopay-tracking',plugins_url('assets/tracking.js',BOOPAY_PLUGIN_FILE),[], '0.1.0',true);
        wp_localize_script('boopay-tracking','boopayTracking',['base'=>rest_url('boopay/v1/'),'nonce'=>wp_create_nonce('wp_rest'),
            'consented'=>(bool)self::session(),'productId'=>is_product()?(int)get_queried_object_id():null]);
    }
}
