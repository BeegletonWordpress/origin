/**
 * Bee Flight Container: the bee flies from above the container down through
 * it as the section scrolls through the screen, easing after the scroll and
 * settling when it stops. Its route is planned around the content (text
 * lines, images, cards, buttons) so it weaves through the gaps in gentle
 * S-curves (see route.js), and if the content has a button the flight ends
 * sitting on top of the last one. Everything is computed from the live
 * layout, so it adapts to any height, screen width or content.
 */
import { BEE_PATH, BEE_VIEWBOX } from './bee-path';
import { planRoute, positionAtY, pointOnRoute } from './route';
import metadata from './block.json';

/**
 * Customer Cases / Posts with the "Flying bee" switch on get the
 * mcb-bee-flight-host class on their post content (my-custom-block.php,
 * mcb_bee_flight_post_content). There is no block markup there, so build the
 * same layer and bee the block saves, with the block's default size/colour.
 */
function addBeeToHost( host ) {
	if ( host.querySelector( ':scope > .bee-flight__layer' ) ) {
		return;
	}

	const SVG_NS = 'http://www.w3.org/2000/svg';
	const layer = document.createElement( 'div' );
	layer.className = 'bee-flight__layer';
	layer.setAttribute( 'aria-hidden', 'true' );

	const bee = document.createElement( 'div' );
	bee.className = 'bee-flight__bee';
	bee.style.setProperty(
		'--bee-size',
		`${ metadata.attributes.beeSize.default }px`
	);
	bee.style.color = metadata.attributes.beeColor.default;

	const svg = document.createElementNS( SVG_NS, 'svg' );
	svg.setAttribute( 'viewBox', BEE_VIEWBOX );
	svg.setAttribute( 'class', 'w-full h-full' );
	const path = document.createElementNS( SVG_NS, 'path' );
	path.setAttribute( 'fill', 'currentColor' );
	path.setAttribute( 'd', BEE_PATH );
	svg.appendChild( path );

	bee.appendChild( svg );
	layer.appendChild( bee );
	host.prepend( layer );
}

