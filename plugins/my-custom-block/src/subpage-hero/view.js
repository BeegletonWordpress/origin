import { drawUnderlines } from './draw-underline';

document.addEventListener( 'DOMContentLoaded', () => {
	const subpageHeroBlocks = document.querySelectorAll(
		'.wp-block-create-block-subpage-hero'
	);

	if ( ! subpageHeroBlocks.length ) {
		return;
	}

	drawUnderlines( subpageHeroBlocks );

	if ( ! window.lenis ) {
		console.log( 'Lenis not initialized, skipping subpage-hero parallax' );
		return;
	}

	// The overlay sits on top of the image, so it has to move with it.
	const PARALLAX_SELECTOR =
		'.subpage-hero-image, .subpage-hero-image-overlay';

	// Parallax only on desktop (matches Tailwind's md breakpoint used by the layout).
	const desktopQuery = window.matchMedia( '(min-width: 768px)' );

	const resetImages = () => {
		document.querySelectorAll( PARALLAX_SELECTOR ).forEach( ( el ) => {
			el.style.transform = '';
		} );
	};

	desktopQuery.addEventListener( 'change', ( event ) => {
		if ( ! event.matches ) {
			resetImages();
		}
	} );

	window.lenis.on( 'scroll', () => {
		if ( ! desktopQuery.matches ) {
			return;
		}

		const scroll = window.lenis.animatedScroll;
		document.querySelectorAll( PARALLAX_SELECTOR ).forEach( ( el ) => {
			el.style.transform = `translateY(${ scroll * 0.5 }px)`;
		} );
	} );
} );
