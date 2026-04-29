<?php
/**
 * Plugin Name:       My Custom Block
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       my-custom-block
 *
 * @package CreateBlock
 */
function create_block_my_custom_block_block_init() {
    register_block_type( __DIR__ . '/build/footer/block' );
    register_block_type( __DIR__ . '/build/footer/row' );
    register_block_type( __DIR__ . '/build/footer/column' );
    register_block_type( __DIR__ . '/build/footer/logos' );
    register_block_type( __DIR__ . '/build/footer/logo-item' );

    register_block_type( __DIR__ . '/build/header/block' );

    register_block_type( __DIR__ . '/build/animation/arrow' );

    register_block_type( __DIR__ . '/build/mega-menu-item' );

    register_block_type( __DIR__ . '/build/handdrawn-button' );
    register_block_type( __DIR__ . '/build/handdrawn-card' );
    register_block_type( __DIR__ . '/build/small-handdrawn-card' );
    register_block_type( __DIR__ . '/build/handdrawn-container' );
    register_block_type( __DIR__ . '/build/handdrawn-header' );
    register_block_type( __DIR__ . '/build/contact-card' );

    register_block_type( __DIR__ . '/build/case-grid' );
    register_block_type( __DIR__ . '/build/hero' );

    register_block_type( __DIR__ . '/build/subpage-template' );
    register_block_type( __DIR__ . '/build/subpage-hero' );
    register_block_type( __DIR__ . '/build/customer-case-hero' );
    register_block_type( __DIR__ . '/build/alt-subpage-hero' );
    register_block_type( __DIR__ . '/build/contact-info' );
    register_block_type( __DIR__ . '/build/subpage-content' );

    register_block_type( __DIR__ . '/build/team-gallery' );

    register_block_type( __DIR__ . '/build/logo-slider' );
    register_block_type( __DIR__ . '/build/logo-slider/item' );

    register_block_type( __DIR__ . '/build/count-up-numbers' );
    register_block_type( __DIR__ . '/build/count-up-numbers/inner' );
    register_block_type( __DIR__ . '/build/count-up-numbers/item' );

    register_post_meta('post', 'team_member_role', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);
}
add_action( 'init', 'create_block_my_custom_block_block_init' );

function register_customer_case_post_type() {
    $labels = [
        'name' => 'Customer Cases',
        'singular_name' => 'Customer Case',
        'menu_name' => 'Customer Cases',
        'add_new' => 'Add New',
        'add_new_item' => 'Add New Customer Case',
        'edit_item' => 'Edit Customer Case',
        'new_item'           => 'New Customer Case',
        'view_item'          => 'View Customer Case',
        'search_items'       => 'Search Customer Cases',
        'not_found'          => 'No customer cases found',
        'not_found_in_trash' => 'No customer cases found in trash',
    ];

    $args = [
        'labels'              => $labels,
        'public'              => true,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => true,
        'query_var'           => true,
        'rewrite'             => ['slug' => 'case'],
        'capability_type'     => 'post',
        'has_archive'         => true,
        'hierarchical'        => false,
        'menu_position'       => 5,
        'menu_icon'           => 'dashicons-businessman',
        'supports'            => [
            'title',
            'editor',
            'thumbnail',
            'excerpt',
            'custom-fields',
        ],
    ];

    register_post_type('customer_case', $args);

    register_post_meta( 'customer_case', 'hero_tagline', [
        'show_in_rest' => true,
        'single'       => true,
        'type'         => 'string',
    ] );

    register_post_meta( 'customer_case', 'hero_theme', [
        'show_in_rest' => true,
        'single'       => true,
        'type'         => 'string',
    ] );
}
add_action('init', 'register_customer_case_post_type');

function register_customer_case_metaboxes() {
    add_meta_box(
        'customer_case_settings',
        'Customer Case Settings',
        'render_customer_case_metabox',
        'customer_case',
        'side',
        'high'
    );
}
add_action( 'add_meta_boxes', 'register_customer_case_metaboxes' );

