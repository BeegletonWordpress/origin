<?php
/**
 * Render function for the Customer Case Hero block (Dynamic Block).
 * Uses post title via get_the_title() and renders tagline, tags, and SVG placeholder.
 */

// Extract attributes
$tagline = $attributes['tagline'] ?? '';
$tags = $attributes['tags'] ?? [];
$svg_color = $attributes['svgColor'] ?? '';
$theme = $attributes['theme'] ?? 'default';
$reverse_layout = $attributes['reverseLayout'] ?? false;

// Define themes
$themes = array(
	'default' => array(
		'bg' => 'var(--wp--preset--color--accent-1)',
		'text' => '#3B3632',
		'svg' => '#FDF0DB',
		'isDark' => false,
	),
	'dark_1' => array(
		'bg' => '#3B3632',
		'text' => '#FDF0DB',
		'svg' => '#BBC7E7',
		'isDark' => true,
	),
	'dark_2' => array(
		'bg' => '#3B3632',
		'text' => '#FDF0DB',
		'svg' => '#EEB137',
		'isDark' => true,
	),
	'light_1' => array(
		'bg' => '#FDF0DB',
		'text' => '#3B3632',
		'svg' => '#4A6397',
		'isDark' => false,
	),
	'light_2' => array(
		'bg' => '#FDF0DB',
		'text' => '#3B3632',
		'svg' => '#EEB137',
		'isDark' => false,
	),
);

$active_theme = isset( $themes[ $theme ] ) ? $themes[ $theme ] : $themes['default'];
$final_svg_color = $svg_color ? $svg_color : $active_theme['svg'];

// Get block wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'customer-case-hero theme-' . esc_attr( $theme ),
		'style' => 'background-color: ' . esc_attr( $active_theme['bg'] ) . '; color: ' . esc_attr( $active_theme['text'] ) . ';',
	)
);
?>

<div <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<style>
		:root {
			--page-theme-bg: <?php echo esc_attr( $active_theme['bg'] ); ?>;
			--page-theme-text: <?php echo esc_attr( $active_theme['text'] ); ?>;
			--page-theme-svg: <?php echo esc_attr( $final_svg_color ); ?>;
			--page-theme-is-dark: <?php echo $active_theme['isDark'] ? '1' : '0'; ?>;
			--page-theme-is-light: <?php echo $active_theme['isDark'] ? '0' : '1'; ?>;
		}
		body {
			background-color: var(--page-theme-bg);
			color: var(--page-theme-text);
		}
	</style>

	<div class="flex flex-col pt-16 pb-12 mb-8 md:flex-row w-full justify-between gap-10 m-auto md:items-stretch md:max-h-187.5 <?php echo $reverse_layout ? 'md:flex-row-reverse' : ''; ?>">
		<div class="w-full md:w-[40%] relative flex flex-col justify-center">
			<div class="md:relative z-9 flex flex-col justify-center <?php echo $reverse_layout ? 'md:ml-auto' : 'md:mr-auto'; ?>" style="isolation: isolate;">
				
				<?php if ( $tagline ) : ?>
					<p class="has-cas-red-ink-font-family text-5xl z-10 relative">
						<?php echo wp_kses_post( $tagline ); ?>
					</p>
				<?php endif; ?>

				<h1 class="text-pretty whitespace-nowrap z-10 relative">
					<?php echo wp_kses_post( get_the_title() ); ?>
				</h1>

				<!-- SVG Ring Placeholder: view.js will inject SmallRingShapeSVG here -->
				<div 
					class="ring-svg-placeholder"
					data-svg-color="<?php echo esc_attr( $final_svg_color ); ?>"
					style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0;"
				></div>

			</div>

			<?php if ( ! empty( $tags ) ) : ?>
				<div class="flex flex-wrap gap-2 mt-8 z-10 relative">
					<?php foreach ( $tags as $tag ) : ?>
						<span class="border border-current/50 px-3 py-1 uppercase italic text-[0.75rem]">
							<?php echo esc_html( $tag ); ?>
						</span>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

		</div>

		<div class="w-full h-[40vh] flex flex-col justify-center mt-0 max-w-128.75">
			<p class="mt-4">
				<?php
				echo wp_kses_post( get_the_excerpt() );
				?>
			</p>
		</div>
	</div>
</div>
