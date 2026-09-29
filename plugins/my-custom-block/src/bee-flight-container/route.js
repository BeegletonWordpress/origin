/**
 * Plans the bee's flight around the content: a Dijkstra search on a grid
 * over the flight area, from the start (above the container) down to the
 * end (the landing button, or the bottom). Blocks are costly to pass
 * behind but not forbidden, so a route always exists even when something
 * spans the full width. A soft pull towards a sine wave keeps the gentle
 * S-curves wherever there is room. The grid route is then smoothed and
 * resampled to evenly spaced points.
 *
 * Pure geometry (no DOM), all in the flight layer's pixel coordinates, with
 * points being the bee's centre.
 */

const SIDEWAYS_COST = 1.3; // prefer flowing downwards over sideways
const WAVE_WEIGHT = 0.08; // pull towards the S-curve, per cell of distance
const BLOCKED_COST = 25; // extra cost per cell spent behind a block
const SMOOTHING_PASSES = 3;
const ROUTE_POINTS = 200;

class MinHeap {
	constructor() {
		this.items = [];
	}

	get size() {
		return this.items.length;
	}

	push( cost, node ) {
		const items = this.items;
		items.push( [ cost, node ] );
		let i = items.length - 1;
		while ( i > 0 ) {
			const parent = ( i - 1 ) >> 1;
			if ( items[ parent ][ 0 ] <= items[ i ][ 0 ] ) {
				break;
			}
			[ items[ parent ], items[ i ] ] = [ items[ i ], items[ parent ] ];
			i = parent;
		}
	}

	pop() {
		const items = this.items;
		const top = items[ 0 ];
		const last = items.pop();
		if ( items.length ) {
			items[ 0 ] = last;
			let i = 0;
			for ( ;; ) {
				const left = i * 2 + 1;
				const right = left + 1;
				let smallest = i;
				if ( left < items.length && items[ left ][ 0 ] < items[ smallest ][ 0 ] ) {
					smallest = left;
				}
				if ( right < items.length && items[ right ][ 0 ] < items[ smallest ][ 0 ] ) {
					smallest = right;
				}
				if ( smallest === i ) {
					break;
				}
				[ items[ smallest ], items[ i ] ] = [ items[ i ], items[ smallest ] ];
				i = smallest;
			}
		}
		return top;
	}
}

// Corner-cutting smoothing. Keeps the end points, and keeps a route that
// never goes up still never going up.
function chaikin( points, passes ) {
	let result = points;
	for ( let pass = 0; pass < passes; pass++ ) {
		if ( result.length < 3 ) {
			return result;
		}
		const next = [ result[ 0 ] ];
		for ( let i = 0; i < result.length - 1; i++ ) {
			const a = result[ i ];
			const b = result[ i + 1 ];
			next.push(
				{ x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25 },
				{ x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75 }
			);
		}
		next.push( result[ result.length - 1 ] );
		result = next;
	}
	return result;
}

// Evenly spaced points along the polyline, so an index is a share of the
// distance flown.
function resample( points, count ) {
	if ( points.length < 2 ) {
		return Array.from( { length: count }, () => ( { ...points[ 0 ] } ) );
	}

	const lengths = [ 0 ];
	for ( let i = 1; i < points.length; i++ ) {
		lengths.push(
			lengths[ i - 1 ] +
				Math.hypot(
					points[ i ].x - points[ i - 1 ].x,
					points[ i ].y - points[ i - 1 ].y
				)
		);
	}

	const total = lengths[ lengths.length - 1 ];
	const result = [];
	let segment = 1;
	for ( let i = 0; i < count; i++ ) {
		const distance = ( total * i ) / ( count - 1 );
		while ( segment < points.length - 1 && lengths[ segment ] < distance ) {
			segment++;
		}
		const a = points[ segment - 1 ];
		const b = points[ segment ];
		const span = lengths[ segment ] - lengths[ segment - 1 ] || 1;
		const t = Math.min( 1, Math.max( 0, ( distance - lengths[ segment - 1 ] ) / span ) );
		result.push( { x: a.x + ( b.x - a.x ) * t, y: a.y + ( b.y - a.y ) * t } );
	}
	return result;
}

/**
 * @param {Object}   options
 * @param {number}   options.width     Flight area width.
 * @param {number}   options.size      Bee size.
 * @param {Object}   options.start     Start point {x, y} (bee centre).
 * @param {Object}   options.end       End point {x, y} (bee centre).
 * @param {Object[]} options.obstacles Boxes {left, top, right, bottom} the
 *                                     bee's centre should stay out of
 *                                     (already grown by the bee's reach).
 * @param {Function} options.waveX     Preferred x for a given y.
 * @param {number}   options.cell      Grid cell size.
 * @return {Object[]} Evenly spaced route points {x, y}.
 */
