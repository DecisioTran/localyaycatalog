<?php

function yaycatalog_enqueue_catalog_app()
{
    yaycatalog_register_entry();

    add_action('admin_head', 'yaycatalog_register_preload_modules');
}

function yaycatalog_register_entry()
{
    //Load file script 
    add_filter(
        'script_loader_tag',
        function ($tag, $handle, $src) {
            if (strpos($handle, 'module/yaycatalog/') !== false) {
                $str  = "type='module'";
                $str .= YAY_CATALOG_IS_DEVELOPMENT ? ' crossorigin' : '';
                $tag  = '<script ' . $str . ' src="' . $src . '" id="' . $handle . '-js"></script>';
            }
            return $tag;
        },
        10,
        3
    );

    //Register, Enqueue and Localize(make localized datas available to JS files)
    wp_register_script("module/yaycatalog/main.tsx", "http://localhost:3000/main.tsx", ['react', 'react-dom'], null, true); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
    wp_enqueue_script("module/yaycatalog/main.tsx");
    wp_localize_script("module/yaycatalog/main.tsx", "yayCatalogData", [
        'isRtl' => is_rtl(),
        'restUrl' => esc_url_raw(rest_url()),
        'restNonce' => wp_create_nonce('wp_rest'),
        'auth' => [
            'canWrite' => current_user_can('manage_options'), //user can manage options
            'canRead' => current_user_can('read') //user can read
        ],
        'initialCatalogs' => yaycatalog_get_intitial_catalog(),

    ]);
}

function yaycatalog_get_intitial_catalog()
{
    $args = array(
        'post_type' => 'yay_catalog',
        'post_status' => 'publish',
        'posts_per_page' => -1, // Retrieve all posts
    );

    // Run the query
    $query = new WP_Query($args);

    // // Get the posts from the query
    // $posts = $query->get_posts();

    $found_posts = $query->found_posts;
    if (!$found_posts) {
        // If no catalogs exist, save initial catalogs to the database
        $initialCatalogs = array(
            // Define your initial catalogs here
            array(
                'title' => "Gym Club",
                'subtitle' => "gym club",
                'image' => "Gym No. 1 Lake Park",
                'tag' => ["gym", "club"],
            ),
            array(
                'title' => "Football Club",
                'subtitle' => "football club",
                'image' => "Football No. 1 Lake Park",
                'tag' => ["football", "club"],
            ),
        );

        foreach ($initialCatalogs as $catalog) {
            $newPost = array(
                'post_title' => $catalog['title'],
                'post_content' => $catalog['subtitle'],
                'post_type' => 'yay_catalog',
                'post_status' => 'publish',
            );

            $postId = wp_insert_post($newPost);

            // Save additional meta data
            add_post_meta($postId, 'image', $catalog['image']);
            add_post_meta($postId, 'tag', $catalog['tag']);
        }
    }

    // Retrieve the saved catalogs
    $query->reset_postdata();
    $posts = $query->get_posts();

    // Return the array of catalogs
    $catalogs = array();
    foreach ($posts as $post) {
        $catalogs[] = array(
            'title' => $post->post_title,
            'subtitle' => $post->post_content,
            'key' => $post->ID,

            // Retrieve additional meta data
            'image' => get_post_meta($post->ID, 'image', true),
            'tag' => get_post_meta($post->ID, 'tag', true)
        );
    }

    return $catalogs;
}


//Echo ability of React Refresh and Vite plugins for React to admin-head-page
function yaycatalog_register_preload_modules()
{
    echo '<script type="module">
        import RefreshRuntime from "http://localhost:3000/@react-refresh"
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
        </script>';
}
