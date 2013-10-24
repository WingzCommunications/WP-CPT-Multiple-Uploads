add_action( 'wp_ajax_resume_ajax_set_header', 'resume_ajax_set_header' );
function resume_ajax_set_header() {
    global $post;

    if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
        $post_id = filter_input( INPUT_POST, 'post_id', FILTER_SANITIZE_NUMBER_INT );

        if ( ! empty( $_POST['custom_header'] ) ) {
            if ( is_array( $_POST['custom_header'] ) ) {
                $custom_header_ids = implode(',', $_POST['custom_header'] );
            } else {
                $custom_header_ids = $_POST['custom_header'];
            }

            update_post_meta( $post_id, '_kwpn_custom_header', $custom_header_ids );
        } else {
            delete_post_meta( $post_id, '_kwpn_custom_header' );
        }

        $content = '';

        if ( ! empty( $_POST['custom_header'] ) ) {

            if ( ! is_array( $_POST['custom_header'] ) ) {
                $custom_headers = preg_split('/,/', $_POST['custom_header'], -1, PREG_SPLIT_NO_EMPTY);
            } else {
                $custom_headers = $_POST['custom_header'];
            }

            $attachments = get_posts( array(
                'post_type' => 'attachment',
                'posts_per_page' => -1,
                'post_parent' => $post_id,
                'exclude'     => get_post_thumbnail_id($post_id)
            ) );

            if ( $attachments ) {
                $content .= '<ul>';
                foreach ( $attachments as $attachment ) {
                    $class = "post-attachment mime-" . sanitize_title( $attachment->post_mime_type );
                    $attachment_url = wp_get_attachment_url($attachment->ID);
                    $content .= '<li class="' . $class . ' data-design-thumbnail"><a href="' . $attachment_url . '">' . $attachment->post_title . '</a></li>';
                }
                $content .= '</ul>';
            }
            wp_reset_postdata();
        }

        wp_send_json_success( $content );
    }
