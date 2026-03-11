<?php
/**
 * Render function for the Case Grid block.
 */

$args = array(
	'post_type'      => 'post',
	'posts_per_page' => $attributes['postsPerPage'] ?? 3,
	'cat'            => $attributes['selectedCategory'] ?? '',
);

$query = new WP_Query($args);

if ($query->have_posts()) : ?>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
		<?php while ($query->have_posts()) : $query->the_post(); ?>
			<article class="flex flex-col h-full bg-white group">
				<?php if (has_post_thumbnail()) : ?>
					<div class="mb-6 aspect-video w-full overflow-hidden">
						<?php the_post_thumbnail('medium_large', [
							'class' => 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
						]); ?>
					</div>
				<?php endif; ?>

				<h3 class="text-xl font-bold mb-3 uppercase tracking-tight">
					<?php the_title(); ?>
				</h3>
				
				<div class="text-gray-700 mb-6 flex-grow leading-relaxed">
					<?php echo wp_trim_words(get_the_excerpt(), 20, '...'); ?>
				</div>

				<a href="<?php the_permalink(); ?>" class="mt-auto font-bold uppercase text-sm tracking-widest border-b-2 border-black pb-1 self-start hover:border-accent-2 transition-colors">
					LÄS CASE
				</a>
			</article>
		<?php endwhile; wp_reset_postdata(); ?>
	</div>
<?php else : ?>
	<p>No cases found.</p>
<?php endif; ?>
