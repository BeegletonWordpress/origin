document.addEventListener( 'DOMContentLoaded', () => {
	if ( ! window.lenis ) {
		console.log( 'Lenis not initialized, skipping hero parallax' );
		return;
	}

	window.lenis.on( 'scroll', () => {
		const scroll = window.lenis.animatedScroll;
		document.querySelectorAll( '.hero-left-col' ).forEach( ( el ) => {
			el.style.transform = `translateY(${ scroll * -0.5 }px)`;
		} );

	} );
} );
