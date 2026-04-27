document.addEventListener( 'DOMContentLoaded', () => {
	const VISIBLE_LENGTH = 500;

	const customerCaseHeroBlocks = document.querySelectorAll(
		'.wp-block-create-block-customer-case-hero'
	);

	if ( ! customerCaseHeroBlocks.length ) {
		return;
	}

	function setupPath( block, selector ) {
		const path = block.querySelector( selector );
		if ( ! path ) {
			return null;
		}

		const actualLength = path.getTotalLength
			? path.getTotalLength()
			: VISIBLE_LENGTH;

		path.style.strokeDasharray = actualLength;
		path.style.strokeDashoffset = actualLength;
		path.style.fill = 'none';

		return { path, actualLength };
	}

	customerCaseHeroBlocks.forEach( ( block ) => {
		setupPath( block, '.handdrawn-underline-path' );
		setupPath( block, '.handdrawn-ring-path' );
	} );

	function animateDraw() {
		customerCaseHeroBlocks.forEach( ( block ) => {
			const underline = setupPath( block, '.handdrawn-underline-path' );
			const ring = setupPath( block, '.handdrawn-ring-path' );

			const pathsToAnimate = [];
			if ( underline && underline.path.dataset.drawn !== 'true' ) {
				pathsToAnimate.push( underline );
			}
			if ( ring && ring.path.dataset.drawn !== 'true' ) {
				pathsToAnimate.push( ring );
			}

			if ( pathsToAnimate.length === 0 ) {
				return;
			}

			const startTime = performance.now();
			const duration = 1000;

			function draw( currentTime ) {
				const elapsed = currentTime - startTime;
				const progress = Math.min( elapsed / duration, 1 );
				const eased =
					progress < 0.5
						? 4 * progress * progress * progress
						: 1 - Math.pow( -2 * progress + 2, 3 ) / 2;

				pathsToAnimate.forEach( ( { path, actualLength } ) => {
					path.style.strokeDashoffset = actualLength * ( 1 - eased );
				} );

				if ( progress < 1 ) {
					requestAnimationFrame( draw );
				} else {
					pathsToAnimate.forEach( ( { path } ) => {
						path.dataset.drawn = 'true';
					} );
				}
			}

			requestAnimationFrame( draw );
		} );
	}

	animateDraw();

	if ( ! window.lenis ) {
		console.log( 'Lenis not initialized, skipping customer-case-hero parallax' );
		return;
	}

	window.lenis.on( 'scroll', () => {
		const scroll = window.lenis.animatedScroll;
		document.querySelectorAll( '.customer-case-hero-image' ).forEach( ( el ) => {
			el.style.transform = `translateY(${ scroll * 0.5 }px)`;
		} );
	} );
} );