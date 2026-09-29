/**
 * Bee Flight Container: the bee flies gentle S-curves from the top of the
 * container down as the section scrolls through the screen, easing after the
 * scroll and settling when it stops. If the content has a button, the flight
 * ends sitting on top of the last one. The path is computed from the live
 * layout, so it adapts to any height, screen width or button position.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const containers = document.querySelectorAll(
		'.wp-block-create-block-my-bee-flight-container'
	);

	if (
		! containers.length ||
		window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches
	) {
		return;
	}

	// The artwork's head points right (stinger on the left).
	const BEE_FACES_RIGHT = true;
	const WAVE_HEIGHT = 1400; // px of container height per S-curve
	const AMPLITUDE = 0.9; // share of the free width used by the curves
	const EASE = 0.035; // how quickly the bee catches up with the scroll
	const MAX_TILT = 18; // degrees
	const TRAIL_SAMPLES = 120;
	const SVG_NS = 'http://www.w3.org/2000/svg';
	const EPSILON = 0.0005;
	const LANDING_SHARE = 0.25; // last part of the flight spent curving in
	const PERCH = 0.85; // how much of the bee's height sits above the button
	const START_ABOVE = 1.5; // start this many bee heights above the container
	const BUTTON_SELECTOR =
		'.wp-block-button__link, .wp-block-create-block-my-handdrawn-button';

	const flights = [ ...containers ]
		.map( ( container, index ) => {
			const layer = container.querySelector( ':scope > .bee-flight__layer' );
			const bee = layer && layer.querySelector( '.bee-flight__bee' );
			if ( ! bee ) {
				return null;
			}

			return {
				container,
				layer,
				bee,
				width: 0,
				height: 0,
				size: 0,
				current: null,
				target: 0,
				facing: 1,
				visible: false,
				landed: false,
				// Landing spot (relative to the layer), or null to end at the
				// bottom of the container.
				land: null,
				canLand: ! layer.classList.contains( 'no-landing' ),
				trail: layer.classList.contains( 'no-trail' )
					? null
					: createTrail( layer, bee, index ),
			};
		} )
		.filter( Boolean );

	if ( ! flights.length ) {
		return;
	}

	const clamp = ( value, min, max ) => Math.min( max, Math.max( min, value ) );

	function measure( flight ) {
		flight.width = flight.layer.clientWidth;
		flight.height = flight.layer.clientHeight;
		flight.size = flight.bee.offsetWidth;
		flight.land = flight.canLand ? findLandingSpot( flight ) : null;
		buildTrail( flight );
	}

	// Top edge of the last button in the content, centred for the bee.
	function findLandingSpot( flight ) {
		const buttons = flight.container.querySelectorAll( BUTTON_SELECTOR );
		const button = buttons[ buttons.length - 1 ];
		if ( ! button ) {
			return null;
		}

		const layerRect = flight.layer.getBoundingClientRect();
		const rect = button.getBoundingClientRect();
		if ( ! rect.width || ! rect.height ) {
			return null;
		}

		const free = Math.max( 0, flight.width - flight.size );
		return {
			x: clamp(
				rect.left - layerRect.left + rect.width / 2 - flight.size / 2,
				0,
				free
			),
			y: Math.max( 0, rect.top - layerRect.top - flight.size * PERCH ),
		};
	}

	// Where the flight ends, from the top of the layer.
	function endY( flight ) {
		return flight.land
			? flight.land.y
			: Math.max( 0, flight.height - flight.size );
	}

	// 0 → 1 over the last part of the flight, eased at both ends.
	function landingWeight( p ) {
		const t = clamp( ( p - ( 1 - LANDING_SHARE ) ) / LANDING_SHARE, 0, 1 );
		return t * t * ( 3 - 2 * t );
	}

	/**
	 * Dotted trail behind the bee: a dotted copy of the flight path, masked
	 * by a solid copy whose dash offset follows the bee, so only the part
	 * already flown is visible. Generated here (not saved in the markup).
	 */
	function createTrail( layer, bee, index ) {
		const id = `bee-trail-${ index }-${ Math.random().toString( 36 ).slice( 2, 8 ) }`;
		const svg = document.createElementNS( SVG_NS, 'svg' );
		svg.setAttribute( 'class', 'bee-flight__trail' );
		svg.setAttribute( 'aria-hidden', 'true' );
		svg.style.color = window.getComputedStyle( bee ).color;

		const mask = document.createElementNS( SVG_NS, 'mask' );
		mask.setAttribute( 'id', id );
		mask.setAttribute( 'maskUnits', 'userSpaceOnUse' );
		const reveal = document.createElementNS( SVG_NS, 'path' );
		reveal.setAttribute( 'fill', 'none' );
		reveal.setAttribute( 'stroke', '#fff' );
		reveal.setAttribute( 'stroke-width', '16' );
		reveal.setAttribute( 'stroke-linecap', 'butt' );
		reveal.setAttribute( 'pathLength', '1' );
		reveal.setAttribute( 'stroke-dasharray', '1 1' );
		reveal.setAttribute( 'stroke-dashoffset', '1' );
		mask.appendChild( reveal );

		const dots = document.createElementNS( SVG_NS, 'path' );
		dots.setAttribute( 'fill', 'none' );
		dots.setAttribute( 'stroke', 'currentColor' );
		dots.setAttribute( 'stroke-width', '4' );
		dots.setAttribute( 'stroke-linecap', 'round' );
		dots.setAttribute( 'stroke-dasharray', '0 14' );
		dots.setAttribute( 'mask', `url(#${ id })` );

		svg.appendChild( mask );
		svg.appendChild( dots );
		layer.insertBefore( svg, bee );

		return { svg, mask, reveal, dots };
	}

	function buildTrail( flight ) {
		const { trail, width, height, size } = flight;
		if ( ! trail ) {
			return;
		}

		trail.svg.setAttribute( 'viewBox', `0 0 ${ width } ${ height }` );
		trail.mask.setAttribute( 'x', '0' );
		trail.mask.setAttribute( 'y', '0' );
		trail.mask.setAttribute( 'width', `${ width }` );
		trail.mask.setAttribute( 'height', `${ height }` );

		const half = size / 2;
		let d = '';
		let prev = null;
		// Distance along the trail at each sample, so the reveal can follow
		// the bee exactly: progress p moves the bee evenly downwards, but the
		// wide sideways parts of a curve cover far more trail per step.
		const lengths = [];
		for ( let i = 0; i <= TRAIL_SAMPLES; i++ ) {
			const point = pointAt( flight, i / TRAIL_SAMPLES );
			lengths.push(
				prev
					? lengths[ i - 1 ] +
							Math.hypot( point.x - prev.x, point.y - prev.y )
					: 0
			);
			prev = point;
			d += `${ i ? 'L' : 'M' }${ ( point.x + half ).toFixed( 1 ) },${ (
				point.y + half
			).toFixed( 1 ) }`;
		}
		trail.lengths = lengths;
		trail.reveal.setAttribute( 'd', d );
		trail.dots.setAttribute( 'd', d );
	}

	// Share of the trail (0–1) flown by the time the bee is at progress p.
	function trailShare( trail, p ) {
		const { lengths } = trail;
		const total = lengths && lengths[ lengths.length - 1 ];
		if ( ! total ) {
			return p;
		}

		const index = clamp( p, 0, 1 ) * TRAIL_SAMPLES;
		const i = Math.min( TRAIL_SAMPLES - 1, Math.floor( index ) );
		const t = index - i;
		return ( lengths[ i ] + ( lengths[ i + 1 ] - lengths[ i ] ) * t ) / total;
	}

	// Position on the path at progress p (0 = top, 1 = end of the flight).
	function pointAt( flight, p ) {
		const free = Math.max( 0, flight.width - flight.size );
		const waves = Math.max( 1, Math.round( flight.height / WAVE_HEIGHT ) );
		const amplitude = ( free / 2 ) * AMPLITUDE;
		const wave = free / 2 + amplitude * Math.sin( 2 * Math.PI * waves * p );

		// Start just above the container (hidden by the layer's overflow),
		// so the bee flies in from the top.
		const startY = -flight.size * START_ABOVE;
		const y = startY + p * ( endY( flight ) - startY );

		if ( ! flight.land ) {
			return { x: wave, y };
		}

		// Curve in towards the button over the last part of the flight.
		const w = landingWeight( p );
		return {
			x: wave * ( 1 - w ) + flight.land.x * w,
			y,
		};
	}

	// Scroll progress: 0 when the section's top is 75% down the screen, 1
	// when the end of the flight (the button, or the bottom) is 40% down,
	// so the bee stays in view and lands while the button is on screen.
	function targetFor( flight ) {
		const rect = flight.container.getBoundingClientRect();
		const vh = window.innerHeight;
		return clamp(
			( vh * 0.75 - rect.top ) / ( vh * 0.35 + endY( flight ) ),
			0,
			1
		);
	}

	function render( flight, direction ) {
		const p = flight.current;
		const { x, y } = pointAt( flight, p );
		const ahead = pointAt( flight, Math.min( 1, p + 0.002 ) );
		const behind = pointAt( flight, Math.max( 0, p - 0.002 ) );
		const dx = ahead.x - behind.x;
		const dy = ahead.y - behind.y;

		// Moving along the path (down) or back along it (up).
		const vx = dx * direction;
		const vy = dy * direction;

		if ( Math.abs( vx ) > 0.01 ) {
			flight.facing = vx > 0 ? 1 : -1;
		}

		// Tilt with the curve: nose down when descending, up when climbing.
		const heading =
			Math.atan2( vy, Math.abs( vx ) || 0.01 ) * ( 180 / Math.PI );
		// Level out while landing.
		const level = flight.land ? 1 - landingWeight( p ) : 1;
		const tilt = clamp( heading, -MAX_TILT, MAX_TILT ) * flight.facing * level;
		const flip = BEE_FACES_RIGHT ? flight.facing : -flight.facing;

		flight.bee.style.transform = `translate3d(${ x }px, ${ y }px, 0) rotate(${ tilt }deg) scaleX(${ flip })`;

		const landed = !! flight.land && p > 0.995;
		if ( landed !== flight.landed ) {
			flight.landed = landed;
			flight.bee.classList.toggle( 'is-landed', landed );
		}

		if ( flight.trail ) {
			flight.trail.reveal.setAttribute(
				'stroke-dashoffset',
				`${ 1 - trailShare( flight.trail, flight.current ) }`
			);
		}
	}

	let frame = null;

	function tick() {
		frame = null;
		let moving = false;

		flights.forEach( ( flight ) => {
			if ( ! flight.visible ) {
				return;
			}

			flight.target = targetFor( flight );

			if ( flight.current === null ) {
				flight.current = flight.target;
				render( flight, 1 );
				return;
			}

			const diff = flight.target - flight.current;
			if ( Math.abs( diff ) < EPSILON ) {
				return;
			}

			flight.current += diff * EASE;
			render( flight, diff > 0 ? 1 : -1 );
			moving = true;
		} );

		if ( moving ) {
			schedule();
		}
	}

	function schedule() {
		if ( ! frame ) {
			frame = requestAnimationFrame( tick );
		}
	}

	const visibility = new IntersectionObserver(
		( entries ) => {
			entries.forEach( ( entry ) => {
				const flight = flights.find(
					( item ) => item.container === entry.target
				);
				if ( flight ) {
					flight.visible = entry.isIntersecting;
				}
			} );
			schedule();
		},
		{ rootMargin: '25% 0px' }
	);

	const sizes = new ResizeObserver( ( entries ) => {
		entries.forEach( ( entry ) => {
			const flight = flights.find(
				( item ) => item.container === entry.target
			);
			if ( flight ) {
				measure( flight );
				if ( flight.current !== null ) {
					render( flight, 1 );
				}
			}
		} );
		schedule();
	} );

	flights.forEach( ( flight ) => {
		measure( flight );
		visibility.observe( flight.container );
		sizes.observe( flight.container );
	} );

	// Fonts and images can move the button after DOMContentLoaded.
	window.addEventListener( 'load', () => {
		flights.forEach( ( flight ) => {
			measure( flight );
			if ( flight.current !== null ) {
				render( flight, 1 );
			}
		} );
		schedule();
	} );

	window.addEventListener( 'scroll', schedule, { passive: true } );
	if ( window.lenis ) {
		window.lenis.on( 'scroll', schedule );
	}
} );