document.addEventListener( 'DOMContentLoaded', () => {
	document.querySelectorAll( '.mcb-bee-flight-host' ).forEach( addBeeToHost );

	const containers = document.querySelectorAll(
		'.wp-block-create-block-my-bee-flight-container, .mcb-bee-flight-host'
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
	const SVG_NS = 'http://www.w3.org/2000/svg';
	const EPSILON = 0.0005;
	const LANDING_SHARE = 0.1; // last part of the route spent levelling out
	const PERCH = 0.85; // how much of the bee's height sits above the button
	const START_ABOVE = 1.5; // start this many bee heights above the container
	const CELL_MIN = 24; // smallest route grid cell, px
	const OBSTACLE_MARGIN = 0.35; // gap kept around content, in bee sizes
	const BUTTON_SELECTOR =
		'.wp-block-button__link, .wp-block-create-block-my-handdrawn-button';
	const TEXT_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption';
	const SOLID_SELECTOR = [
		'img',
		'video',
		'iframe',
		'table',
		'.wp-block-embed',
		'.wp-block-cover',
		'.has-background',
		'.wp-block-create-block-my-handdrawn-card',
		'.wp-block-create-block-small-handdrawn-card',
		BUTTON_SELECTOR,
	].join( ', ' );

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
				// Landing spot and button (relative to the layer), or null to
				// end at the bottom of the container.
				land: null,
				canLand: ! layer.classList.contains( 'no-landing' ),
				// Evenly spaced route points (the bee's top-left corner).
				route: null,
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
		flight.route = buildRoute( flight );
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
			button,
			x: clamp(
				rect.left - layerRect.left + rect.width / 2 - flight.size / 2,
				0,
				free
			),
			y: Math.max( 0, rect.top - layerRect.top - flight.size * PERCH ),
		};
	}

	// Start (hidden above the container) and end of the flight, as the
	// bee's top-left corner.
	function startPoint( flight ) {
		return {
			x: ( flight.width - flight.size ) / 2,
			y: -flight.size * START_ABOVE,
		};
	}

	function endPoint( flight ) {
		return flight.land
			? { x: flight.land.x, y: flight.land.y }
			: {
					x: ( flight.width - flight.size ) / 2,
					y: Math.max( 0, flight.height - flight.size ),
			  };
	}

	/**
	 * Boxes the bee should fly around, relative to the layer: the actual
	 * lines of text (not the full-width paragraph boxes) and solid things
	 * like images, videos, cards and buttons. The landing button is left
	 * out, since the bee flies to it.
	 */
	function collectObstacles( flight ) {
		const layerRect = flight.layer.getBoundingClientRect();
		const boxes = [];
		const skip = ( el ) =>
			flight.layer.contains( el ) ||
			( flight.land &&
				( flight.land.button.contains( el ) ||
					el.contains( flight.land.button ) ) );

		const add = ( rect ) => {
			if ( rect.width < 1 || rect.height < 1 ) {
				return;
			}
			boxes.push( {
				left: rect.left - layerRect.left,
				top: rect.top - layerRect.top,
				right: rect.right - layerRect.left,
				bottom: rect.bottom - layerRect.top,
			} );
		};

		flight.container.querySelectorAll( TEXT_SELECTOR ).forEach( ( el ) => {
			if ( skip( el ) || ! el.textContent.trim() ) {
				return;
			}
			const range = document.createRange();
			range.selectNodeContents( el );
			[ ...range.getClientRects() ].forEach( add );
		} );

		flight.container.querySelectorAll( SOLID_SELECTOR ).forEach( ( el ) => {
			if ( ! skip( el ) ) {
				add( el.getBoundingClientRect() );
			}
		} );

		return boxes;
	}

	// Plan the route around the content (in the bee's centre coordinates),
	// then store it as the bee's top-left corner.
	function buildRoute( flight ) {
		const { width, height, size } = flight;
		const half = size / 2;
		const toCentre = ( point ) => ( { x: point.x + half, y: point.y + half } );
		const start = toCentre( startPoint( flight ) );
		const end = toCentre( endPoint( flight ) );

		const waves = Math.max( 1, Math.round( height / WAVE_HEIGHT ) );
		const amplitude = ( Math.max( 0, width - size ) / 2 ) * AMPLITUDE;
		const span = end.y - start.y || 1;
		const waveX = ( y ) =>
			width / 2 +
			amplitude * Math.sin( ( 2 * Math.PI * waves * ( y - start.y ) ) / span );

		// Keep the bee's body (not just its centre) clear of the content.
		const reach = half * 0.8 + size * OBSTACLE_MARGIN;
		const obstacles = collectObstacles( flight ).map( ( box ) => ( {
			left: box.left - reach,
			top: box.top - reach,
			right: box.right + reach,
			bottom: box.bottom + reach,
		} ) );

		const route = planRoute( {
			width,
			size,
			start,
			end,
			obstacles,
			waveX,
			cell: Math.max( CELL_MIN, size * 0.6 ),
		} );

		return route.map( ( point ) => ( { x: point.x - half, y: point.y - half } ) );
	}

	// Position on the route at u (0 = start above the container, 1 = end).
	function pointAt( flight, u ) {
		return flight.route
			? pointOnRoute( flight.route, u )
			: startPoint( flight );
	}

	// 0 → 1 over the last part of the route, eased at both ends.
	function landingWeight( u ) {
		const t = clamp( ( u - ( 1 - LANDING_SHARE ) ) / LANDING_SHARE, 0, 1 );
		return t * t * ( 3 - 2 * t );
	}

	/**
	 * Dotted trail behind the bee: a dotted copy of the route, masked by a
	 * solid copy whose dash offset follows the bee, so only the part already
	 * flown is visible. Generated here (not saved in the markup).
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

	// The route points are evenly spaced, so the share of the trail flown is
	// simply the bee's position u.
	function buildTrail( flight ) {
		const { trail, route, width, height, size } = flight;
		if ( ! trail || ! route ) {
			return;
		}

		trail.svg.setAttribute( 'viewBox', `0 0 ${ width } ${ height }` );
		trail.mask.setAttribute( 'x', '0' );
		trail.mask.setAttribute( 'y', '0' );
		trail.mask.setAttribute( 'width', `${ width }` );
		trail.mask.setAttribute( 'height', `${ height }` );

		const half = size / 2;
		const d = route
			.map(
				( point, i ) =>
					`${ i ? 'L' : 'M' }${ ( point.x + half ).toFixed( 1 ) },${ (
						point.y + half
					).toFixed( 1 ) }`
			)
			.join( '' );
		trail.reveal.setAttribute( 'd', d );
		trail.dots.setAttribute( 'd', d );
	}

	// Scroll progress: 0 when the section's top is 75% down the screen, 1
	// when the end of the flight (the button, or the bottom) is 40% down, so
	// the bee stays in view and lands while the button is on screen. The
	// progress picks a height, and the bee goes to where its route reaches it.
	function targetFor( flight ) {
		const rect = flight.container.getBoundingClientRect();
		const vh = window.innerHeight;
		const start = startPoint( flight ).y;
		const end = endPoint( flight ).y;
		const t = clamp( ( vh * 0.75 - rect.top ) / ( vh * 0.35 + end ), 0, 1 );

		return flight.route
			? positionAtY( flight.route, start + t * ( end - start ) )
			: t;
	}

	function render( flight, direction ) {
		const u = flight.current;
		const { x, y } = pointAt( flight, u );
		const ahead = pointAt( flight, Math.min( 1, u + 0.004 ) );
		const behind = pointAt( flight, Math.max( 0, u - 0.004 ) );
		const dx = ahead.x - behind.x;
		const dy = ahead.y - behind.y;

		// Moving along the route (down) or back along it (up).
		const vx = dx * direction;
		const vy = dy * direction;

		if ( Math.abs( vx ) > 0.01 ) {
			flight.facing = vx > 0 ? 1 : -1;
		}

		// Tilt with the curve: nose down when descending, up when climbing.
		const heading =
			Math.atan2( vy, Math.abs( vx ) || 0.01 ) * ( 180 / Math.PI );
		// Level out while landing.
		const level = flight.land ? 1 - landingWeight( u ) : 1;
		const tilt = clamp( heading, -MAX_TILT, MAX_TILT ) * flight.facing * level;
		const flip = BEE_FACES_RIGHT ? flight.facing : -flight.facing;

		flight.bee.style.transform = `translate3d(${ x }px, ${ y }px, 0) rotate(${ tilt }deg) scaleX(${ flip })`;

		const landed = !! flight.land && u > 0.995;
		if ( landed !== flight.landed ) {
			flight.landed = landed;
			flight.bee.classList.toggle( 'is-landed', landed );
		}

		if ( flight.trail ) {
			flight.trail.reveal.setAttribute(
				'stroke-dashoffset',
				`${ 1 - u }`
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

	// Re-plan a flight's route, at most once per frame.
	const pending = new Set();
	let measureFrame = null;
	function remeasure( flight ) {
		pending.add( flight );
		if ( measureFrame ) {
			return;
		}
		measureFrame = requestAnimationFrame( () => {
			measureFrame = null;
			pending.forEach( ( item ) => {
				measure( item );
				if ( item.current !== null ) {
					// Keep the bee at the same height on the new route.
					item.current = item.target = targetFor( item );
					render( item, 1 );
				}
			} );
			pending.clear();
			schedule();
		} );
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
				remeasure( flight );
			}
		} );
	} );

	flights.forEach( ( flight ) => {
		measure( flight );
		visibility.observe( flight.container );
		sizes.observe( flight.container );
	} );

	// Fonts and images can move the content after DOMContentLoaded.
	window.addEventListener( 'load', () => {
		flights.forEach( remeasure );
	} );

	window.addEventListener( 'scroll', schedule, { passive: true } );
	if ( window.lenis ) {
		window.lenis.on( 'scroll', schedule );
	}
} );
