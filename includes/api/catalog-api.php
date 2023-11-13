<?php
function yaycatalog_api_routes()
{
    register_rest_route('yay_catalog/v1', '/get_catalogs', array(
        'methods' => 'GET',
        'callback' => 'yay_catalog_get_callback',
        'permission_callback' => function () {
            return current_user_can('read');
        }
    ));

    register_rest_route('yay_catalog/v1', '/get/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_single_yaycatalog',
        'permission_callback' => function () {
            return current_user_can('read');
        }
    ));

    register_rest_route('yay_catalog/v1', '/add', array(
        'methods' => 'POST',
        'callback' => 'add_yaycatalog',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));

    register_rest_route('yay_catalog/v1', '/edit/(?P<id>\d+)', array(
        'methods' => 'PUT',
        'callback' => 'edit_yaycatalog',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));

    register_rest_route('yay_catalog/v1', '/delete/(?P<id>\d+)', array(
        'methods' => 'DELETE',
        'callback' => 'delete_yaycatalog',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
}
add_action('rest_api_init', 'yaycatalog_api_routes');

function yay_catalog_get_callback($request)
{
    // Set up the query arguments
    $args = array(
        'post_type' => 'yay_catalog',
        'post_status' => 'publish',
        'posts_per_page' => -1, // Retrieve all posts
    );

    // Run the query
    $query = new WP_Query($args);

    // Get the posts from the query
    $posts = $query->get_posts();

    $result = [];

    // Loop through each post and retrieve the post meta fields
    foreach ($posts as $post) {
        // $result['image'] = get_post_meta($post->ID, 'image', true);
        // $result['tag'] = get_post_meta($post->ID, 'tag', true);

        $catalog = [
            'key' => $post->ID,
            'title' => $post->post_title,
            'subtitle' => $post->post_content,
            'image' => get_post_meta($post->ID, 'image', true),
            'tag' => get_post_meta($post->ID, 'tag', true)
        ];

        $result[] = $catalog;
    }

    return $result;
}

function get_single_yaycatalog($data)
{
    $id = $data['id'];

    $yaycatalog = get_post($id);

    if (!$yaycatalog) {
        // return new WP_Error('Failed', __("This catalog can not be found!"));
        return wp_send_json_error(__('This catalog can not be found!'), 404);
    }

    $result = [
        'title' => $yaycatalog->post_title,
        'subtitle' => $yaycatalog->post_content,
        'image' => get_post_meta($yaycatalog->ID, 'image', true),
        'tag' => get_post_meta($yaycatalog->ID, 'tag', true)
    ];
    return $result;
}


function add_yaycatalog($request)
{
    $params = $request->get_params();

    // Get the data from the request
    $title = $params['title'];
    $subtitle = $params['subtitle'];
    $image = $params['image'];
    $tag = $params['tag'];


    // Create a new post object
    $new_post = array(
        'post_title' => $title,
        'post_content' => $subtitle,
        'post_type' => 'yay_catalog',
        'post_status' => 'publish'
    );

    // Insert the post into the database
    $post_id = wp_insert_post($new_post);

    // Update the post meta with the additional data
    // update_post_meta($post_id, 'key', $key);
    update_post_meta($post_id, 'image', $image);
    update_post_meta($post_id, 'tag', $tag);

    // Return a success message
    return array(
        'success' => true,
        'message' => 'Catalog saved successfully'
    );
}

function edit_yaycatalog(WP_REST_Request $request)
{
    $id = $request->get_param('id');
    $payload = $request->get_json_params();

    $title = $payload['title'];
    $subtitle = $payload['subtitle'];
    $image = $payload['image'];
    $tag = $payload['tag'];

    $post_id = wp_update_post(array(
        'ID' => $id,
        'post_title' => $title,
        'post_content' => $subtitle,
    ));

    if (!$post_id) {
        return new WP_Error('failed', __("This catalog cannot be found!"));
    }

    // Save additional meta data if needed
    update_post_meta($post_id, 'image', $image);
    update_post_meta($post_id, 'tag', $tag);

    return rest_ensure_response(array('success' => true, 'message' => 'Successfully edited the post', 'reload' => true));
}

function delete_yaycatalog($data)
{
    $id = $data['id'];

    $result = wp_delete_post($id, true);

    if ($result === false) {
        return rest_ensure_response(array('error' => 'Failed to delete YayCatalog'));
    }

    return rest_ensure_response(array('success' => true));
}


//  public function get_items_permissions_check( $request ) {
//     //return true; <--use to make readable by all
//     return current_user_can( 'edit_something' );
//   }

//   /**
//    * Check if a given request has access to get a specific item
//    *
//    * @param WP_REST_Request $request Full data about the request.
//    * @return WP_Error|bool
//    */
//   public function get_item_permissions_check( $request ) {
//     return $this->get_items_permissions_check( $request );
//   }
