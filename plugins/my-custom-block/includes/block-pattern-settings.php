<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

/**
 * Self-service admin settings for which blocks/patterns are allowed on
 * Customer Cases and Posts, so this can be changed without a code deploy.
 * See includes/case-editor.php for where these are consumed.
 */

const MCB_DEFAULT_ALLOWED_BLOCKS = [
	'customer_case' => [
		'core/paragraph',
		'core/heading',
		'core/image',
		'core/group',
		'core/gallery',
		'core/video',
		'core/html',
		'core/media-text',
		'create-block/customer-case-hero',
		'create-block/my-count-up-numbers',
		'create-block/my-count-up-numbers-inner',
		'create-block/my-count-up-numbers-item',
		'my-custom-block/handdrawn-header',
	],
	'post'          => [
		'core/paragraph',
		'core/heading',
		'core/image',
		'core/list',
		'core/list-item',
		'core/quote',
		'core/gallery',
		'core/video',
		'core/embed',
		'core/media-text',
		'core/columns',
		'core/column',
	],
];

// Nothing extra allowed today — matches current live behavior.
const MCB_DEFAULT_ALLOWED_PATTERNS = [];

// Always available on Customer Case/Post, not toggleable via the settings page.
const MCB_OWN_PATTERN_NAMES = [ 'customer-case/text-section', 'customer-case/image-text' ];

/**
 * Cached getters. Memoized per-request since allowed_block_types_all can
 * fire more than once per page load.
 */
function mcb_get_allowed_blocks_option() {
	static $cache = null;
	if ( null === $cache ) {
		$cache = get_option( 'mcb_allowed_blocks', MCB_DEFAULT_ALLOWED_BLOCKS );
	}
	return $cache;
}

function mcb_get_allowed_blocks_for_post_type( $post_type ) {
	$option = mcb_get_allowed_blocks_option();
	return $option[ $post_type ] ?? ( MCB_DEFAULT_ALLOWED_BLOCKS[ $post_type ] ?? [] );
}

function mcb_get_allowed_pattern_names() {
	static $cache = null;
	if ( null === $cache ) {
		$cache = get_option( 'mcb_allowed_patterns', MCB_DEFAULT_ALLOWED_PATTERNS );
	}
	return $cache;
}

/**
 * Settings page under Settings → Block & Pattern Access. Not a submenu of
 * the Customer Case CPT menu — this equally governs Posts, which has no
 * relationship to that menu.
 */
add_action( 'admin_menu', function () {
	add_options_page(
		__( 'Block & Pattern Access', 'customer-case' ),
		__( 'Block & Pattern Access', 'customer-case' ),
		'manage_options',
		'mcb-block-pattern-settings',
		'mcb_render_block_pattern_settings_page'
	);
} );

/**
 * Registered on init (not admin_init) so the settings are available in
 * REST contexts too, not just wp-admin page loads.
 */
add_action( 'init', function () {
	register_setting(
		'mcb_settings_group',
		'mcb_allowed_blocks',
		[
			'type'              => 'array',
			'sanitize_callback' => 'mcb_sanitize_allowed_blocks',
			'default'           => MCB_DEFAULT_ALLOWED_BLOCKS,
			'show_in_rest'      => false,
		]
	);
	register_setting(
		'mcb_settings_group',
		'mcb_allowed_patterns',
		[
			'type'              => 'array',
			'sanitize_callback' => 'mcb_sanitize_allowed_patterns',
			'default'           => MCB_DEFAULT_ALLOWED_PATTERNS,
			'show_in_rest'      => false,
		]
	);
} );

/**
 * Reject anything that isn't a currently-registered block, so stale/junk
 * entries (e.g. from a since-deactivated block plugin, or a tampered
 * request) can't accumulate in the option.
 */
function mcb_sanitize_allowed_blocks( $input ) {
	$registered = array_keys( WP_Block_Type_Registry::get_instance()->get_all_registered() );
	$clean      = [];
	foreach ( [ 'customer_case', 'post' ] as $post_type ) {
		$submitted           = is_array( $input[ $post_type ] ?? null ) ? $input[ $post_type ] : [];
		$clean[ $post_type ] = array_values(
			array_intersect( array_map( 'sanitize_text_field', $submitted ), $registered )
		);
	}
	return $clean;
}

/**
 * Same idea for patterns: only currently-registered pattern names survive,
 * and our own always-on patterns aren't storable here (they're not
 * toggleable via this list in the first place).
 */
