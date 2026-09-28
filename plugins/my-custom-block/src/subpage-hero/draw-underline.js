/**
 * Draw-in animation for the hand-drawn underline under a hero's title.
 * Shared by the Subpage Hero and Subpage Video Hero view scripts.
 *
 * @param {NodeList|Element[]} blocks Hero block elements.
 */
export function drawUnderlines( blocks ) {
	if ( ! blocks.length ) {
		return;
	}

	const VISIBLE_LENGTH = 500;

	blocks.forEach( ( block ) => {
		const svg = block.querySelector( '.handdrawn-underline-svg' );
		if ( ! svg ) {
			return;
		}

		const path = svg.querySelector( '.handdrawn-underline-path' );
		if ( ! path ) {
			return;
		}

		const actualLength = path.getTotalLength
			? path.getTotalLength()
			: VISIBLE_LENGTH;

		path.style.strokeDasharray = actualLength;
		path.style.strokeDashoffset = actualLength;
		path.style.fill = 'none';
	} );

	function animateDraw() {
		blocks.forEach( ( block ) => {
			const path = block.querySelector( '.handdrawn-underline-path' );
			if ( ! path || path.dataset.drawn === 'true' ) {
				return;
			}

			const actualLength = path.getTotalLength
				? path.getTotalLength()
				: VISIBLE_LENGTH;

			path.style.strokeDasharray = actualLength;
			path.style.strokeDashoffset = actualLength;

			const startTime = performance.now();
			const duration = 1000;

			function draw( currentTime ) {
				const elapsed = currentTime - startTime;
				const progress = Math.min( elapsed / duration, 1 );
				const eased =
					progress < 0.5
						? 4 * progress * progress * progress
						: 1 - Math.pow( -2 * progress + 2, 3 ) / 2;

				path.style.strokeDashoffset = actualLength * ( 1 - eased );

				if ( progress < 1 ) {
					requestAnimationFrame( draw );
				} else {
					path.dataset.drawn = 'true';
				}
			}

			requestAnimationFrame( draw );
		} );
	}

	animateDraw();
}
