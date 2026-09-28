/**
 * Shrink headings whose longest word doesn't fit the screen.
 *
 * Words are never broken or hyphenated on this site (see the universal
 * keep-all rule in src/index.css), so a long Swedish compound word in a
 * heading can end up wider than a phone screen and get clipped. This only
 * touches headings that actually overflow, lowering their font size just
 * enough to fit; every other heading keeps its normal (fluid) size.
 */
( () => {
	const SELECTOR = 'h1, h2, h3, h4, h5, h6';
	const MIN_FONT_SIZE = 14;
	const MAX_PASSES = 10;

	// Largest gap kept between a heading and the right edge of the screen.
	const MAX_RIGHT_GUTTER = 24;

	/**
	 * `needed` is the width the heading's content takes up; `available` is
	 * the width it may use. Both the heading's own box and the screen edge
	 * are checked: a heading in a flex item (min-width: auto) widens to fit
	 * its longest word instead of overflowing, so only the screen edge
	 * catches that case.
	 */
	function measure( el ) {
		const rect = el.getBoundingClientRect();
		const left = Math.max( rect.left, 0 );
		const rightEdge =
			document.documentElement.clientWidth -
			Math.min( left, MAX_RIGHT_GUTTER );

		return {
			needed: el.scrollWidth,
			available: Math.min( el.clientWidth, rightEdge - left ),
		};
	}

	function fit( el ) {
		el.style.removeProperty( 'font-size' );

		for ( let pass = 0; pass < MAX_PASSES; pass++ ) {
			const { needed, available } = measure( el );
			if ( available <= 0 || needed <= available + 1 ) {
				return;
			}

			const current = parseFloat( window.getComputedStyle( el ).fontSize );
			if ( current <= MIN_FONT_SIZE ) {
				return;
			}

			const next = Math.max(
				MIN_FONT_SIZE,
				Math.floor( current * ( available / needed ) )
			);

			// Inline !important so it beats the !important clamps in
			// src/site-styles/style.css.
			el.style.setProperty(
				'font-size',
				`${ Math.min( next, current - 1 ) }px`,
				'important'
			);
		}
	}

	function fitAll() {
		document.querySelectorAll( SELECTOR ).forEach( fit );
	}

	let frame = null;
	function onResize() {
		if ( frame ) {
			return;
		}
		frame = requestAnimationFrame( () => {
			frame = null;
			fitAll();
		} );
	}

	function init() {
		fitAll();

		// Web fonts change word widths, so measure again once they're in.
		if ( document.fonts && document.fonts.ready ) {
			document.fonts.ready.then( fitAll );
		}

		window.addEventListener( 'resize', onResize );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
