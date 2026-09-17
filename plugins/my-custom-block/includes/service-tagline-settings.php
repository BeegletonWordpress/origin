<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

/**
 * Admin-manageable list of "Service Tagline" options for the Customer Case
 * Hero block. Was a hardcoded array in src/customer-case-hero/index.js;
 * moved to a plugin option so new taglines can be added without a code
 * change, via Settings > Service Taglines.
 */

const MCB_DEFAULT_SERVICE_TAGLINES = [
	'Marknadsstrategi & Position',
	'Identitet & Varumärke',
	'Workshop & Strategiarbete',
	'Webbutveckling & Design',
	'Designsystem & UX',
	'Content & Filmproduktion',
	'Performance Marketing',
	'Mäss- & Eventmaterial',
	'SEO & GEO Anpassat Innehåll',
];

/**
 * Get the current list of service taglines, seeded with the original
 * hardcoded defaults the first time this runs (so existing content keeps
 * working with no manual setup).
 */
function mcb_get_service_taglines() {
	$taglines = get_option( 'mcb_service_taglines' );

	if ( ! is_array( $taglines ) ) {
		$taglines = MCB_DEFAULT_SERVICE_TAGLINES;
		update_option( 'mcb_service_taglines', $taglines );
	}

	return $taglines;
}

function mcb_sanitize_service_taglines( $raw ) {
	$lines = explode( "\n", (string) $raw );
	$lines = array_map( 'trim', $lines );
	$lines = array_filter( $lines, function ( $line ) {
		return '' !== $line;
	} );
	$lines = array_values( array_unique( $lines ) );

	return $lines;
}

function mcb_register_service_tagline_settings() {
	register_setting(
		'mcb_service_taglines_group',
		'mcb_service_taglines',
		[
			'type'              => 'array',
			'sanitize_callback' => 'mcb_sanitize_service_taglines',
			'default'           => MCB_DEFAULT_SERVICE_TAGLINES,
		]
	);
}
add_action( 'admin_init', 'mcb_register_service_tagline_settings' );

function mcb_add_service_tagline_settings_page() {
	add_options_page(
		'Service Taglines',
		'Service Taglines',
		'manage_options',
		'mcb-service-taglines',
		'mcb_render_service_tagline_settings_page'
	);
}
add_action( 'admin_menu', 'mcb_add_service_tagline_settings_page' );

function mcb_render_service_tagline_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$taglines = mcb_get_service_taglines();
	?>
	<div class="wrap">
		<h1>Service Taglines</h1>
		<p>
			One tagline per line. These are the options editors can pick from in the
			Customer Case Hero block's "Service Tagline" field. Add a new line to add a
			tagline; delete a line to remove it.
		</p>
		<form method="post" action="options.php">
			<?php settings_fields( 'mcb_service_taglines_group' ); ?>
			<textarea
				name="mcb_service_taglines"
				rows="14"
				cols="60"
				class="large-text code"
			><?php echo esc_textarea( implode( "\n", $taglines ) ); ?></textarea>
			<?php submit_button( 'Save Taglines' ); ?>
		</form>
	</div>
	<?php
}

/**
 * Registered `sanitize_callback` receives the raw textarea value directly
 * (a single string with newlines), but the option itself must be stored as
 * an array — WordPress's Settings API passes the raw POSTed value straight
 * through, so the split-into-lines work has to happen in the sanitizer,
 * not here.
 */

/**
 * Make the tagline list available in the block editor as
 * `window.mcbServiceTaglines`, so the Customer Case Hero block's "Service
 * Tagline" dropdown can build its options from the admin-managed list
 * instead of a hardcoded array.
 */
function mcb_localize_service_taglines_for_editor() {
	$taglines = mcb_get_service_taglines();

	wp_add_inline_script(
		'create-block-customer-case-hero-editor-script',
		'window.mcbServiceTaglines = ' . wp_json_encode( $taglines ) . ';',
		'before'
	);
}
add_action( 'enqueue_block_editor_assets', 'mcb_localize_service_taglines_for_editor' );
