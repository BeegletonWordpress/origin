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
    register_block_type( __DIR__ . '/build/handdrawn-container' );
    register_block_type( __DIR__ . '/build/handdrawn-header' );
    register_block_type( __DIR__ . '/build/contact-card' );

    register_block_type( __DIR__ . '/build/case-grid' );
    register_block_type( __DIR__ . '/build/hero' );
    register_block_type( __DIR__ . '/build/subpage-hero' );
    register_block_type( __DIR__ . '/build/team-gallery' );

    register_block_type( __DIR__ . '/build/logo-slider' );
    register_block_type( __DIR__ . '/build/logo-slider/item' );

    register_block_type( __DIR__ . '/build/count-up-numbers' );
    register_block_type( __DIR__ . '/build/count-up-numbers/item' );

    register_post_meta('post', 'team_member_role', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);
}
add_action( 'init', 'create_block_my_custom_block_block_init' );

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