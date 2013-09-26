<?php

// key thing here is the wp_send_json_success(), is required to get wp.media.post to work.  this will show the image in the box
// after they have chosen. again will have to explode the string and get all the images?

add_action( 'wp_ajax_kwpn_set_header', array( $this, 'ajax_set_header' ) );
public function ajax_set_header() {
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			$post_id = filter_input( INPUT_POST, 'post_id', FILTER_SANITIZE_NUMBER_INT );
			if ( filter_input( INPUT_POST, 'custom_header', FILTER_SANITIZE_NUMBER_INT ) ) {
				$custom_header = filter_input( INPUT_POST, 'custom_header', FILTER_SANITIZE_NUMBER_INT );
				update_post_meta( $post_id, '_kwpn_custom_header', $custom_header );
			} else {
				delete_post_meta( $post_id, '_kwpn_custom_header' );
			}
			
			$content = '';
			
			if ( ! empty( $custom_header ) ) {
				
				$source = wp_get_attachment_image_src( $custom_header, 'small' );
				
				if ( isset( $source[0] ) ) {
					$content .= "<img src='{$source[0]}'/>";
				}
				
				$content .= "<a href='#' class='kwpn-image-remove-button'>";
				$content .=		__( 'Remove header image', 'wp_kwpn' );
				$content .= "</a>";
			}
			
			wp_send_json_success( $content );
		}
	}
