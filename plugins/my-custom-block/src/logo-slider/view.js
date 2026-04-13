/**
 * Logo Slider - Frontend JavaScript
 * Handles continuous scrolling animation with pause on hover
 */

document.addEventListener( 'DOMContentLoaded', () => {
	const sliders = document.querySelectorAll( '.logo-slider-container' );

	sliders.forEach( ( container ) => {
		const track = container.querySelector( '.logo-slider-track' );
		if ( ! track ) {
			return;
		}

		const autoplay = track.dataset.autoplay !== 'false';
		const speed = parseInt( track.dataset.speed, 10 ) || 50;
		const pauseOnHover = track.dataset.pauseOnHover !== 'false';

		if ( ! autoplay ) {
			track.style.animation = 'none';
			return;
		}

		// Clone all items to create seamless loop
		const items = Array.from( track.children );
		if ( items.length === 0 ) {
			return;
		}

		items.forEach( ( item ) => {
			track.appendChild( item.cloneNode( true ) );
		} );

		// Calculate total width of original items
		const trackStyle = getComputedStyle( track );
		const gap = parseFloat( trackStyle.gap ) || 8;

		const originalItemCount = items.length;
		let itemWidth = 0;
		for ( let i = 0; i < originalItemCount; i++ ) {
			itemWidth += ( items[ i ].offsetWidth || 0 ) + gap;
		}

		// Duration based on moving original set width
		const duration = ( itemWidth / speed ) * 2;
		track.style.animationDuration = `${ duration }s`;

		if ( pauseOnHover ) {
			container.addEventListener( 'mouseenter', () => {
				track.classList.add( 'paused' );
			} );
			container.addEventListener( 'mouseleave', () => {
				track.classList.remove( 'paused' );
			} );
		}
	} );
} );
