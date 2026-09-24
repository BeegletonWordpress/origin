<?php
/**
 * Small Handdrawn Card — dynamic render.
 *
 * Draws the hand-drawn ring around the card's first Heading block (a direct
 * child of the card) instead of around the whole card. The markup is built
 * from the inner blocks rather than $content: posts saved before this block
 * became dynamic still carry the old wrapper + ring HTML in $content.
 *
 * The outer wrapper and inner wrapper keep the exact classes of the old
 * static save, so row/card styling keeps applying. The edit() in index.js
 * mirrors this ring in the editor — keep the two in sync.
 *
 * @var array    $attributes
 * @var string   $content
 * @var WP_Block $block
 */

$background_color = $attributes['backgroundColor'] ?? '';
$custom_bg_color  = $attributes['style']['color']['background'] ?? '';
if ( $background_color ) {
	$custom_bg_color = 'var(--wp--preset--color--' . $background_color . ')';
}
$stroke_color = $custom_bg_color ? $custom_bg_color : 'var(--wp--preset--color--primary, #000)';

$ring_width    = (float) ( $attributes['ringWidth'] ?? 100 );
$ring_height   = (float) ( $attributes['ringHeight'] ?? 100 );
$ring_offset_x = (float) ( $attributes['ringOffsetX'] ?? 0 );
$ring_offset_y = (float) ( $attributes['ringOffsetY'] ?? 0 );
$show_ring     = $attributes['svgToggle'] ?? true;

$ring_style = sprintf(
	'transform:translate(%1$srem, %2$srem) scale(%3$s, %4$s);display:%5$s',
	$ring_offset_x,
	$ring_offset_y,
	$ring_width / 100,
	$ring_height / 100,
	$show_ring ? 'block' : 'none'
);

// Same shape as HAND_DRAWN_RING_SHAPE_4 in src/constants.js.
$ring = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -35 1900 1100" fill="none" preserveAspectRatio="none" class="small-handdrawn-card__ring" aria-hidden="true" style="' . esc_attr( $ring_style ) . '"><path d="M5.5,734.24c307.43,288.64,759.05,329.99,1162.15,295.3,220.98-10.71,500.24-80.84,565.56-320.92,30.56-120.89-16.83-248.57-83.26-354.1C1487.37,80.33,1186.66-34.72,876.38,17.93c-194.44,31.53-375.56,120.36-540.22,228.48-66.98,43.99-132.74,92.25-181.6,155.77-166.29,221.37-15.34,411.99,212.05,502.42,382.29,161.75,825.48,163.63,1216.78,25.06,342.38-109.93,399.02-378.98,136.04-625.88-173.37-152.27-416.93-221.11-644.37-182.11" stroke-linecap="round" stroke-linejoin="round" stroke-width="25"></path></svg>';

$inner_html    = '';
$ring_is_drawn = false;
foreach ( $block->inner_blocks as $inner_block ) {
	$rendered = $inner_block->render();
	if ( ! $ring_is_drawn && 'core/heading' === $inner_block->name ) {
		$rendered      = '<div class="small-handdrawn-card__heading">' . $ring . $rendered . '</div>';
		$ring_is_drawn = true;
	}
	$inner_html .= $rendered;
}

$wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => 'relative z-10',
		'style' => '--handdrawn-stroke-color:' . $stroke_color,
	]
);
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>><div class="relative z-10 flex flex-col items-center gap-4 max-w-[360px] min-h-[200px]"><?php echo $inner_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div></div>
