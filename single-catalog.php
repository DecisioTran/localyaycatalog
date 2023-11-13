<?php
function yay_catalog_custom_post_type()
{
    $supports = array(
        'title',      // post title
        'editor',     // post content editor
        'thumbnail',  // featured images
        'excerpt',    // post excerpt
        'custom-fields', // custom fields
    );

    $args = array(
        'supports'     => $supports,
        'public'       => true,
        'has_archive'  => true,
        'rewrite'      => array('slug' => 'catalogs'), // your custom slug
        'labels'       => array(
            'name'          => 'Yay Catalogs',
            'singular_name' => 'Yay Catalog',
            'add_new_item'  => 'Add New Yay Catalog',
            'edit_item'     => 'Edit Yay Catalog',
            'all_items'     => 'All Yay Catalogs',
            'view_item'     => 'View Yay Catalog',
            'search_items'  => 'Search Yay Catalogs',
            'not_found'     => 'No Yay Catalogs found',
            'not_found_in_trash' => 'No Yay Catalogs found in Trash',
        ),
    );

    register_post_type('yay_catalog', $args);
}
add_action('init', 'yay_catalog_custom_post_type');
