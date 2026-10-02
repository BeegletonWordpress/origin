/**
 * Shared draw-in animation for stroked hand-drawn lines (My Handdrawn Card's
 * border, the SVG Background Container's line shapes): each line draws
 * itself in via its stroke dash when the item scrolls into view.
 *
 * Only items that are off screen when the page loads are animated: they get
 * .is-draw-pending (the only state the blocks' CSS hides), then
 * .is-draw-ready once the dashes are set up, and .is-drawn when the line is
 * done. Items already on screen are left fully visible, so they don't delay
 * Largest Contentful Paint; with reduced motion or without
 * IntersectionObserver nothing is touched at all.
 *
 * Lines may use vector-effect: non-scaling-stroke inside a stretched SVG, so
 * dash lengths are in screen pixels: each path's on-screen length is
 * measured by sampling it rather than taken from getTotalLength().
 *
 * Only paths with a visible stroke are animated (the effect moves the
 * stroke's dash). A filled shape with no stroke that gets the animation by
 * mistake is skipped and left exactly as it renders.
 *
 * @param {Object}             options
 * @param {NodeList|Element[]} options.items    Elements to animate.
 * @param {Function}           options.getPaths item → array of <path>s to draw.
 * @param {number}             options.duration Draw time per item, ms.
 * @param {number}             options.stagger  Delay between items entering
 *                                              the view together, ms.
 * @param {Function}           options.onDrawn  Called with the item when drawn.
 */
export function setupDrawIn( {
	items,
	getPaths,
	duration = 1000,
	stagger = 100,
	onDrawn,
} ) {
	if ( ! items || ! items.length ) {
		return;
	}

	const SAMPLES = 200;

	const reducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	// Nothing is marked pending, so every item simply stays visible.
	if ( reducedMotion || ! ( 'IntersectionObserver' in window ) ) {
		return;
	}

	const ready = ( item ) => item.classList.add( 'is-draw-ready' );
	const finish = ( item ) => {
		item.classList.add( 'is-draw-ready', 'is-drawn' );
		if ( onDrawn ) {
			onDrawn( item );
		}
	};

	// The draw-in moves the stroke's dash, so only paths with a stroke
	// that's actually visible can be drawn.
	const hasVisibleStroke = ( path ) => {
		const style = window.getComputedStyle( path );
		const stroke = style.stroke;
		return (
			!! stroke &&
			stroke !== 'none' &&
			stroke !== 'transparent' &&
			stroke !== 'rgba(0, 0, 0, 0)' &&
			parseFloat( style.strokeWidth ) > 0 &&
			parseFloat( style.strokeOpacity ) > 0
		);
	};

	const drawablePaths = ( item ) =>
		( getPaths( item ) || [] ).filter( hasVisibleStroke );

	const isOnScreen = ( item ) => {
		const rect = item.getBoundingClientRect();
		return rect.top < window.innerHeight && rect.bottom > 0;
	};

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
					const item = entry.target;
					const paths = drawablePaths( item );
					observer.unobserve( item );

					if ( ! paths.length ) {
						finish( item );
						return;
					}

					// Clear the dashes once drawn, so a later resize can't
					// leave a gap in the line.
					let remaining = paths.length;
					paths.forEach( ( path ) => {
						path.addEventListener(
							'transitionend',
							() => {
								clear( path );
								remaining -= 1;
								if ( ! remaining ) {
									finish( item );
								}
							},
							{ once: true }
						);

						path.style.transition = `stroke-dashoffset ${ duration }ms ease-in-out`;
						path.style.transitionDelay = `${ index * stagger }ms`;
						path.style.strokeDashoffset = '0';
					} );
				} );
		},
		{ threshold: 0.3 }
	);

	items.forEach( ( item ) => {
		// Already visible on load: leave it as it is, fully drawn.
		if ( isOnScreen( item ) ) {
			return;
		}

		// Nothing with a visible stroke to draw: leave it as it is.
		const paths = drawablePaths( item );
		if ( ! paths.length ) {
			return;
		}

		item.classList.add( 'is-draw-pending' );

		try {
			paths.forEach( ( path ) => {
				const length = getScreenLength( path );
				path.style.strokeDasharray = `${ length }`;
				path.style.strokeDashoffset = `${ length }`;
			} );
		} catch ( e ) {
			// If measuring fails, just show the item as it is.
			paths.forEach( clear );
			finish( item );
			return;
		}

		ready( item );
		observer.observe( item );
	} );
}