export function planRoute( { width, size, start, end, obstacles, waveX, cell } ) {
	const minX = size / 2;
	const maxX = Math.max( minX, width - size / 2 );
	const cols = Math.max( 1, Math.floor( ( maxX - minX ) / cell ) + 1 );
	const rows = Math.max( 2, Math.ceil( ( end.y - start.y ) / cell ) + 1 );
	const cellX = cols > 1 ? ( maxX - minX ) / ( cols - 1 ) : 0;
	const cellY = ( end.y - start.y ) / ( rows - 1 );

	if ( cols < 2 || cellY <= 0 ) {
		return resample( [ start, end ], ROUTE_POINTS );
	}

	const colX = ( c ) => minX + c * cellX;
	const rowY = ( r ) => start.y + r * cellY;
	const nearestCol = ( x ) =>
		Math.min( cols - 1, Math.max( 0, Math.round( ( x - minX ) / cellX ) ) );

	// Mark the grid cells covered by obstacles.
	const blocked = new Uint8Array( rows * cols );
	obstacles.forEach( ( box ) => {
		const c0 = Math.max( 0, Math.ceil( ( box.left - minX ) / cellX ) );
		const c1 = Math.min( cols - 1, Math.floor( ( box.right - minX ) / cellX ) );
		const r0 = Math.max( 0, Math.ceil( ( box.top - start.y ) / cellY ) );
		const r1 = Math.min( rows - 1, Math.floor( ( box.bottom - start.y ) / cellY ) );
		for ( let r = r0; r <= r1; r++ ) {
			for ( let c = c0; c <= c1; c++ ) {
				blocked[ r * cols + c ] = 1;
			}
		}
	} );

	// Cost of being in a cell: pulled towards the wave, pushed out of blocks.
	const cellCost = ( r, c ) =>
		( WAVE_WEIGHT * Math.abs( colX( c ) - waveX( rowY( r ) ) ) ) / cell +
		( blocked[ r * cols + c ] ? BLOCKED_COST : 0 );

	const startNode = nearestCol( start.x );
	const goal = ( rows - 1 ) * cols + nearestCol( end.x );
	const cost = new Float64Array( rows * cols ).fill( Infinity );
	const from = new Int32Array( rows * cols ).fill( -1 );
	const heap = new MinHeap();
	cost[ startNode ] = 0;
	heap.push( 0, startNode );

	const diagonal = Math.hypot( cellX, cellY ) / cell;
	const down = cellY / cell;
	const sideways = ( cellX / cell ) * SIDEWAYS_COST;

	while ( heap.size ) {
		const [ current, node ] = heap.pop();
		if ( node === goal ) {
			break;
		}
		if ( current > cost[ node ] ) {
			continue;
		}

		const r = Math.floor( node / cols );
		const c = node % cols;
		// Down, down-diagonal or sideways; never up.
		const moves = [
			[ r + 1, c, down ],
			[ r + 1, c - 1, diagonal ],
			[ r + 1, c + 1, diagonal ],
			[ r, c - 1, sideways ],
			[ r, c + 1, sideways ],
		];

		moves.forEach( ( [ nr, nc, step ] ) => {
			if ( nr >= rows || nc < 0 || nc >= cols ) {
				return;
			}
			const next = nr * cols + nc;
			const total = current + step * ( 1 + cellCost( nr, nc ) );
			if ( total < cost[ next ] ) {
				cost[ next ] = total;
				from[ next ] = node;
				heap.push( total, next );
			}
		} );
	}

	// Walk back from the goal. If the goal was never reached (it always is,
	// since nothing is forbidden), fall back to a straight line.
	if ( from[ goal ] === -1 && goal !== startNode ) {
		return resample( [ start, end ], ROUTE_POINTS );
	}

	const cells = [];
	for ( let node = goal; node !== -1; node = from[ node ] ) {
		cells.push( node );
	}
	cells.reverse();

	const points = cells.map( ( node ) => ( {
		x: colX( node % cols ),
		y: rowY( Math.floor( node / cols ) ),
	} ) );
	points[ 0 ] = { ...start };
	points[ points.length - 1 ] = { ...end };

	return resample( chaikin( points, SMOOTHING_PASSES ), ROUTE_POINTS );
}

/**
 * Route position (0–1) where the route first reaches the given y. Route
 * points never go up, so a binary search over y works.
 *
 * @param {Object[]} route Route points.
 * @param {number}   y     Target y.
 * @return {number} Position along the route, 0–1.
 */
export function positionAtY( route, y ) {
	const last = route.length - 1;
	if ( y <= route[ 0 ].y ) {
		return 0;
	}
	if ( y >= route[ last ].y ) {
		return 1;
	}

	let low = 0;
	let high = last;
	while ( high - low > 1 ) {
		const mid = ( low + high ) >> 1;
		if ( route[ mid ].y < y ) {
			low = mid;
		} else {
			high = mid;
		}
	}

	const span = route[ high ].y - route[ low ].y || 1;
	return ( low + ( y - route[ low ].y ) / span ) / last;
}

/**
 * Point on the route at position u (0–1).
 *
 * @param {Object[]} route Route points.
 * @param {number}   u     Position along the route.
 * @return {Object} Point {x, y}.
 */
export function pointOnRoute( route, u ) {
	const last = route.length - 1;
	const index = Math.min( last, Math.max( 0, u ) ) * last;
	const i = Math.min( last - 1, Math.floor( index ) );
	const t = index - i;
	const a = route[ i ];
	const b = route[ i + 1 ];
	return { x: a.x + ( b.x - a.x ) * t, y: a.y + ( b.y - a.y ) * t };
}