function render_customer_case_metabox( $post ) {
    $meta = get_post_meta( $post->ID, 'hero_tagline', true );
    wp_nonce_field( 'customer_case_meta', 'customer_case_nonce' );
    ?>
    <label for="hero_tagline">Service Tagline</label>
    <select name="hero_tagline" id="hero_tagline" style="margin-top:5px;">
        <option value="">Välj en tjänst...</option>
        <option value="Marknadsstrategi & Position" <?php selected( $meta, 'Marknadsstrategi & Position' ); ?>>Marknadsstrategi & Position</option>
        <option value="Identitet & Varumärke" <?php selected( $meta, 'Identitet & Varumärke' ); ?>>Identitet & Varumärke</option>
        <option value="Workshop & Strategiarbete" <?php selected( $meta, 'Workshop & Strategiarbete' ); ?>>Workshop & Strategiarbete</option>
        <option value="Webbutveckling & Design" <?php selected( $meta, 'Webbutveckling & Design' ); ?>>Webbutveckling & Design</option>
        <option value="Designsystem & UX" <?php selected( $meta, 'Designsystem & UX' ); ?>>Designsystem & UX</option>
        <option value="Content & Filmproduktion" <?php selected( $meta, 'Content & Filmproduktion' ); ?>>Content & Filmproduktion</option>
        <option value="Performance Marketing" <?php selected( $meta, 'Performance Marketing' ); ?>>Performance Marketing</option>
        <option value="Mäss- & Eventmaterial" <?php selected( $meta, 'Mäss- & Eventmaterial' ); ?>>Mäss- & Eventmaterial</option>
        <option value="SEO & GEO Anpassat Innehåll" <?php selected( $meta, 'SEO & GEO Anpassat Innehåll' ); ?>>SEO & GEO Anpassat Innehåll</option>
    </select>
    <?php
    $theme = get_post_meta( $post->ID, 'hero_theme', true );
    ?>
    <label for="hero_theme" style="display:block; margin-top:12px;">Hero Theme</label>
    <select name="hero_theme" id="hero_theme" style="margin-top:5px;">
        <option value="default" <?php selected( $theme, 'default' ); ?>>Default (Accent 1)</option>
        <option value="dark_1" <?php selected( $theme, 'dark_1' ); ?>>Dark 1 (Dark Gray/Blue)</option>
        <option value="dark_2" <?php selected( $theme, 'dark_2' ); ?>>Dark 2 (Dark Gray/Yellow)</option>
        <option value="light_1" <?php selected( $theme, 'light_1' ); ?>>Light 1 (Light Yellow/Blue)</option>
        <option value="light_2" <?php selected( $theme, 'light_2' ); ?>>Light 2 (Light Yellow/Yellow)</option>
    </select>
    <?php
}

function save_customer_case_metabox( $post_id ) {
    if ( ! isset( $_POST['customer_case_nonce'] ) || 
         ! wp_verify_nonce( $_POST['customer_case_nonce'], 'customer_case_meta' ) ) {
        return;
    }
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( isset( $_POST['hero_tagline'] ) ) {
        update_post_meta( $post_id, 'hero_tagline', sanitize_text_field( $_POST['hero_tagline'] ) );
    }
    if ( isset( $_POST['hero_theme'] ) ) {
        update_post_meta( $post_id, 'hero_theme', sanitize_text_field( $_POST['hero_theme'] ) );
    }
}
add_action( 'save_post_customer_case', 'save_customer_case_metabox' );

/**
 * Enqueue Lenis smooth scroll.
 */
