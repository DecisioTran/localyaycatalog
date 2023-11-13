<?php

/****************************************Shortcode*************************************************/
function yay_catalog_shortcode()
{
	// Query 4 catalog đầu tiên
	$args = array(
		'post_type' => 'yay_catalog',
		'posts_per_page' => 4,
	);

	$catalogs = new WP_Query($args);

	// Hiển thị danh sách catalog
	if ($catalogs->have_posts()) {
		$output = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">';

		while ($catalogs->have_posts()) {
			$catalogs->the_post();

			// Lấy thông tin catalog
			$title = get_the_title();
			$subtitle = get_the_content();
			$image = get_post_meta(get_the_ID(), 'image', true);
			$tags = get_post_meta(get_the_ID(), 'tag', true);

			// Hiển thị thông tin
			$output .= '<div class="border p-4">';
			$output .= '<img src="' . esc_url($image) . '" alt="' . esc_attr($title) . '" class="w-full h-auto mb-2 catalog-image">';
			// $output .= '<img src="' . esc_url($image) . '" alt="' . esc_attr($title) . '" class="w-full mb-2">';
			$output .= '<h3 class="text-lg font-semibold">' . esc_html($title) . '</h3>';
			$output .= '<p class="text-sm text-gray-600 mb-2">' . esc_html($subtitle) . '</p>';

			if (!empty($tags)) {
				$output .= '<ul class="flex space-x-2">';
				foreach ($tags as $tag) {
					$output .= '<li class="text-xs bg-gray-200 p-1 rounded">' . esc_html($tag) . '</li>';
				}
				$output .= '</ul>';
			}

			$output .= '</div>';
		}

		$output .= '</div>';

		// Reset post data
		wp_reset_postdata();

		return $output;
	} else {
		return 'No catalogs found.';
	}
}

add_shortcode('yay_catalog', 'yay_catalog_shortcode');
