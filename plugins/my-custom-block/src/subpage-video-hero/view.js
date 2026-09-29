import { drawUnderlines } from '../subpage-hero/draw-underline';

document.addEventListener( 'DOMContentLoaded', () => {
	const blocks = document.querySelectorAll(
		'.wp-block-create-block-subpage-video-hero'
	);

	if ( ! blocks.length ) {
		return;
	}

	drawUnderlines( blocks );

	pullFullHeightHeroUnderHeader( blocks );

	flipOverlayGradientsOnMobile( blocks );

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

/**
 * With "Full screen height" on, a hero that sits directly under the site
 * header is pulled up so it starts at the very top of the page, behind the
 * (sticky) header. The body class makes the header transparent until the
 * page is scrolled (see style.css), and --hero-header-offset pads the hero
 * so its content is centered below the header rather than under it.
 *
 * @param {NodeList} blocks Subpage Video Hero elements.
 */
function pullFullHeightHeroUnderHeader( blocks ) {
	const hero = [ ...blocks ].find( ( block ) =>
		block.classList.contains( 'is-full-height' )
	);
	const header = document.querySelector( 'header.wp-block-template-part' );

	if ( ! hero || ! header ) {
		return;
	}

	// How far below the header the hero may start and still count as
	// "directly under it" (template spacing, an empty paragraph, etc.).
	const MAX_GAP = 200;

	const place = () => {
		hero.style.removeProperty( 'margin-top' );

		// Measure from the top of the <html> box, which already starts
		// below the admin bar (WordPress gives <html> a margin-top for it).
		const pageTop = document.documentElement.getBoundingClientRect().top;
		const heroTop = hero.getBoundingClientRect().top - pageTop;
		const headerRect = header.getBoundingClientRect();
		const headerBottom = headerRect.bottom - pageTop;

		if ( heroTop - headerBottom > MAX_GAP ) {
			document.body.classList.remove( 'has-hero-under-header' );
			return;
		}

		hero.style.setProperty( 'margin-top', `${ -heroTop }px`, 'important' );
		hero.style.setProperty(
			'--hero-header-offset',
			`${ headerRect.height }px`
		);
		document.body.classList.add( 'has-hero-under-header' );
	};

	// Measure at the top of the page, where the header has its natural
	// (unscrolled) height.
	if ( window.scrollY === 0 ) {
		place();
	} else {
		const onScrollTop = () => {
			if ( window.scrollY === 0 ) {
				window.removeEventListener( 'scroll', onScrollTop );
				place();
			}
		};
		// Still apply right away; the offset is corrected once at the top.
		place();
		window.addEventListener( 'scroll', onScrollTop, { passive: true } );
	}

	let frame = null;
	window.addEventListener( 'resize', () => {
		if ( frame || window.scrollY !== 0 ) {
			return;
		}
		frame = requestAnimationFrame( () => {
			frame = null;
			place();
		} );
	} );
}

/**
 * On mobile, point the overlay gradient from bottom to top, so its first
 * colour stop (the dark end of the default gradient) sits at the bottom
 * of the hero. The editor's chosen colours and stops are kept; only the
 * angle changes. Solid-colour overlays and radial gradients are left as is.
 *
 * @param {NodeList} blocks Subpage Video Hero elements.
 */
function flipOverlayGradientsOnMobile( blocks ) {
	const mobileQuery = window.matchMedia( '(max-width: 767px)' );
	// First argument of a linear gradient, when it is an angle or direction.
	const LEADING_DIRECTION =
		/^(\s*(?:repeating-)?linear-gradient\(\s*)(?:-?[\d.]+(?:deg|grad|rad|turn)|to\s+[a-z\s]+?)\s*,/i;
	const LINEAR = /^(\s*(?:repeating-)?linear-gradient\(\s*)/i;

	const overlays = [];
	blocks.forEach( ( block ) => {
		block
			.querySelectorAll( '.subpage-video-hero__overlay' )
			.forEach( ( overlay ) => {
				const original = overlay.style.backgroundImage;
				if ( ! LINEAR.test( original ) ) {
					return;
				}

				const mobile = LEADING_DIRECTION.test( original )
					? original.replace( LEADING_DIRECTION, '$1to top,' )
					: original.replace( LINEAR, '$1to top, ' );

				overlays.push( { overlay, original, mobile } );
			} );
	} );

	if ( ! overlays.length ) {
		return;
	}

	const apply = () => {
		overlays.forEach( ( { overlay, original, mobile } ) => {
			overlay.style.backgroundImage = mobileQuery.matches
				? mobile
				: original;
		} );
	};

	apply();
	mobileQuery.addEventListener( 'change', apply );
}
