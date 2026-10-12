<?php
// Usa exclusivamente o ambiente descartável gerado por serve-browser-qa.ts.
$meta=json_decode(file_get_contents(__DIR__.'/../.test-artifacts/browser-current.json'),true);
$_SERVER['HTTP_HOST']='localhost:8089';$_SERVER['REQUEST_METHOD']='GET';
require $meta['wp'].'/wp-load.php';
if(in_array('--product',$argv,true)&&!get_option('boopay_qa_product_id')){
    // Origem HTTPS lógica somente no seed CLI; o browser permanece em localhost HTTP.
    $logical=static fn($url)=>str_replace('http://localhost:8089','https://store.example',$url);
    add_filter('home_url',$logical);
    $product=new WC_Product_Simple();$product->set_name('Camiseta de teste BooPay');$product->set_status('publish');$product->set_regular_price('39.90');$product->save();
    update_option('boopay_qa_product_id',$product->get_id());remove_filter('home_url',$logical);
}
if(in_array('--drain',$argv,true))ActionScheduler_QueueRunner::instance()->run();
global $wpdb;
$jobs=$wpdb->get_col($wpdb->prepare("SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE %s",$wpdb->esc_like('boopay_job_').'%'));
$by_kind=[];
foreach($jobs as $name){$job=get_option($name);$kind=$job['payload']['kind']??'other';$by_kind[$kind]=($by_kind[$kind]??0)+1;}
$health=Boopay_Plugin::client()->send('/v1/integrations/health',(object)[]);
echo json_encode(['wordpress'=>get_bloginfo('version'),'woocommerce'=>WC_VERSION,'tracking'=>(bool)get_option('boopay_tracking'),'connected'=>(bool)Boopay_Plugin::credentials(),
 'product_id'=>(int)get_option('boopay_qa_product_id'),'pending_jobs'=>count($jobs),'pending_by_kind'=>$by_kind,'health'=>is_wp_error($health)?$health->get_error_code():json_decode(wp_remote_retrieve_body($health),true)],JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE)."\n";
