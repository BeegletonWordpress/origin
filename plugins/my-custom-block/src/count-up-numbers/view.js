document.addEventListener( 'DOMContentLoaded', () => {
	const observer = new IntersectionObserver( ( entries, observer ) => {
		entries.forEach( ( entry ) => {
			if ( entry.isIntersecting ) {
				const startValue = 0;

				const target = entry.target;
				const finalValue = parseInt( target.textContent, 10 );
				const duration = 4000;
				const startTime = performance.now();

				const animateCounter = ( currentTime ) => {
					const elapsedTime = currentTime - startTime;
					const progress = Math.min( elapsedTime / duration, 1 );
					const currentValue = Math.ceil( progress * finalValue );

					target.textContent = currentValue;

					if ( progress < 1 ) {
						requestAnimationFrame( animateCounter );
					}

					/* console.log(
						`Animating ${finalValue}: ${currentValue} (${Math.round(
							progress * 100,
						)}%)`,
					); */
				};

				requestAnimationFrame( animateCounter );
				observer.unobserve( target );
			}
		} );
	} );

	document.querySelectorAll( '.count-up-value' ).forEach( ( el ) => {
		observer.observe( el );
	} );
} );
