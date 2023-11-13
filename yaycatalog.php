
<?php

/**
 * Plugin Name:     YayCatalog
 * Plugin URI:      https://yaycommerce.com/
 * Description:     Starter plugin. Training basic WordPress plugin development.
 * Author:          Yay Commerce
 * Author URI:      https://yaycommerce.com/
 * Text Domain:     yaycatalog
 * Domain Path:     /languages
 * Version:         1.0.0.3
 *
 * @package YayCatalog
 */

if (!defined('ABSPATH')) {
    die('We\'re sorry, but you can not directly access this file.');
}

define('YAY_CATALOG_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('YAY_CATALOG_PLUGIN_URL', plugin_dir_url(__FILE__));
define('YAY_CATALOG_IS_DEVELOPMENT', true);

if (!wp_installing()) {

    add_action(
        'plugins_loaded',
        function () {
            include YAY_CATALOG_PLUGIN_PATH . 'includes/pages/catalog-admin.php';
            include YAY_CATALOG_PLUGIN_PATH . 'includes/enqueue/catalog-app.php';
            include YAY_CATALOG_PLUGIN_PATH . 'includes/api/catalog-api.php';
        }
    );

    // add_action('init', function () {
    //     register_post_type('yayhero');
    // });
}
