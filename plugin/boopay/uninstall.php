<?php
defined('WP_UNINSTALL_PLUGIN') || exit;
if (function_exists('as_unschedule_all_actions')) {
    foreach (['boopay_dispatch','boopay_initial','boopay_parent_refresh'] as $hook) as_unschedule_all_actions($hook,null,'boopay');
}
global $wpdb;
$names=$wpdb->get_col($wpdb->prepare("SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE %s",$wpdb->esc_like('boopay_').'%'));
foreach ($names as $name) delete_option($name);
$wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}boopay_revisions");
// Exclusão local apenas. Desconectar antes para revogar a credencial remota.
