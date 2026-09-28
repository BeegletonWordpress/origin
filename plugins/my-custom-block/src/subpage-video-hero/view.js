import { drawUnderlines } from '../subpage-hero/draw-underline';

document.addEventListener( 'DOMContentLoaded', () => {
	const blocks = document.querySelectorAll(
		'.wp-block-create-block-subpage-video-hero'
	);

	if ( ! blocks.length ) {
		return;
	}

	drawUnderlines( blocks );

	// Respect "reduce motion": keep background videos still.
	if ( window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
		blocks.forEach( ( block ) => {
			block
				.querySelectorAll( '.subpage-video-hero__media video' )
				.forEach( ( video ) => {
					video.removeAttribute( 'autoplay' );
					video.pause();
				} );
		} );
	}
} );
