<?php
// Teste de integração em instalação descartável. Nunca instalar este script na loja.
$root = getenv('BOOPAY_QA_ROOT');
if (!$root || !is_file($root.'/wordpress/wp-load.php')) throw new RuntimeException('Configure BOOPAY_QA_ROOT para uma loja sintética.');
$_SERVER['HTTP_HOST']='store.example'; $_SERVER['HTTPS']='on'; $_SERVER['REQUEST_METHOD']='GET';
define('WP_DISABLE_FATAL_ERROR_HANDLER',true);
require $root.'/wordpress/wp-load.php';
require_once ABSPATH.'wp-admin/includes/plugin.php';
add_filter('action_scheduler_queue_runner_time_limit',static fn()=>180);
if (!defined('WC_VERSION')) throw new RuntimeException('WooCommerce não ativo.');
add_filter('http_request_host_is_external',static fn($allowed,$host)=>$host==='api.boopay.localtest.me' ? true : $allowed,10,2);
add_filter('http_allowed_safe_ports',static fn($ports)=>array_merge($ports,[8443]));
add_filter('http_request_args',static function($args,$url) use($root) {
    if(str_starts_with($url,'https://api.boopay.localtest.me:8443/')) $args['sslcertificates']=$root.'/cert.pem';
    return $args;
},10,2);
add_action('http_api_curl',static function($handle) use($root) {
    curl_setopt($handle,CURLOPT_CAINFO,$root.'/cert.pem');
    curl_setopt($handle,CURLOPT_RESOLVE,['api.boopay.localtest.me:8443:127.0.0.1']);
    curl_setopt($handle,CURLOPT_PROXY,'');
});
add_action('http_api_debug',static function($response) { if(is_wp_error($response)) error_log('QA transport: '.$response->get_error_code().' '.$response->get_error_message()); });
$checks=[];
function verify($condition,$name) { global $checks; if (!$condition) throw new RuntimeException($name); $checks[]=['case'=>$name,'passed'=>true]; }
$zip=new ZipArchive(); verify($zip->open(getenv('BOOPAY_QA_ZIP'))===true,'ZIP aberto pelo instalador PHP');
$zip->extractTo(WP_PLUGIN_DIR); $zip->close();
$result=activate_plugin('boopay/boopay.php'); verify(!is_wp_error($result),'Plugin instalado e ativado sem fatal');
if (!class_exists('Boopay_Plugin')) throw new RuntimeException('Plugin indisponível.');
Boopay_Plugin::boot();
wp_set_current_user(1);
verify(current_user_can('manage_woocommerce'),'Administrador pode configurar');
verify((bool)get_option('boopay_tracking',false)===false,'Tracking desligado por padrão');
$result=Boopay_Plugin::pairing('https://api.boopay.localtest.me:8443',getenv('BOOPAY_QA_CODE'));
verify(!is_wp_error($result),'Pareamento HTTPS real com CA verificada'.(is_wp_error($result)?' ('.$result->get_error_code().')':''));
verify(!get_option('boopay_code'),'Código temporário não persistido');
$creds=Boopay_Plugin::credentials();
ob_start(); Boopay_Plugin::screen(); $screen=ob_get_clean();
verify(!str_contains($screen,$creds['token']) && !str_contains($screen,$creds['signing_secret']),'Tela administrativa sem segredos');
file_put_contents($root.'/admin-screen.html','<!doctype html><meta charset="utf-8"><title>BooPay QA</title>'.$screen);
$subscriber=wp_create_user('synthetic_subscriber',bin2hex(random_bytes(24)),'subscriber@example.invalid');
if(is_wp_error($subscriber))$subscriber=username_exists('synthetic_subscriber');
wp_set_current_user($subscriber); ob_start(); Boopay_Plugin::screen(); $hidden=ob_get_clean(); verify($hidden==='','Usuário sem capacidade não recebe tela'); wp_set_current_user(1);
// Loja vazia: página vazia é enviada e concluída.
Boopay_Catalog::start(); Boopay_Catalog::initial();
function jobs() { global $wpdb; return $wpdb->get_col($wpdb->prepare("SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE %s",$wpdb->esc_like('boopay_job_').'%')); }
function drain() { for($i=0;$i<30;$i++) { if(!jobs())return; ActionScheduler_QueueRunner::instance()->run(); } throw new RuntimeException('queue_not_drained'); }
drain(); verify(get_option('boopay_sync')['state']==='complete','Loja vazia encerra com sucesso');
$simple=new WC_Product_Simple(); $simple->set_name('Camiseta sintética'); $simple->set_status('publish'); $simple->set_regular_price('39.90'); $simple->set_manage_stock(true); $simple->set_stock_quantity(5); $simple->save();
$variable=new WC_Product_Variable(); $variable->set_name('Caneca sintética'); $variable->set_status('publish'); $variable->save();
$variation=new WC_Product_Variation(); $variation->set_parent_id($variable->get_id()); $variation->set_status('publish'); $variation->set_regular_price('29.90'); $variation->set_attributes(['cor'=>'azul']); $variation->set_manage_stock(true); $variation->set_stock_quantity(3); $variation->save(); WC_Product_Variable::sync($variable->get_id());
Boopay_Catalog::changed($variable->get_id()); drain();
$health=Boopay_Plugin::client()->send('/v1/integrations/health',(object)[]);
verify(!is_wp_error($health) && json_decode(wp_remote_retrieve_body($health),true)['catalog_count']===2,'Simples e variável recebidos na API por hooks reais');
$simple->set_regular_price('44.90'); $simple->set_stock_quantity(2); $simple->save(); drain();
$snap=Boopay_Catalog::snapshot($simple->get_id()); verify($snap['price']==='44.90' && $snap['stock']===2,'Preço e estoque alterados');
$upload=wp_upload_bits('qa-synthetic.png',null,base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aF1sAAAAASUVORK5CYII='));
$attachment=wp_insert_attachment(['post_mime_type'=>'image/png','post_title'=>'Imagem sintética','post_status'=>'inherit'],$upload['file']);
$simple->set_image_id($attachment);$simple->save();drain();
verify(count(Boopay_Catalog::snapshot($simple->get_id())['images'])===1,'Imagem HTTPS preservada no snapshot');
$variation->delete(true); do_action('boopay_parent_refresh',$variable->get_id()); drain();
$snap=Boopay_Catalog::snapshot($variable->get_id()); verify(count($snap['variations'])===0,'Remoção da última variação gera snapshot vazio');
$simple->delete(true); drain();
$health=Boopay_Plugin::client()->send('/v1/integrations/health',(object)[]);
verify(json_decode(wp_remote_retrieve_body($health),true)['catalog_count']===1,'Exclusão incremental recebida');
// Mais de uma página, com runner real; cursor salvo após confirmação.
$extras=[];
for($i=0;$i<21;$i++){ $p=new WC_Product_Simple();$p->set_name('Página sintética '.$i);$p->set_status('publish');$p->set_regular_price('12.00');$p->save();$extras[]=$p; }
drain(); Boopay_Catalog::start();
for($i=0;$i<12 && get_option('boopay_sync')['state']!=='complete';$i++)ActionScheduler_QueueRunner::instance()->run();
verify(get_option('boopay_sync')['state']==='complete' && get_option('boopay_sync')['cursor']>0,'Catálogo com 22 produtos paginado pelo runner real');
$health=Boopay_Plugin::client()->send('/v1/integrations/health',(object)[]);
verify(json_decode(wp_remote_retrieve_body($health),true)['catalog_count']===22,'Todas as páginas recebidas sem duplicação');
foreach($extras as $p)$p->delete(true); drain();
// Consentimento: cookie assinado sintético segue exatamente o formato emitido.
verify(Boopay_Tracking::queue('view',null)===false,'Sem consentimento não há evento');
update_option('boopay_tracking',true,false); verify(Boopay_Tracking::queue('view',null)===false,'Tracking habilitado ainda exige consentimento');
$consent_request=new WP_REST_Request('POST','/boopay/v1/consent');
$consent_request->set_header('origin','https://store.example'); $consent_request->set_header('x-wp-nonce',wp_create_nonce('wp_rest'));
$consent_request->set_header('content-type','application/json'); $consent_request->set_body('{"granted":true}');
verify(Boopay_Tracking::permission($consent_request),'Consentimento exige origem e nonce válidos');
verify(Boopay_Tracking::consent($consent_request)->get_data()['granted']===true,'Consentimento explícito aceito pela rota WordPress');
$consent_request->set_header('origin','https://foreign.example'); verify(!Boopay_Tracking::permission($consent_request),'Origem externa recusada');
$session=bin2hex(random_bytes(16)); $expires=time()+86400;
$_COOKIE['boopay_consent']=$session.'.'.$expires.'.'.hash_hmac('sha256',$session.'.'.$expires,wp_salt('auth'));
verify(Boopay_Tracking::queue('view',$variable->get_id()),'Evento consentido enfileirado'); drain();
$health=Boopay_Plugin::client()->send('/v1/integrations/health',(object)[]); $data=json_decode(wp_remote_retrieve_body($health),true);
verify(($data['last_event']['kind']??'')==='view','Saúde consulta evento persistido sem edição do banco');
$cart_product=new WC_Product_Simple();$cart_product->set_name('Evento sintético');$cart_product->set_status('publish');$cart_product->set_regular_price('7.00');$cart_product->save();drain();
// Configuração real emitida pelo WordPress: localização de traduções altera tipos escalares.
$previous_query=$GLOBALS['wp_query'];$GLOBALS['wp_query']=new WP_Query(['post_type'=>'product','p'=>$cart_product->get_id()]);
Boopay_Tracking::assets();$inline=wp_scripts()->get_data('boopay-tracking','before');
$configuration=json_decode(substr(end($inline),strlen('window.boopayTracking = '),-1),true);
verify(($configuration['consented']??null)===true,'Configuração JS preserva consentimento booleano');
verify(($configuration['productId']??null)===$cart_product->get_id(),'Configuração JS preserva ID de produto numérico');
$GLOBALS['wp_query']=$previous_query;
wc_load_cart();verify((bool)WC()->cart->add_to_cart($cart_product->get_id()),'Adição real ao carrinho gera hook consentido');drain();
$health=Boopay_Plugin::client()->send('/v1/integrations/health',(object)[]);verify(json_decode(wp_remote_retrieve_body($health),true)['last_event']['kind']==='add_to_cart','add_to_cart recebido na API');
verify(Boopay_Tracking::queue('exit_intent',null),'exit_intent consentido enfileirado');drain();
$health=Boopay_Plugin::client()->send('/v1/integrations/health',(object)[]);verify(json_decode(wp_remote_retrieve_body($health),true)['last_event']['kind']==='exit_intent','exit_intent recebido na API');
unset($_COOKIE['boopay_consent']); verify(Boopay_Tracking::queue('exit_intent',null)===false,'Revogação interrompe novos eventos');
file_put_contents($root.'/timeout.flag','1'); $started=microtime(true);
try { $timeout=Boopay_Plugin::client()->send('/v1/integrations/health',(object)[]); }
finally { unlink($root.'/timeout.flag'); }
$elapsed=microtime(true)-$started;
verify(is_wp_error($timeout) && $timeout->get_error_code()==='boopay_transport_error' && $elapsed>=9 && $elapsed<14,'Timeout real de dez segundos encerra transporte');
// Falha temporária passa pelo transporte WordPress, sem trocar o código da fila.
$failure=static fn()=>new WP_Error('http_request_failed','SYNTHETIC_SECRET_MUST_NOT_LEAK');
add_filter('pre_http_request',$failure,10,3);
$id=Boopay_Catalog::enqueue('/v1/admin/catalog/sync',['version'=>1,'event_id'=>wp_generate_uuid4(),'merchant_id'=>$creds['merchant_id'],'items'=>[]]);
Boopay_Catalog::dispatch($id); $job=get_option('boopay_job_'.$id); verify($job['state']==='retry' && $job['attempt']===1,'Falha temporária agenda retentativa');
verify(as_has_scheduled_action('boopay_dispatch',[$id],'boopay')!==false,'Retentativa inspecionável no Action Scheduler');
for($i=0;$i<4;$i++)Boopay_Catalog::dispatch($id);
verify(get_option('boopay_job_'.$id)['state']==='failed','Limite de cinco tentativas');
verify(!str_contains(wp_json_encode(get_option('boopay_diagnostic')),'SYNTHETIC_SECRET'),'Diagnóstico não expõe erro remoto');
remove_filter('pre_http_request',$failure,10); Boopay_Catalog::retry_failed(); drain(); verify(!get_option('boopay_job_'.$id),'Repetição manual recupera fila');
$permanent=static fn()=>['response'=>['code'=>400,'message'=>'Bad Request'],'body'=>'PRIVATE_ERROR','headers'=>[],'cookies'=>[]];
add_filter('pre_http_request',$permanent,10,3);
$id=Boopay_Catalog::enqueue('/v1/admin/catalog/sync',['version'=>1,'event_id'=>wp_generate_uuid4(),'merchant_id'=>$creds['merchant_id'],'items'=>[]]);
Boopay_Catalog::dispatch($id); verify(get_option('boopay_job_'.$id)['state']==='failed','400 permanente não entra em loop'); remove_filter('pre_http_request',$permanent,10);
update_option('woocommerce_custom_orders_table_enabled','yes');
verify(\Automattic\WooCommerce\Utilities\OrderUtil::custom_orders_table_usage_is_enabled(),'HPOS habilitado no ambiente');
verify(Boopay_Plugin::disconnect(),'Desconexão revoga credencial pela API');
verify(!Boopay_Plugin::credentials() && !jobs(),'Desconexão apaga credenciais/jobs');
$before=count(jobs()); Boopay_Catalog::changed($variable->get_id()); verify(count(jobs())===$before,'Nenhum novo envio após desconexão');
deactivate_plugins('boopay/boopay.php'); verify(!Boopay_Plugin::credentials(),'Desativação segura');
uninstall_plugin('boopay/boopay.php'); verify(get_option('boopay_api',null)===null,'Desinstalação remove configurações');
update_option('active_plugins',['boopay/boopay.php']); // Próximo processo valida guarda sem WooCommerce.
$report=['date'=>gmdate('c'),'wordpress'=>$GLOBALS['wp_version'],'woocommerce'=>WC_VERSION,'php'=>PHP_VERSION,
    'database'=>getenv('BOOPAY_QA_DB')==='mysql'?'MySQL '.$wpdb->db_version():'SQLite adapter (not MySQL qualification)',
    'tls'=>'HTTPS real, CA local provided only to QA HTTP requests; sslverify true','timeout_seconds'=>round($elapsed,2),'checks'=>$checks,'human_review'=>'pending'];
file_put_contents(getenv('BOOPAY_QA_REPORT'),wp_json_encode($report,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
echo count($checks).' verificações WordPress concluídas.';
