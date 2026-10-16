<?php
/**
 * Plugin Name: BooPay — Integração WooCommerce
 * Description: Catálogo e eventos consentidos para a API BooPay.
 * Version: 0.1.0
 * Requires at least: 6.8
 * Requires PHP: 8.1
 * WC requires at least: 10.2
 * WC tested up to: 10.2.2
 * Text Domain: boopay
 * License: GPL-2.0-or-later
 */
defined('ABSPATH') || exit;
define('BOOPAY_PLUGIN_FILE', __FILE__);
require_once __DIR__ . '/includes/class-boopay-signed-http-client.php';
require_once __DIR__ . '/includes/class-boopay-plugin.php';
require_once __DIR__ . '/includes/class-boopay-catalog.php';
require_once __DIR__ . '/includes/class-boopay-tracking.php';
register_activation_hook(__FILE__, [Boopay_Plugin::class, 'activate']);
register_deactivation_hook(__FILE__, [Boopay_Plugin::class, 'deactivate']);
add_action('before_woocommerce_init', static function() {
    if (class_exists('\Automattic\WooCommerce\Utilities\FeaturesUtil')) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
    }
});
add_action('plugins_loaded', static function() {
    if (!defined('WC_VERSION') || version_compare(WC_VERSION, '10.2', '<')) {
        add_action('admin_notices', static function() {
            if (current_user_can('activate_plugins')) echo '<div class="notice notice-error"><p>BooPay requer WooCommerce 10.2 ou superior. A integração está pausada.</p></div>';
        });
        return;
    }
    Boopay_Plugin::boot();
});
