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
}
add_action('init', 'register_customer_case_post_type');

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