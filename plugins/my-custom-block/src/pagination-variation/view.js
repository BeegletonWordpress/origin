/**
 * Beegleton pagination: pick light or dark colours from the actual
 * background behind it (e.g. a dark Group on a light page), not just the
 * page theme. Adds .is-on-dark / .is-on-light, which override the colour
 * tokens in src/index.css. Enqueued by my-custom-block.php only on pages
 * with a Beegleton-styled Pagination block.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const paginations = document.querySelectorAll(
		'.wp-block-query-pagination.is-style-beegleton'
	);

	if ( ! paginations.length ) {
		return;
	}

	// "rgb(r, g, b)" / "rgba(r, g, b, a)" → [r, g, b, a].
	const parseColor = ( value ) => {
		const parts = value.match( /[\d.]+/g );
		if ( ! parts || parts.length < 3 ) {
			return null;
		}
		const [ r, g, b, a = 1 ] = parts.map( Number );
		return { r, g, b, a };
	};

	// The first ancestor (or the page) with a visible background colour.
	const backgroundBehind = ( el ) => {
		for ( let node = el; node; node = node.parentElement ) {
			const color = parseColor(
				window.getComputedStyle( node ).backgroundColor
			);
			if ( color && color.a > 0.1 ) {
				return color;
			}
		}
		return { r: 255, g: 255, b: 255, a: 1 };
	};

	// WCAG relative luminance, 0 (black) – 1 (white).
	const luminance = ( { r, g, b } ) => {
		const channel = ( value ) => {
			const c = value / 255;
			return c <= 0.03928 ? c / 12.92 : ( ( c + 0.055 ) / 1.055 ) ** 2.4;
		};
		return 0.2126 * channel( r ) + 0.7152 * channel( g ) + 0.0722 * channel( b );
	};

	paginations.forEach( ( pagination ) => {
		const dark = luminance( backgroundBehind( pagination ) ) < 0.4;
		pagination.classList.toggle( 'is-on-dark', dark );
		pagination.classList.toggle( 'is-on-light', ! dark );
	} );
} );
