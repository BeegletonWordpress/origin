document.addEventListener( 'DOMContentLoaded', () => {
	const VISIBLE_LENGTH = 385;

	const arrowBlocks = document.querySelectorAll(
		'.wp-block-my-custom-block-animation-arrow'
	);

	if ( ! arrowBlocks.length ) {
		return;
	}

	arrowBlocks.forEach( ( block ) => {
		const svg = block.querySelector( '.curvy-arrow-svg' );
		if ( ! svg ) {
			return;
		}

		const path = svg.querySelector( '.curvy-arrow-path' );
		if ( ! path ) {
			return;
		}

		path.style.strokeDasharray = VISIBLE_LENGTH;
		path.style.strokeDashoffset = VISIBLE_LENGTH;
	} );

	if ( ! window.lenis ) {
		console.log( 'Lenis not initialized, skipping arrow animation' );
		return;
	}

	function animateDraw( delay = 0 ) {
		setTimeout( () => {
			arrowBlocks.forEach( ( block ) => {
				const path = block.querySelector( '.curvy-arrow-path' );
				if ( ! path || path.dataset.drawn === 'true' ) {
					return;
				}

				const startTime = performance.now();
				const duration = 2500;

				function draw( currentTime ) {
					const elapsed = currentTime - startTime;
					const progress = Math.min( elapsed / duration, 1 );
					const eased = 1 - Math.pow( 1 - progress, 3 );

					path.style.strokeDashoffset =
						VISIBLE_LENGTH * ( 1 - eased );

					if ( progress < 1 ) {
						requestAnimationFrame( draw );
					} else {
						path.dataset.drawn = 'true';
					}
				}

				requestAnimationFrame( draw );
			} );
		}, delay );
	}

	animateDraw( 2100 );

	window.lenis.on( 'scroll', () => {
		const scrollY = window.lenis.animatedScroll;
		const windowHeight = window.innerHeight;

		arrowBlocks.forEach( ( block ) => {
			const path = block.querySelector( '.curvy-arrow-path' );
			if ( ! path || path.dataset.drawn !== 'true' ) {
				return;
			}

			const rect = block.getBoundingClientRect();
			let opacity = 1;

			const fadeStartPoint = windowHeight * 0.5;
			const fadeEndPoint = -rect.height * 0.5;

			if ( rect.top < fadeStartPoint ) {
				const totalDistance = fadeStartPoint - fadeEndPoint;
				const fadeProgress = Math.max(
					0,
					Math.min(
						1,
						1 - ( rect.top - fadeEndPoint ) / totalDistance
					)
				);
				opacity = 1 - fadeProgress;
			}

			if ( rect.top < fadeEndPoint ) {
				opacity = 0;
			}

			block.style.setProperty( 'opacity', opacity, 'important' );
		} );
	} );
} );
