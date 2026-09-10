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
//require_once plugin_dir_path( __FILE__ ) . 'includes/case-editor.php';

function create_block_my_custom_block_block_init() {
    register_block_type( __DIR__ . '/build/breadcrumb' );

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
    register_block_type( __DIR__ . '/build/small-handdrawn-card-row' );
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

    register_block_type( __DIR__ . '/build/service-block' );
    register_block_type( __DIR__ . '/build/service-block/service-card' );

    register_block_type( __DIR__ . '/build/scroll-sections' );
    register_block_type( __DIR__ . '/build/scroll-sections/scroll-section' );

    register_block_type( __DIR__ . '/build/label' );

    register_post_meta('post', 'team_member_role', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);
}
add_action( 'init', 'create_block_my_custom_block_block_init' );

add_action('wp_enqueue_scripts', function() {
  wp_add_inline_style('global-styles', '
    :root {
        --wp--preset--spacing--20: clamp(0.568rem, 0.68vw, 0.568rem);
        --wp--preset--spacing--30: clamp(0.71rem, 0.85vw, 0.71rem);
        --wp--preset--spacing--40: clamp(0.96rem, 1.15vw, 0.96rem);
        --wp--preset--spacing--50: clamp(1.28rem, 1.85vw, 1.5rem);
        --wp--preset--spacing--60: clamp(1.6rem, 2.77vw, 2.25rem);
        --wp--preset--spacing--70: clamp(2.24rem, 4.15vw, 3.375rem);
        --wp--preset--spacing--80: clamp(3.2rem, 6.25vw, 5.063rem);
    }
  ');
}, 20);

function register_customer_case_post_type() {
    $labels = [
        'name' => 'Kundcase',
        'singular_name' => 'Kundcase',
        'menu_name' => 'Kundcase',
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
            'page-attributes'
        ],
    ];

    register_post_type('customer_case', $args);

	$taxonomy_labels = [
		'name'              => 'Case Categories',
		'singular_name'     => 'Case Category',
		'search_items'      => 'Search Case Categories',
		'all_items'         => 'All Case Categories',
		'parent_item'       => 'Parent Case Category',
		'parent_item_colon' => 'Parent Case Category:',
		'edit_item'         => 'Edit Case Category',
		'update_item'       => 'Update Case Category',
		'add_new_item'      => 'Add New Case Category',
		'new_item_name'     => 'New Case Category Name',
		'menu_name'         => 'Case Categories',
	];    

	register_taxonomy(
		'customer_case_category',
		['customer_case'],
		[
			'labels'            => $taxonomy_labels,
			'hierarchical'      => true,
			'public'            => true,
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_rest'      => true,
		    'rest_base'         => 'case-categories',            
			'query_var'         => true,
			'rewrite'           => [
				'slug' => 'case-category',
			],
		]
	);

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

function add_aria_current_to_cpt_archive( $block_content, $block ) {
    error_log( 'navigation-link found, url: ' . ( $block['attrs']['url'] ?? 'no url' ) );
    error_log( 'is_post_type_archive: ' . ( is_post_type_archive( 'customer_case' ) ? 'true' : 'false' ) );
    error_log( 'archive link: ' . get_post_type_archive_link( 'customer_case' ) );
    
    if ( $block['blockName'] !== 'core/navigation-link' ) {
        return $block_content;
    }

    if ( is_post_type_archive( 'customer_case' ) ) {
        $archive_link = get_post_type_archive_link( 'customer_case' );
        $block_url = $block['attrs']['url'] ?? '';

        // Normalise both URLs: make relative, strip trailing slash
        $archive_path = rtrim( parse_url( $archive_link, PHP_URL_PATH ), '/' );
        $block_path   = rtrim( parse_url( $block_url, PHP_URL_PATH ), '/' );

        if ( $block_path && $block_path === $archive_path ) {
            error_log( 'Match found — adding aria-current' );
            $block_content = str_replace(
                '<a ',
                '<a aria-current="page" ',
                $block_content
            );
        }
    }

    return $block_content;
}
add_filter( 'render_block', 'add_aria_current_to_cpt_archive', 10, 2 );
    

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
        '1.0.1',
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
 * Add CPT for Medarbetare
*/
function beegleton_register_medarbetare_post_type() {
	register_post_type(
		'medarbetare',
		array(
			'labels' => array(
				'name'          => 'Medarbetare',
				'singular_name' => 'Medarbetare',
				'add_new_item'  => 'Lägg till medarbetare',
				'edit_item'     => 'Redigera medarbetare',
			),
			'public'       => true,
			'show_in_rest' => true,
			'menu_icon'    => 'dashicons-groups',
			'supports'     => array(
				'title',
				'thumbnail',
			),
			'has_archive'  => false,
			'rewrite'      => array(
				'slug' => 'medarbetare',
			),
		)
	);
}

add_action( 'init', 'beegleton_register_medarbetare_post_type' );


function beegleton_register_medarbetare_meta() {
	$string_fields = [ 'employe_role', 'employe_phone', 'employe_mail' ];
	foreach ( $string_fields as $field ) {
		register_post_meta( 'medarbetare', $field, [
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'string', 
		] );
	}

	$image_fields = [ 'employe_image', 'employe_hover_image' ];
	foreach ( $image_fields as $field ) {
		register_post_meta( 'medarbetare', $field, [
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'integer', // attachment ID
		] );
	}
}
add_action( 'init', 'beegleton_register_medarbetare_meta' );
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

function breadcrumb_frontend_styles() {
    wp_enqueue_style(
        'breadcrumb-style',
        plugin_dir_url( __FILE__ ) . 'build/breadcrumb/style-index.css',
        [],
        '1.0.0'
    );
}
add_action( 'wp_enqueue_scripts', 'breadcrumb_frontend_styles' );

/**
 * Output the SVG clipPath used to shape Max Mega Menu submenus.
 */
function beegleton_output_submenu_clip_path() {
	?>
	<svg width="0" height="0" style="position:absolute" aria-hidden="true">
		<defs>
			<clipPath id="beegleton-submenu-clip" clipPathUnits="objectBoundingBox">
				<path d="M0.707054,1c0.000738,0,0.001623,0,0.002509,0c-0.00059,-0.000147,-0.001476,0,-0.002509,0ZM0.776712,0.963289c0.002952,-0.00279,0.001033,-0.005727,-0.003542,-0.00558c-0.011216,0.000294,0.000295,0.008811,0.003542,0.00558ZM0.983028,0.085609c-0.005756,-0.031571,-0.009298,-0.057709,-0.011954,-0.071806c0,-0.005286,0,-0.009985,0,-0.013803H0.015643c0,0.008076,0.000885,0.023054,0.001771,0.046696c0,0.011601,0,0.023935,-0.00059,0.034068c-0.000148,0.003671,-0.003247,0.032746,-0.001623,0.033774c0.001771,0.001175,0.001623,0.003524,-0.000295,0.004552c0,0,-0.005165,0.005286,-0.012544,0.413363c0,0.008076,-0.000295,0.0163,-0.000443,0.02467c-0.000148,0.011013,-0.000443,0.02232,-0.00059,0.033774c-0.000885,0.055947,-0.007084,0.156975,0.015643,0.280764c0.004723,0.026285,0.008117,0.048752,0.010626,0.06373c0.000295,0.039501,0.000443,0.046402,0.001181,0.047137c0.000738,0.000587,0.013725,0.000294,0.030254,0c0.003247,0,0.006494,0,0.009888,0c0.011364,0,0.023465,0,0.033796,0.000441c0.007822,-0.001322,0.020366,-0.001468,0.022285,0.000734c0.001328,0.001468,0.003689,0.000147,0.007379,-0.004112c0.006051,-0.007048,0.011364,-0.008664,0.009888,-0.002937c-0.001181,0.004993,0.001771,0.006902,0.011068,0.007342c0.012987,0.000734,0.020956,0.00279,0.027745,-0.000294c0.009298,-0.004258,0.006346,0.004552,0.013282,0.000587c0.005608,-0.003231,0.011068,0.002643,0.016529,-0.000734c0.004575,-0.00279,0,0,0.024351,0.001028c0.028188,0.001028,0.02686,0.007342,0.029811,0.002937c0.002804,-0.004405,0.010035,-0.001175,0.010478,-0.006608l0.000443,-0.007195c0.000295,-0.00514,0.003099,-0.004405,0.004132,0.001175c0.001181,0.006461,0.005313,0.003671,0.005313,0.007195c0,0.003818,0.006051,0.01395,0.010921,0.006314c0.003837,-0.005874,0.005903,0.005874,0.014168,-0.000587c0.006936,-0.005433,0.009593,0.000734,0.008117,-0.00514c-0.001623,-0.006021,0.002656,-0.004699,0.004575,0.001322c0.001476,0.004846,0.002656,0.00514,0.013577,0.004405c0.013135,-0.000881,0.014168,-0.001468,0.011511,-0.006314c-0.001033,-0.001762,-0.001328,-0.003965,-0.000885,-0.004846c0.00546,-0.00837,0.005313,0.012775,0.012102,0.012335c0.005903,-0.000294,0.026564,0.003965,0.028188,0.001615c0.001181,-0.001909,0.025089,0.000734,0.029516,0.003231c0.000148,0,0.000443,0.000147,0.00059,0.000294c0.000443,0,0.001033,0,0.001623,0h0c0.00059,-0.000147,0.001181,-0.000734,0.001476,-0.001322c0.002214,-0.00558,0.009888,0.001028,0.007969,-0.007489c-0.001771,-0.00793,0.003099,-0.002056,0.006789,-0.00793c0.003099,-0.004699,0.010035,0.011307,0.010035,0.012628c0,0.002056,0.002509,0.003818,0.005165,0.004699c0.001623,0,0.003247,0,0.00487,0c0.001919,0,0.003985,0,0.006051,0c0.001476,0,0.002952,0,0.004427,0c0.002361,-0.001615,0.005165,-0.004405,0.008855,-0.004552c0.00487,0.001028,0.004427,0.004405,0.010773,-0.000294h0c0.000295,0.000294,0.00059,0.000587,0.000885,0.001028c0.004132,0.00514,0.026269,-0.001468,0.033501,0.004846c0.001623,0,0.003247,0,0.004723,0c0.025384,0.000441,0.052686,0.001028,0.081612,0.001468c0,-0.000441,0,-0.000881,0,-0.001175c-0.000148,-0.004112,0.000443,-0.007195,0.001476,-0.008664h0c0.001033,-0.001468,0.002361,-0.001175,0.003394,0.001322c0.000148,0.000441,0.00059,0.000734,0.001033,0.001175c0.001181,0.000734,0.003099,0.001175,0.005018,0.001175c0.005756,0,0.003542,0.001468,0.001328,0.004846c-0.000295,0.000441,-0.00059,0.001028,-0.000885,0.001468c0.018743,0.000294,0.042503,0.001175,0.070396,0.001468c0.000738,0,0.001623,0,0.002509,0c0.003247,0,0.006494,0,0.009888,0c-0.002952,-0.000294,-0.006051,-0.001175,-0.00856,-0.002056c-0.003099,-0.001175,-0.005608,-0.002643,-0.006346,-0.004112c-0.001328,-0.002349,-0.002214,-0.002496,-0.002952,-0.000734c-0.000738,0.001762,-0.001623,0.001468,-0.003099,-0.000734c-0.002804,-0.004846,-0.001181,-0.005727,0.014168,-0.007048c0.00487,-0.000441,0.008117,-0.000587,0.010183,-0.000294c0.002509,0.000294,0.003394,0.001175,0.003394,0.002643c0,0,0,0.000147,0,0.000294c0.000295,0.00558,0.009888,0.004258,0.012249,0.008517c0.000443,0.000881,0.000738,0.002056,0.000443,0.003377c0.001033,0,0.002214,0,0.003247,0c0,-0.000881,0.000148,-0.002056,0.001181,-0.003231c0.000738,-0.000881,0.001623,-0.001762,0.002952,-0.00279c0.004427,-0.003377,0.005165,-0.003377,0.008412,0.000441c0.00059,0.000734,0.001181,0.001468,0.001623,0.001909c0.001328,0.001615,0.001476,0.002349,0.000443,0.003377c0.000885,0,0.001771,0,0.002656,0c0.001033,0,0.002066,0,0.003099,0c0.003985,0,0.008117,-0.000294,0.012249,-0.000441c0.003394,0,0.006789,-0.000294,0.010183,-0.000441c0.00428,-0.000294,0.00856,-0.000441,0.012987,-0.000734c-0.000885,-0.000441,-0.001919,-0.001322,-0.003099,-0.002349c-0.004723,-0.004552,-0.010478,-0.013216,-0.00974,-0.0163c0.00059,-0.002496,0.000885,-0.002349,0.001033,0.000587c0.000148,0.004699,0.008117,0.006755,0.007527,-0.002496c-0.000738,-0.012482,-0.009593,-0.001468,-0.011806,-0.013363c-0.001476,-0.008223,-0.003837,-0.004405,-0.003985,-0.008076c0,-0.000587,0.001476,-0.001175,0.003837,-0.001615c0.000295,0,0.000443,0,0.000738,-0.000147c0.002214,-0.000441,0.00487,-0.000734,0.007674,-0.000881c0.002952,-0.000147,0.005903,-0.000147,0.008412,0c0.003837,0.000294,0.006346,0.001175,0.005313,0.002643c-0.002656,0.004112,-0.002361,0.007489,0.00059,0.005874c0.001328,-0.000881,0.002361,0,0.002361,0.001762c0,0.001175,-0.000295,0.002203,-0.000885,0.003377c-0.001181,0.00279,-0.003394,0.00558,-0.003837,0.009398c-0.000295,0.002349,0,0.00514,0.002066,0.008517c0.00059,0.001028,0.001476,0.002203,0.002361,0.003377c0.003837,0.004846,0.005903,0.00558,0.006641,0.004846c0.001033,-0.000881,0,-0.004258,-0.001181,-0.004258c-0.000295,0,-0.00059,0,-0.000885,-0.000294c-0.001919,-0.001175,-0.000443,-0.006902,0.003985,-0.001762c0.001033,0.001175,0.002066,0.00279,0.003247,0.004993c0.000443,0.000734,0.000738,0.001468,0.001181,0.002056c0.00059,0.001175,0.001181,0.002056,0.001623,0.002643c0.002066,-0.000147,0.004132,-0.000294,0.006198,-0.000587c0.000885,-0.000881,0.002214,-0.001762,0.003837,-0.002349c0.003099,-0.001175,0.006789,-0.001468,0.008707,0.000587c0.000148,0.000147,0.000295,0.000294,0.000443,0.000587c0.002066,-0.000147,0.004132,-0.000441,0.006198,-0.000587c0.008264,-0.000881,0.016677,-0.001909,0.025236,-0.003084c0.002214,-0.000294,0.004575,-0.000587,0.006789,-0.000881c0.001623,-0.004112,0.002804,-0.009985,0.013282,-0.010279c0.003247,0,0.003689,-0.000587,0.001771,-0.002349c0,0,-0.000148,-0.000147,-0.000295,-0.000294c-0.002214,-0.002349,0.003099,-0.002349,0.005018,-0.001615c0.000738,0.000294,0.000885,0.000587,0.000295,0.001028c-0.002804,0.001762,-0.002361,0.008811,-0.000295,0.006755c0.002214,-0.002056,0.004575,-0.001762,0.006346,0c0.000738,0.000734,0.001328,0.001615,0.001771,0.002643c0.001181,-0.000147,0.002214,-0.000294,0.003247,-0.000587c0.001476,-0.000294,0.002952,-0.000441,0.004427,-0.000734c0.001476,-0.000294,0.002952,-0.000587,0.004575,-0.000734c0.000295,0,0.000738,0,0.001033,-0.000147c0.019038,-0.003377,0.036157,-0.006021,0.049734,-0.008223c0.003837,-0.000587,0.007379,-0.001175,0.010773,-0.001762c0.002952,-0.000441,0.005608,-0.000881,0.007969,-0.001322c0.006789,-0.001175,0.011216,-0.002203,0.012987,-0.003231h0c0.000885,-0.000441,0.001181,-0.003084,0.001033,-0.008223c0,-0.002349,0,-0.00514,-0.000295,-0.008664c0.000148,-0.001175,0.000148,-0.003818,0.000148,-0.007783c-0.004575,-0.000441,-0.010478,-0.000881,-0.018005,-0.001175c-0.001033,0,-0.002066,0,-0.003099,0c-0.002804,0,-0.00546,-0.000294,-0.007822,-0.000294c-0.036305,-0.001468,-0.015053,-0.002203,0.002214,-0.003818c0.003247,-0.000294,0.006494,-0.000734,0.009002,-0.001028c0.002066,-0.000294,0.003837,-0.000734,0.00487,-0.001028c0.008855,-0.003231,0.005756,-0.000441,0.012544,0.001615c0,-0.00514,-0.000148,-0.011454,-0.000295,-0.018209c0,-0.001762,0,-0.003671,0,-0.00558c0,-0.004846,0,-0.009692,0,-0.014684v-0.001468c0,-0.005874,0.000148,-0.011601,0.000443,-0.016887c0,-0.000587,0,-0.001028,0,-0.001615c0,-0.000881,0,-0.001762,0,-0.002496c0.000148,-0.003671,0.003247,-0.032746,0.001623,-0.033774c-0.001771,-0.001175,-0.001623,-0.003524,0.000295,-0.004552c0,0,0.003837,-0.003965,0.009593,-0.265639c0.000148,-0.00793,0.000295,-0.016006,0.00059,-0.024523c0.001033,-0.051101,0.002214,-0.11116,0.003394,-0.181791c0.001033,-0.055947,0.007084,-0.156975,-0.015496,-0.280764ZM0.795602,0.944347c-0.000148,0,-0.000443,0,-0.00059,0c-0.004575,0,-0.008855,0,-0.012987,-0.000147c-0.00856,0,-0.015939,-0.000294,-0.020956,-0.000441c-0.001919,0,-0.003542,0,-0.004723,0c-0.001033,0,-0.001771,0,-0.002066,0c-0.001328,0,-0.002509,0,-0.003542,0c-0.005608,-0.000147,-0.00915,-0.000441,-0.010921,-0.000881c-0.001476,-0.000294,-0.001919,-0.000587,-0.001328,-0.000881h0c0.000885,-0.000441,0.003542,-0.001028,0.007674,-0.001615c0.001328,-0.000147,0.002952,-0.000294,0.004723,-0.000587c0.002509,-0.000294,0.005313,-0.000587,0.008412,-0.000881c0.002656,-0.000294,0.005313,-0.000441,0.008264,-0.000587c0.002214,-0.000147,0.004427,-0.000294,0.006789,-0.000441c0.003099,-0.000147,0.006346,-0.000441,0.00974,-0.000587c0.006346,-0.000294,0.012987,-0.000587,0.019481,-0.000881c0.003394,0,0.006789,-0.000294,0.010035,-0.000294c0.01343,-0.000294,0.026269,-0.000294,0.036452,0.000147c0.01461,0.000734,0.023465,0.002496,0.019628,0.005874c-0.000885,0.000734,-0.004427,0.001322,-0.010035,0.001615h0c-0.014168,0.001028,-0.041027,0.001028,-0.063902,0.000734ZM0.873229,0.967401c-0.002066,0,-0.00428,0.001175,-0.00487,0.002643c-0.001623,0.004112,-0.003542,-0.003084,-0.008264,-0.002203c-0.002656,0.000441,-0.00487,0.000734,-0.006789,0.000734c-0.012397,0.000294,-0.009298,-0.007636,-0.007969,-0.007636c0.002214,0,-0.00059,0.003671,0.005756,0.003965c0.002361,0,0.003394,-0.000294,0.002066,-0.001028c-0.001623,-0.000881,-0.001181,-0.002203,0.001623,-0.004552c0.005165,-0.004405,0.003985,-0.002937,-0.012839,-0.004258c-0.036305,-0.002937,0.030844,-0.005727,0.024203,-0.001615c-0.000885,0.000587,-0.001623,0.001322,-0.002214,0.002203c-0.001771,0.002349,-0.002214,0.005286,0,0.004699c0.005165,-0.001615,0.021989,0.007048,0.009298,0.007342ZM0.927686,0.942291c-0.001919,0,-0.004427,0.001322,-0.00546,0.002937c-0.002656,0.004112,-0.003247,-0.000734,-0.006494,-0.001468c-0.001033,-0.000147,-0.002214,0,-0.003689,0.000734c0,0,0,0,-0.000148,0c-0.005165,0.00279,-0.008117,0.001762,-0.01343,0c-0.002066,-0.000587,-0.004427,-0.001322,-0.007379,-0.001909c-0.001476,-0.000294,-0.003247,-0.000587,-0.005018,-0.000734c-0.016677,-0.001762,-0.013577,-0.003084,-0.00487,-0.003965c0.000738,0,0.001623,-0.000147,0.002361,-0.000294c0.002066,-0.000147,0.004427,-0.000441,0.006936,-0.000587c0.007527,-0.000587,0.015643,-0.001028,0.019185,-0.001615c0.001181,-0.000147,0.001919,-0.000294,0.001919,-0.000587c0.002214,-0.00558,0.033058,0.006755,0.016234,0.007048Z"/>
			</clipPath>
		</defs>
	</svg>
	<?php
}
add_action( 'wp_footer', 'beegleton_output_submenu_clip_path' );

function beegleton_output_mobile_dropdown_clip_path() {
	?>
	<svg width="0" height="0" style="position:absolute" aria-hidden="true">
		<defs>
			<clipPath id="beegleton-mobile-dropdown-clip" clipPathUnits="objectBoundingBox">
				<path d="M0.707054,1c0.000738,0,0.001623,0,0.002509,0c-0.00059,-0.000141,-0.001476,0,-0.002509,0ZM0.776712,0.964674c0.002952,-0.002685,0.001033,-0.005511,-0.003542,-0.00537c-0.011216,0.000283,0.000295,0.008478,0.003542,0.00537ZM0.983028,0.120249c-0.005756,-0.03038,-0.009298,-0.055532,-0.012102,-0.069097c-0.000295,-0.028402,-0.000443,-0.033913,-0.001033,-0.034478c-0.001328,-0.00113,-0.046783,0.00113,-0.075708,-0.000424c-0.003689,-0.000141,-0.03291,-0.003109,-0.033943,-0.001413c-0.001181,0.001696,-0.003542,0.001554,-0.004575,-0.000283c0,0,-0.005756,-0.00537,-0.474321,-0.013c-0.056228,-0.000848,-0.157763,-0.006783,-0.282172,0.014978c-0.043684,0.00763,-0.077184,0.011163,-0.082349,0.01413h0c-0.002066,0.00113,-0.000738,0.01625,0.000738,0.052282c0,0.011163,0,0.023032,-0.00059,0.032782c-0.000148,0.003533,-0.003247,0.031511,-0.001476,0.0325c0.001771,0.00113,0.001623,0.003391,-0.000295,0.00438c0,0,-0.005165,0.005087,-0.012544,0.397767c0,0.007772,-0.000295,0.015685,-0.000443,0.023739c-0.000148,0.010598,-0.000443,0.021478,-0.00059,0.0325c-0.001033,0.053836,-0.007084,0.151053,0.015496,0.270171c0.004723,0.025293,0.008117,0.046913,0.010626,0.061325c0.000295,0.03801,0.000443,0.044652,0.001181,0.045358c0.000738,0.000565,0.013725,0.000283,0.030254,0c0.003247,0,0.006494,0,0.009888,0c0.011364,0,0.023465,0,0.033796,0.000424c0.007822,-0.001272,0.020366,-0.001413,0.022285,0.000707c0.001328,0.001413,0.003689,0.000141,0.007527,-0.003956c0.006051,-0.006783,0.011364,-0.008337,0.009888,-0.002826c-0.001181,0.004804,0.001771,0.006641,0.011068,0.007065c0.012987,0.000707,0.020956,0.002685,0.027745,-0.000283c0.009298,-0.004098,0.006346,0.00438,0.013282,0.000565c0.005608,-0.003109,0.011068,0.002543,0.016529,-0.000707c0.004575,-0.002685,0,0,0.024351,0.000989c0.028188,0.000989,0.02686,0.007065,0.029811,0.002826c0.002804,-0.004239,0.010035,-0.00113,0.010478,-0.006359l0.000443,-0.006924c0.000295,-0.004946,0.003099,-0.004239,0.004132,0.00113c0.001181,0.006217,0.005313,0.003533,0.005313,0.006924c0,0.003674,0.006051,0.013424,0.010921,0.006076c0.003837,-0.005652,0.005903,0.005652,0.014168,-0.000565c0.006936,-0.005228,0.009593,0.000707,0.008117,-0.004946c-0.001623,-0.005793,0.002656,-0.004522,0.004575,0.001272c0.001476,0.004663,0.002656,0.004946,0.013577,0.004239c0.013135,-0.000848,0.014168,-0.001413,0.011511,-0.006076c-0.001033,-0.001696,-0.001328,-0.003815,-0.000738,-0.004663c0.00546,-0.008054,0.005313,0.012293,0.012102,0.011869c0.005903,-0.000283,0.026564,0.003815,0.028188,0.001554c0.001328,-0.001837,0.025089,0.000707,0.029516,0.003109c0.000148,0,0.000443,0.000141,0.00059,0.000283c0.00059,0,0.001033,0,0.001623,0h0c0.000738,-0.000141,0.001181,-0.000707,0.001476,-0.001272c0.002214,-0.00537,0.009888,0.000989,0.007969,-0.007206c-0.001771,-0.00763,0.003099,-0.001978,0.006789,-0.00763c0.003099,-0.004522,0.010035,0.01088,0.010035,0.012152c0,0.001978,0.002509,0.003674,0.005165,0.004522c0.001623,0,0.003247,0,0.00487,0c0.001919,0,0.003985,0,0.006051,0c0.001476,0,0.002952,0,0.004427,0c0.002361,-0.001554,0.005165,-0.004239,0.008855,-0.00438c0.00487,0.000989,0.004427,0.004239,0.010773,-0.000283h0c0.000295,0.000283,0.00059,0.000565,0.000885,0.000989c0.00428,0.004946,0.026269,-0.001413,0.033501,0.004663c0.001623,0,0.003247,0,0.004723,0c0.025384,0.000424,0.052686,0.000989,0.081612,0.001413c0,-0.000424,0,-0.000848,0,-0.00113c-0.000148,-0.003956,0.000443,-0.006924,0.001476,-0.008337h0c0.001033,-0.001413,0.002361,-0.00113,0.003394,0.001272c0.000148,0.000424,0.00059,0.000707,0.001033,0.00113c0.001181,0.000707,0.003099,0.00113,0.005018,0.00113c0.005756,0,0.003542,0.001413,0.001328,0.004663c-0.000295,0.000424,-0.00059,0.000989,-0.000885,0.001413c0.018743,0.000283,0.042503,0.00113,0.070396,0.001413c0.000885,0,0.001623,0,0.002509,0c0.003247,0,0.006494,0,0.009888,0c-0.002952,-0.000283,-0.006051,-0.00113,-0.008707,-0.001978c-0.003099,-0.00113,-0.005608,-0.002543,-0.006346,-0.003956c-0.001328,-0.002261,-0.002214,-0.002402,-0.002952,-0.000707c-0.000738,0.001696,-0.001623,0.001413,-0.002952,-0.000707c-0.002804,-0.004663,-0.001181,-0.005511,0.014168,-0.006783c0.005018,-0.000424,0.008117,-0.000565,0.010331,-0.000283c0.002509,0.000283,0.003394,0.00113,0.003394,0.002543c0,0,0,0.000141,0,0.000283c0.000295,0.00537,0.009888,0.004098,0.012249,0.008196c0.000443,0.000848,0.000738,0.001978,0.000443,0.00325c0.001033,0,0.002214,0,0.003247,0c0,-0.000848,0.000148,-0.001978,0.001181,-0.003109c0.000738,-0.000848,0.001623,-0.001696,0.002952,-0.002685c0.004427,-0.00325,0.005165,-0.00325,0.008412,0.000424c0.000738,0.000707,0.001181,0.001413,0.001623,0.001837c0.001328,0.001554,0.001476,0.002261,0.000443,0.00325c0.000885,0,0.001771,0,0.002656,0c0.001033,0,0.002066,0,0.002952,0c0.003985,0,0.008117,-0.000283,0.012249,-0.000424c0.003394,0,0.006789,-0.000283,0.010183,-0.000424c0.00428,-0.000283,0.00856,-0.000424,0.012987,-0.000707c-0.000885,-0.000424,-0.001919,-0.001272,-0.003099,-0.002261c-0.004723,-0.00438,-0.010478,-0.012717,-0.00974,-0.015685c0.00059,-0.002402,0.000885,-0.002261,0.001033,0.000565c0.000148,0.004522,0.008117,0.0065,0.007527,-0.002402c-0.000738,-0.012011,-0.009593,-0.001413,-0.011806,-0.012859c-0.001476,-0.007913,-0.003837,-0.004239,-0.003985,-0.007772c0,-0.000565,0.001476,-0.00113,0.003837,-0.001554c0.000295,0,0.000443,0,0.000738,-0.000141c0.002214,-0.000424,0.00487,-0.000707,0.007674,-0.000848c0.002952,-0.000141,0.005903,-0.000141,0.008412,0c0.003837,0.000283,0.006346,0.00113,0.005313,0.002543c-0.002656,0.003956,-0.002361,0.007206,0.00059,0.005652c0.001328,-0.000848,0.002361,0,0.002361,0.001696c0,0.00113,-0.000295,0.00212,-0.000885,0.00325c-0.001181,0.002685,-0.003394,0.00537,-0.003837,0.009043c-0.000295,0.002261,0,0.004946,0.002066,0.008196c0.00059,0.000989,0.001476,0.00212,0.002361,0.00325c0.003837,0.004663,0.005903,0.00537,0.006641,0.004663c0.001033,-0.000848,0,-0.004098,-0.001328,-0.004098c-0.000295,0,-0.00059,0,-0.000885,-0.000283c-0.001919,-0.00113,-0.000443,-0.006641,0.003985,-0.001696c0.000885,0.00113,0.002066,0.002685,0.003247,0.004804c0.000443,0.000707,0.000738,0.001413,0.001181,0.001978c0.000738,0.00113,0.001181,0.001978,0.001476,0.002543c0.002066,-0.000141,0.004132,-0.000283,0.006198,-0.000565c0.000885,-0.000848,0.002214,-0.001696,0.003837,-0.002261c0.003099,-0.00113,0.006789,-0.001413,0.008707,0.000565c0.000148,0.000141,0.000295,0.000283,0.000443,0.000565c0.002066,-0.000141,0.004132,-0.000424,0.006198,-0.000565c0.008264,-0.000848,0.016677,-0.001837,0.025236,-0.002967c0.002214,-0.000283,0.004427,-0.000565,0.006789,-0.000848c0.001623,-0.003956,0.002804,-0.009609,0.013282,-0.009891c0.003247,0,0.003689,-0.000565,0.001771,-0.002261c0,0,-0.000148,-0.000141,-0.000295,-0.000283c-0.002214,-0.002261,0.003099,-0.002261,0.005018,-0.001554c0.000738,0.000283,0.000885,0.000565,0.000295,0.000989c-0.002804,0.001696,-0.002361,0.008478,-0.000295,0.0065c0.002214,-0.001978,0.004575,-0.001696,0.006346,0c0.000738,0.000707,0.001328,0.001554,0.001771,0.002543c0.001181,-0.000141,0.002214,-0.000283,0.003247,-0.000565c0.001476,-0.000283,0.002952,-0.000424,0.004427,-0.000707c0.001476,-0.000283,0.002952,-0.000565,0.004575,-0.000707c0.000295,0,0.000738,0,0.001033,-0.000141c0.019038,-0.00325,0.036157,-0.005793,0.049734,-0.007913c0.003837,-0.000565,0.007379,-0.00113,0.010773,-0.001696c0.002952,-0.000424,0.005608,-0.000848,0.007969,-0.001272c0.006789,-0.00113,0.011216,-0.00212,0.012987,-0.003109h0c0.000738,-0.000424,0.001181,-0.002967,0.001033,-0.007913c0,-0.002261,0,-0.004946,-0.000148,-0.008337c0.000148,-0.00113,0.000148,-0.003674,0.000148,-0.007489c-0.004575,-0.000424,-0.010478,-0.000848,-0.018005,-0.00113c-0.001033,0,-0.002066,0,-0.003099,0c-0.002804,0,-0.00546,-0.000283,-0.007822,-0.000283c-0.036305,-0.001413,-0.015053,-0.00212,0.002214,-0.003674c0.003247,-0.000283,0.006494,-0.000707,0.009002,-0.000989c0.002066,-0.000283,0.003837,-0.000707,0.005018,-0.000989c0.008855,-0.003109,0.005756,-0.000424,0.012544,0.001554c0,-0.004946,-0.000148,-0.011022,-0.000295,-0.017522c0,-0.001696,0,-0.003533,0,-0.00537c0,-0.004663,0,-0.009326,0,-0.01413v-0.001413c0,-0.005652,0.000148,-0.011163,0.000443,-0.01625c0,-0.000565,0,-0.000989,0,-0.001554c0,-0.000848,0,-0.001696,0,-0.002402c0.000148,-0.003533,0.003247,-0.031511,0.001476,-0.0325c-0.001771,-0.00113,-0.001623,-0.003391,0.000295,-0.00438c0,0,0.003837,-0.003815,0.009593,-0.255617c0.000148,-0.00763,0.000295,-0.015402,0.00059,-0.023598c0.001033,-0.049173,0.002214,-0.106966,0.003394,-0.174933c0.001033,-0.053836,0.007084,-0.151053,-0.015496,-0.270171ZM0.795602,0.946588c-0.000148,0,-0.000443,0,-0.00059,0c-0.004575,0,-0.008855,0,-0.012987,-0.000141c-0.00856,0,-0.015939,-0.000283,-0.020956,-0.000424c-0.001919,0,-0.003542,0,-0.004723,0c-0.001033,0,-0.001771,0,-0.002214,0c-0.001328,0,-0.002509,0,-0.003689,0c-0.005608,-0.000141,-0.00915,-0.000424,-0.010921,-0.000848c-0.001476,-0.000283,-0.001919,-0.000565,-0.001328,-0.000848h0c0.000885,-0.000424,0.003542,-0.000989,0.007674,-0.001554c0.001476,-0.000141,0.002952,-0.000283,0.004723,-0.000565c0.002509,-0.000283,0.005313,-0.000565,0.008412,-0.000848c0.002656,-0.000283,0.005313,-0.000424,0.008264,-0.000565c0.002214,-0.000141,0.004427,-0.000283,0.006789,-0.000424c0.003099,-0.000141,0.006346,-0.000424,0.00974,-0.000565c0.006346,-0.000283,0.012987,-0.000565,0.019481,-0.000848c0.003394,0,0.006789,-0.000283,0.010035,-0.000283c0.01343,-0.000283,0.026269,-0.000283,0.036452,0.000141c0.01461,0.000707,0.023465,0.002402,0.019628,0.005652c-0.000885,0.000707,-0.004427,0.001272,-0.010035,0.001554h0c-0.014168,0.000989,-0.041027,0.000989,-0.063902,0.000707ZM0.873229,0.968631c-0.002066,0,-0.00428,0.00113,-0.00487,0.002543c-0.001623,0.003956,-0.003542,-0.002967,-0.008264,-0.00212c-0.002656,0.000424,-0.00487,0.000707,-0.006789,0.000707c-0.012397,0.000283,-0.009298,-0.007348,-0.007969,-0.007348c0.002214,0,-0.00059,0.003533,0.005756,0.003815c0.002361,0,0.003394,-0.000283,0.002214,-0.000989c-0.001623,-0.000848,-0.001181,-0.00212,0.001476,-0.00438c0.005165,-0.004239,0.003985,-0.002826,-0.012839,-0.004098c-0.036305,-0.002826,0.030844,-0.005511,0.024203,-0.001554c-0.000885,0.000565,-0.001623,0.001272,-0.002214,0.00212c-0.001771,0.002261,-0.002214,0.005087,0,0.004522c0.005165,-0.001554,0.021989,0.006783,0.009298,0.007065ZM0.927686,0.944468c-0.001919,0,-0.004427,0.001272,-0.00546,0.002826c-0.002656,0.003956,-0.003247,-0.000707,-0.006494,-0.001413c-0.000885,-0.000141,-0.002214,0,-0.003689,0.000707c0,0,0,0,-0.000148,0c-0.005165,0.002685,-0.008117,0.001696,-0.01343,0c-0.002066,-0.000565,-0.004427,-0.001272,-0.007379,-0.001837c-0.001476,-0.000283,-0.003247,-0.000565,-0.005018,-0.000707c-0.016677,-0.001696,-0.013577,-0.002967,-0.00487,-0.003815c0.000738,0,0.001623,-0.000141,0.002361,-0.000283c0.002214,-0.000141,0.004427,-0.000424,0.006936,-0.000565c0.007527,-0.000565,0.015496,-0.000989,0.019185,-0.001554c0.001181,-0.000141,0.001919,-0.000283,0.001919,-0.000565c0.002214,-0.00537,0.033058,0.0065,0.016234,0.006783Z"/>
			</clipPath>
		</defs>
	</svg>
	<?php
}
add_action( 'wp_footer', 'beegleton_output_mobile_dropdown_clip_path' );

/**
 * Allow SVG uploads in the Media Library (admins only).
 */
function beegleton_allow_svg_upload( $mimes ) {
	if ( current_user_can( 'manage_options' ) ) {
		$mimes['svg'] = 'image/svg+xml';
	}
	return $mimes;
}
add_filter( 'upload_mimes', 'beegleton_allow_svg_upload' );

/**
 * Fix SVG thumbnails in the Media Library grid (WP can't generate
 * a raster thumbnail for SVGs, so without this they show as broken icons).
 */
function beegleton_fix_svg_media_thumb( $response, $attachment, $meta ) {
	if ( $response['mime'] !== 'image/svg+xml' ) {
		return $response;
	}

	$svg_path = get_attached_file( $attachment->ID );
	if ( ! file_exists( $svg_path ) ) {
		return $response;
	}

	$dimensions = beegleton_get_svg_dimensions( $svg_path );

	$response['sizes'] = [
		'full' => [
			'url'         => $response['url'],
			'width'       => $dimensions['width'],
			'height'      => $dimensions['height'],
			'orientation' => $dimensions['width'] > $dimensions['height'] ? 'landscape' : 'portrait',
		],
	];

	return $response;
}
add_filter( 'wp_prepare_attachment_for_js', 'beegleton_fix_svg_media_thumb', 10, 3 );

/**
 * Read width/height (or viewBox) from an SVG file.
 */
function beegleton_get_svg_dimensions( $svg_path ) {
	$svg = @simplexml_load_file( $svg_path );

	if ( $svg === false ) {
		return [ 'width' => 100, 'height' => 100 ];
	}

	$attributes = $svg->attributes();

	if ( isset( $attributes->viewBox ) ) {
		$viewbox = explode( ' ', (string) $attributes->viewBox );
		if ( count( $viewbox ) === 4 ) {
			return [ 'width' => (float) $viewbox[2], 'height' => (float) $viewbox[3] ];
		}
	}

	return [
		'width'  => isset( $attributes->width ) ? (float) $attributes->width : 100,
		'height' => isset( $attributes->height ) ? (float) $attributes->height : 100,
	];
}

/**
 * Provide real dimensions for SVGs so core's image_downsize()
 * doesn't hit undefined array key warnings.
 */
add_filter( 'image_downsize', 'beegleton_svg_image_downsize', 10, 3 );
function beegleton_svg_image_downsize( $downsize, $id, $size ) {
	if ( get_post_mime_type( $id ) !== 'image/svg+xml' ) {
		return $downsize;
	}

	$path = get_attached_file( $id );
	if ( ! $path || ! file_exists( $path ) ) {
		return $downsize;
	}

	$dimensions = beegleton_get_svg_dimensions( $path );
	$url = wp_get_attachment_url( $id );

	return [ $url, $dimensions['width'], $dimensions['height'], false ];
}


/**
 * Give SVG attachments width/height metadata, since core assumes
 * every image has this (used internally for srcset calculation).
 */
add_filter( 'wp_get_attachment_metadata', 'beegleton_svg_attachment_metadata', 10, 2 );
function beegleton_svg_attachment_metadata( $data, $attachment_id ) {
	if ( get_post_mime_type( $attachment_id ) !== 'image/svg+xml' ) {
		return $data;
	}

	if ( ! is_array( $data ) ) {
		$data = [];
	}

	if ( ! isset( $data['width'], $data['height'] ) ) {
		$path = get_attached_file( $attachment_id );
		if ( $path && file_exists( $path ) ) {
			$dimensions     = beegleton_get_svg_dimensions( $path );
			$data['width']  = $dimensions['width'];
			$data['height'] = $dimensions['height'];
		}
	}

	return $data;
}


add_filter( 'wp_get_attachment_image', 'beegleton_inline_svg_attachment_image', 10, 5 );
function beegleton_inline_svg_attachment_image( $html, $attachment_id, $size, $icon, $attr ) {
	if ( get_post_mime_type( $attachment_id ) !== 'image/svg+xml' ) {
		return $html;
	}

	$path = get_attached_file( $attachment_id );
	if ( ! $path || ! file_exists( $path ) ) {
		return $html;
	}

	$svg = file_get_contents( $path );

	// Force every fill to currentColor so CSS can recolor it.
	$svg = preg_replace( '/fill="[^"]*"/i', 'fill="currentColor"', $svg );

	// Carry over the class the widget wanted, plus your own hook class.
	$classes = isset( $attr['class'] ) ? $attr['class'] : '';
	$svg = preg_replace( '/<svg /', '<svg class="mega-menu-inline-icon ' . esc_attr( $classes ) . '" ', $svg, 1 );

	// Strip hardcoded width/height so your CSS controls sizing instead.
	$svg = preg_replace( '/\s(width|height)="[^"]*"/i', '', $svg );

	return $svg;
}