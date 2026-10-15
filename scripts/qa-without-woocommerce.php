<?php
$_SERVER['HTTP_HOST']='store.example'; $_SERVER['HTTPS']='on';
define('WP_DISABLE_FATAL_ERROR_HANDLER',true);
require getenv('BOOPAY_QA_ROOT').'/wordpress/wp-load.php';
wp_set_current_user(1);
if(defined('WC_VERSION'))throw new RuntimeException('WooCommerce deveria estar ausente neste processo.');
ob_start(); do_action('admin_notices'); $notice=ob_get_clean();
if(!str_contains($notice,'BooPay requer WooCommerce'))throw new RuntimeException('Aviso de dependência ausente.');
echo 'WooCommerce ausente: aviso exibido, sem fatal e integração pausada.';
