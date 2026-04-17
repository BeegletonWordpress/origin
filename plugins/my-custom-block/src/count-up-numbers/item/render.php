<?php
$number      = intval( $attributes['number'] ?? 0 );
$suffix      = esc_html( $attributes['suffix'] ?? '' );
$description = esc_html( $attributes['description'] ?? '' );
$wrapper     = get_block_wrapper_attributes([
    'class'        => 'count-up-number-item flex flex-col text-center p-4 max-w-64 items-center',
    'data-number'  => $number,
    'data-suffix'  => $suffix,
]);
?>
<div <?php echo $wrapper; ?>>
    <div class="count-up-number text-7xl flex">
        <span class="count-up-value"><?php echo $number; ?></span>
        <?php if ( $suffix ) : ?>
            <span class="count-up-suffix"><?php echo $suffix; ?></span>
        <?php endif; ?>
    </div>
    <div class="count-up-description text-lg mt-2"><?php echo $description; ?></div>
</div>