function lenis_enqueue() {
    wp_enqueue_style(
        'lenis',
        'https://unpkg.com/lenis@1.3.21/dist/lenis.css',
        [],
        '1.3.21'
    );

    wp_enqueue_script(
        'lenis',
        'https://unpkg.com/lenis@1.3.21/dist/lenis.min.js',
        [],
        '1.3.21',
        true
    );

    wp_add_inline_script( 'lenis', '
        window.lenis = new Lenis({
            autoRaf: true,
            autoToggle: true,
            anchors: true,
            allowNestedScroll: true,
            naiveDimensions: true,
            stopInertiaOnNavigate: true
        })
    ' );
}
add_action( 'wp_enqueue_scripts', 'lenis_enqueue' );

/**
 * Enqueue dotlottie-player script for the frontend.
 */
function animated_arrow_frontend_scripts() {
    if ( ! has_block( 'my-custom-block/animation-arrow' ) ) {
        return;
    }

    wp_enqueue_script(
        'animated-arrow-frontend',
        plugin_dir_url( __FILE__ ) . 'build/animation/arrow/view.js',
        [],
        '1.0.0',
        true
    );
}
add_action( 'wp_enqueue_scripts', 'animated_arrow_frontend_scripts' );

/**
 * Enqueue logo slider script for the frontend.
 */
function logo_slider_frontend_scripts() {
    if ( ! has_block( 'create-block/my-logo-slider' ) ) {
        return;
    }

    wp_enqueue_script(
        'logo-slider-frontend',
        plugin_dir_url( __FILE__ ) . 'build/logo-slider/view.js',
        [],
        '1.0.0',
        true
    );
}
add_action( 'wp_enqueue_scripts', 'logo_slider_frontend_scripts' );

/**
 * Enqueue number counter script for the frontend.
 */
function count_up_numbers_frontend_scripts() {
    if ( ! has_block( 'create-block/my-count-up-numbers' ) ) {
        return;
    }

    wp_enqueue_script(
        'count-up-numbers-frontend',
        plugin_dir_url( __FILE__ ) . 'build/count-up-numbers/view.js',
        [],
        '1.0.0',
        true
    );
}
add_action( 'wp_enqueue_scripts', 'count_up_numbers_frontend_scripts' );

/**
 * Enqueue hero block parallax script for the frontend.
 */
function hero_parallax_frontend_scripts() {
    if ( ! has_block( 'create-block/hero' ) ) {
        return;
    }

    wp_enqueue_script(
        'hero-parallax-frontend',
        plugin_dir_url( __FILE__ ) . 'build/hero/view.js',
        [],
        '1.0.0',
        true
    );
}
add_action( 'wp_enqueue_scripts', 'hero_parallax_frontend_scripts' );

/**
 * Enqueue subpage hero script for the frontend.
 */
function subpage_hero_frontend_scripts() {
    if ( ! has_block( 'my-custom-block/subpage-hero' ) ) {
        return;
    }

    wp_enqueue_script(
        'subpage-hero-frontend',
        plugin_dir_url( __FILE__ ) . 'build/subpage-hero/view.js',
        [],
        '1.0.0',
        true
    );
}
add_action( 'wp_enqueue_scripts', 'subpage_hero_frontend_scripts' );

/**
 * Show all customer cases (no pagination) for main query.
 */
function show_all_customer_cases( $query ) {
    if ( ! is_admin() && $query->is_main_query() && $query->get( 'post_type' ) === 'customer_case' ) {
        $query->set( 'posts_per_page', -1 );
    }
}
add_action( 'pre_get_posts', 'show_all_customer_cases' );

/**
 * Register block template for customer_case archive.
 */
function register_customer_case_archive_template() {
    $template_content = '
    <!-- wp:template-part {"slug":"header"} /-->
    <!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->
    <main class="wp-block-group">
        <!-- wp:heading {"textAlign":"center","level":1,"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|40"}}}} -->
        <h1 class="has-text-align-center">All Customer Cases</h1>
        <!-- /wp:heading -->
        <!-- wp:create-block/my-case-grid {"postsPerPage":100} /-->
    </main>
    <!-- /wp:group -->
    <!-- wp:template-part {"slug":"footer"} /-->
    ';

    register_block_template( 'my-custom-block//archive-customer_case', [
        'title'       => __( 'Customer Case Archive', 'my-custom-block' ),
        'description' => __( 'Displays all customer cases at /case/all', 'my-custom-block' ),
        'content'     => $template_content,
        'post_types'  => [ 'customer_case' ],
    ] );
}
add_action( 'init', 'register_customer_case_archive_template', 20 );

/**
 * Enqueue customer case hero script for single customer case pages.
 */
function customer_case_hero_frontend_scripts() {
    if ( ! has_block( 'create-block/customer-case-hero' ) && ! is_singular( 'customer_case' ) ) {
        return;
    }

    wp_enqueue_script(
        'customer-case-hero-frontend',
        plugin_dir_url( __FILE__ ) . 'build/customer-case-hero/view.js',
        [],
        '1.0.0',
        true
    );
}
add_action( 'wp_enqueue_scripts', 'customer_case_hero_frontend_scripts' );