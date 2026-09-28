/**
 * Draw-in animation for My Handdrawn Card (opt-in per card, via the
 * is-draw-animated class). The border path uses
 * vector-effect: non-scaling-stroke inside a stretched SVG, so dash lengths
 * are in screen pixels; the path's on-screen length is measured by
 * sampling it rather than taken from getTotalLength().
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const cards = document.querySelectorAll(
		'.wp-block-create-block-my-handdrawn-card.is-draw-animated'
	);

	if ( ! cards.length ) {
		return;
	}

	const SAMPLES = 200;
	const DURATION = 1500;
	const STAGGER = 150;

	const reducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	const show = ( card ) => card.classList.add( 'is-draw-ready' );

	if ( reducedMotion || ! ( 'IntersectionObserver' in window ) ) {
		cards.forEach( show );
		return;
	}

	function getScreenLength( path ) {
		const ctm = path.getScreenCTM();
		const total = path.getTotalLength();
		let length = 0;
		let prev = null;

		for ( let i = 0; i <= SAMPLES; i++ ) {
			const point = path
				.getPointAtLength( ( total * i ) / SAMPLES )
				.matrixTransform( ctm );
			if ( prev ) {
				length += Math.hypot( point.x - prev.x, point.y - prev.y );
			}
			prev = point;
		}

		return Math.ceil( length ) + 4;
	}

	function clear( path ) {
		path.style.transition = '';
		path.style.transitionDelay = '';
		path.style.strokeDasharray = '';
		path.style.strokeDashoffset = '';
	}

	const observer = new IntersectionObserver(
		( entries ) => {
			entries
				.filter( ( entry ) => entry.isIntersecting )
				.forEach( ( entry, index ) => {
					const card = entry.target;
					const path = card.querySelector( ':scope > svg path' );
					observer.unobserve( card );

					if ( ! path ) {
						return;
					}

					// Clear the dashes once drawn, so a later resize can't
					// leave a gap in the line.
					path.addEventListener( 'transitionend', () => clear( path ), {
						once: true,
					} );

					path.style.transition = `stroke-dashoffset ${ DURATION }ms ease-in-out`;
					path.style.transitionDelay = `${ index * STAGGER }ms`;
					path.style.strokeDashoffset = '0';
				} );
		},
		{ threshold: 0.3 }
	);

	cards.forEach( ( card ) => {
		const path = card.querySelector( ':scope > svg path' );

		try {
			if ( path ) {
				const length = getScreenLength( path );
				path.style.strokeDasharray = `${ length }`;
				path.style.strokeDashoffset = `${ length }`;
			}
		} catch ( e ) {
			// If measuring fails, just show the line as it is.
			if ( path ) {
				clear( path );
			}
			show( card );
			return;
		}

		show( card );
		observer.observe( card );
	} );
} );
