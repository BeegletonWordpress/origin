<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

/**
 * Editor restrictions and starter patterns for the "Customer Case" and
 * "Post" post types, so editors get a curated block inserter.
 */

/**
 * Shared helper: only apply a restricted allow-list for the given post type.
 */
function mcb_restrict_blocks_for_post_type( $allowed_blocks, $context, $post_type, $allow_list ) {
	if ( ! $context->post || $post_type !== $context->post->post_type ) {
		return $allowed_blocks;
	}
	return $allow_list;
}

/**
 * Allowed blocks for Customer Cases. Defaults are data-driven from real
 * usage across all published cases (DB query, Sep 2026) so existing
 * content stays editable — see MCB_DEFAULT_ALLOWED_BLOCKS in
 * includes/block-pattern-settings.php, editable via Settings → Block &
 * Pattern Access without a code change.
 */
function customer_case_allowed_blocks( $allowed_blocks, $context ) {
	return mcb_restrict_blocks_for_post_type(
		$allowed_blocks,
		$context,
		'customer_case',
		mcb_get_allowed_blocks_for_post_type( 'customer_case' )
	);
}
// Temporarily disabled — the allow-list was hiding whole patterns (any
// pattern containing a not-yet-allowed block gets hidden entirely) rather
// than just the blocks in question. Re-enable by uncommenting once the
// allow-list has been updated, or leave off if no restriction is wanted.
// add_filter( 'allowed_block_types_all', 'customer_case_allowed_blocks', 10, 2 );

/**
 * Allowed blocks for standard blog Posts — see
 * includes/block-pattern-settings.php for the default list and the
 * Settings → Block & Pattern Access admin page.
 */
function mcb_post_allowed_blocks( $allowed_blocks, $context ) {
	return mcb_restrict_blocks_for_post_type(
		$allowed_blocks,
		$context,
		'post',
		mcb_get_allowed_blocks_for_post_type( 'post' )
	);
}
add_filter( 'allowed_block_types_all', 'mcb_post_allowed_blocks', 10, 2 );

/**
 * The Customer Case Hero block is locked in place (can't be moved/removed)
 * via its own `lock` attribute, but that lock is only enforced by the
 * visual block-list UI — Gutenberg's "Code editor" mode edits raw block
 * markup as text with no per-block lock checks at all, so it's a complete
 * bypass. Disable Code editor mode for Customer Cases specifically to
 * close that gap; every other post type is unaffected.
 */
function mcb_disable_code_editor_for_customer_case( $settings, $context ) {
	if ( ! $context->post || 'customer_case' !== $context->post->post_type ) {
		return $settings;
	}
	$settings['codeEditingEnabled'] = false;
	return $settings;
}
add_filter( 'block_editor_settings_all', 'mcb_disable_code_editor_for_customer_case', 10, 2 );

/**
 * Register a pattern category + starter patterns, shared by Cases and Posts.
 */
function customer_case_register_patterns() {
	register_block_pattern_category(
		'customer-case',
		[ 'label' => __( 'Case Sections', 'customer-case' ) ]
	);

	register_block_pattern(
		'customer-case/text-section',
		[
			'title'      => __( 'Text Section', 'customer-case' ),
			'categories' => [ 'customer-case' ],
			'postTypes'  => [ 'customer_case', 'post' ],
			'content'    =>
				'<!-- wp:heading {"lock":{"move":false,"remove":false}} -->
				<h2>Section heading</h2>
				<!-- /wp:heading -->

				<!-- wp:paragraph -->
				<p>Write your text here.</p>
				<!-- /wp:paragraph -->',
		]
	);

	register_block_pattern(
		'customer-case/image-text',
		[
			'title'      => __( 'Image + Text', 'customer-case' ),
			'categories' => [ 'customer-case' ],
			'postTypes'  => [ 'customer_case', 'post' ],
			'content'    =>
				'<!-- wp:media-text -->
				<div class="wp-block-media-text">
					<figure class="wp-block-media-text__media">
						<img src="" alt="" class="wp-image"/>
					</figure>
					<div class="wp-block-media-text__content">
						<!-- wp:paragraph -->
						<p>Write your text here.</p>
						<!-- /wp:paragraph -->
					</div>
				</div>
				<!-- /wp:media-text -->',
		]
	);
}
add_action( 'init', 'customer_case_register_patterns' );

/**
 * Hide WordPress's default/remote pattern library sitewide, so only our
 * curated patterns show. Deliberately global (not scoped to just Cases/
 * Posts) — confirmed with the user; Pages etc. only lose default/remote
 * patterns, our own patterns still show per their postTypes.
 */
add_action( 'after_setup_theme', function () {
	remove_theme_support( 'core-block-patterns' );
} );
add_filter( 'should_load_remote_block_patterns', '__return_false' );

/**
 * remove_theme_support( 'core-block-patterns' ) above only hides WordPress's
 * own bundled default patterns — it has no effect on patterns the active
 * theme registers itself (its own patterns/*.php files), which don't
 * declare postTypes and so are otherwise available everywhere, including
 * Cases and Posts. The block-patterns REST endpoint has no per-post-type
 * context to filter by, so the only lever available is the patterns'
 * own `postTypes` property: explicitly scope every such "universal"
 * pattern to every *other* post type, leaving Cases/Posts with only the
 * patterns we've registered ourselves. Runs after theme patterns have
 * registered (priority 20 vs. their default 10) and re-derives the
 * post type list each time, so it keeps working as the theme is updated
 * or post types change — nothing to maintain by hand. Patterns opted
 * back in via Settings → Block & Pattern Access (mcb_allowed_patterns,
 * see includes/block-pattern-settings.php) are left fully unrestricted.
 */
function mcb_scope_universal_patterns_away_from_cases_and_posts() {
	$restricted_post_types = [ 'customer_case', 'post' ];
	$allowed_elsewhere     = array_values(
		array_diff( get_post_types( [ 'show_in_rest' => true ], 'names' ), $restricted_post_types )
	);
	$additionally_allowed  = mcb_get_allowed_pattern_names();

	foreach ( WP_Block_Patterns_Registry::get_instance()->get_all_registered() as $pattern ) {
		// Leave patterns that already declare their own postTypes alone
		// (that includes our own two patterns above).
		if ( isset( $pattern['postTypes'] ) ) {
			continue;
		}

		// Opted in via the settings page — leave fully unrestricted.
		if ( in_array( $pattern['name'], $additionally_allowed, true ) ) {
			continue;
		}

		unregister_block_pattern( $pattern['name'] );
		$pattern['postTypes'] = $allowed_elsewhere;
		register_block_pattern( $pattern['name'], $pattern );
	}
}
add_action( 'init', 'mcb_scope_universal_patterns_away_from_cases_and_posts', 20 );