function mcb_sanitize_allowed_patterns( $input ) {
	// get_all_registered() is a plain numeric list, not keyed by pattern
	// name (unlike the block type registry) — pull names out explicitly.
	$registered = wp_list_pluck( WP_Block_Patterns_Registry::get_instance()->get_all_registered(), 'name' );
	$submitted  = is_array( $input ) ? array_map( 'sanitize_text_field', $input ) : [];
	return array_values(
		array_diff( array_intersect( $submitted, $registered ), MCB_OWN_PATTERN_NAMES )
	);
}

/**
 * Groups a list of block/pattern names by the namespace prefix before the
 * "/" (e.g. "core", "create-block"), for a readable checkbox layout instead
 * of one long unsorted list.
 */
function mcb_group_names_by_namespace( array $names, callable $label_for ) {
	$groups = [];
	foreach ( $names as $name ) {
		[ $namespace ] = explode( '/', $name, 2 );
		$groups[ $namespace ][ $name ] = $label_for( $name );
	}
	ksort( $groups );
	foreach ( $groups as &$group ) {
		asort( $group );
	}
	return $groups;
}

function mcb_render_checkbox_group( array $groups, $field_name, array $checked ) {
	foreach ( $groups as $namespace => $items ) {
		echo '<p><strong>' . esc_html( $namespace ) . '</strong></p>';
		foreach ( $items as $name => $label ) {
			$id = esc_attr( $field_name . '-' . $name );
			printf(
				'<label for="%1$s" style="display:block;margin-bottom:4px;"><input type="checkbox" id="%1$s" name="%2$s[]" value="%3$s" %4$s /> %5$s <code>%3$s</code></label>',
				$id,
				esc_attr( $field_name ),
				esc_attr( $name ),
				checked( in_array( $name, $checked, true ), true, false ),
				esc_html( $label )
			);
		}
	}
}

function mcb_render_block_pattern_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$saved_blocks   = mcb_get_allowed_blocks_option();
	$saved_patterns = mcb_get_allowed_pattern_names();

	$registered_blocks   = WP_Block_Type_Registry::get_instance()->get_all_registered();
	$block_names          = array_keys( $registered_blocks );
	$block_groups          = mcb_group_names_by_namespace(
		$block_names,
		fn( $name ) => $registered_blocks[ $name ]->title ?: $name
	);

	// get_all_registered() is a plain numeric list, not keyed by pattern
	// name (unlike the block type registry) — index it by name ourselves.
	$registered_patterns = array_column( WP_Block_Patterns_Registry::get_instance()->get_all_registered(), null, 'name' );
	$pattern_names        = array_values( array_diff( array_keys( $registered_patterns ), MCB_OWN_PATTERN_NAMES ) );
	$pattern_groups        = mcb_group_names_by_namespace(
		$pattern_names,
		fn( $name ) => $registered_patterns[ $name ]['title'] ?? $name
	);
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Block & Pattern Access', 'customer-case' ); ?></h1>
		<p><?php esc_html_e( 'Choose which blocks colleagues can use on Customer Cases and Posts, and which additional patterns are available beyond the built-in Case Sections.', 'customer-case' ); ?></p>
		<form method="post" action="options.php">
			<?php settings_fields( 'mcb_settings_group' ); ?>

			<h2><?php esc_html_e( 'Customer Case — allowed blocks', 'customer-case' ); ?></h2>
			<div class="form-table">
				<?php mcb_render_checkbox_group( $block_groups, 'mcb_allowed_blocks[customer_case]', $saved_blocks['customer_case'] ?? [] ); ?>
			</div>

			<h2><?php esc_html_e( 'Post — allowed blocks', 'customer-case' ); ?></h2>
			<div class="form-table">
				<?php mcb_render_checkbox_group( $block_groups, 'mcb_allowed_blocks[post]', $saved_blocks['post'] ?? [] ); ?>
			</div>

			<h2><?php esc_html_e( 'Additional patterns allowed for Customer Case & Post', 'customer-case' ); ?></h2>
			<p class="description"><?php esc_html_e( 'Case Sections (Text Section, Image + Text) are always available and not listed here.', 'customer-case' ); ?></p>
			<div class="form-table">
				<?php mcb_render_checkbox_group( $pattern_groups, 'mcb_allowed_patterns', $saved_patterns ); ?>
			</div>

			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}
