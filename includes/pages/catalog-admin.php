<?php

function yaycatalog_render_admin_page()
{
    include YAY_CATALOG_PLUGIN_PATH . 'templates/pages/catalog-admin.php';
}

/** @var WP_Post */
$a = get_post(1);

add_action('admin_menu', 'yaycatalog_add_admin_page'); // Add menu page
function yaycatalog_add_admin_page()
{
    add_menu_page(
        __('Catalog', 'yaycatalog'),
        __('Catalog', 'yaycatalog'),
        'read',
        'yaycatalog/yaycatalog-admin.php',
        'yaycatalog_render_admin_page', //function for executing -> render admin page
        'dashicons-welcome-widgets-menus',
        30
    );
}


//enqueue resources to admin page
add_action('admin_enqueue_scripts', 'yaycatalog_enqueue_admin_page');
function yaycatalog_enqueue_admin_page($hook_suffix)
{
    //Check whether current page the admin page -> yes: enqueue 
    if ('toplevel_page_yaycatalog/yaycatalog-admin' !== $hook_suffix) {
        return;
    }

    yaycatalog_enqueue_catalog_app();
}
