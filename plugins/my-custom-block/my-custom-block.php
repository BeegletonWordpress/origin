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
    register_block_type( __DIR__ . '/build/my-footer-block' );
    register_block_type( __DIR__ . '/build/my-footer-row' );
    register_block_type( __DIR__ . '/build/my-footer-column' );
    register_block_type( __DIR__ . '/build/my-footer-logos' );
    register_block_type( __DIR__ . '/build/my-footer-logo-item' );

    register_block_type( __DIR__ . '/build/my-header-block' );
    register_block_type( __DIR__ . '/build/my-header-row' );
    register_block_type( __DIR__ . '/build/my-header-column' );
    register_block_type( __DIR__ . '/build/my-mega-menu-item' );
}
add_action( 'init', 'create_block_my_custom_block_block_init' );