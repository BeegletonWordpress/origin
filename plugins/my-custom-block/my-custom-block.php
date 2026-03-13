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
    register_block_type( __DIR__ . '/build/header/row' );
    register_block_type( __DIR__ . '/build/header/column' );
    
    register_block_type( __DIR__ . '/build/mega-menu-item' );
    
    register_block_type( __DIR__ . '/build/handdrawn-button' );
    register_block_type( __DIR__ . '/build/handdrawn-card' );
    register_block_type( __DIR__ . '/build/handdrawn-container' );
    register_block_type( __DIR__ . '/build/handdrawn-header' );

    register_block_type( __DIR__ . '/build/case-grid' );
    register_block_type( __DIR__ . '/build/hero' );
}
add_action( 'init', 'create_block_my_custom_block_block_init' );