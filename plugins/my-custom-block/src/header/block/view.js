/**
 * Simple throttle function to limit the rate of execution.
 * @param func
 * @param limit
 */
function throttle( func, limit ) {
	let inThrottle;
	return function ( ...args ) {
		if ( ! inThrottle ) {
			func.apply( this, args );
			inThrottle = true;
			setTimeout( () => ( inThrottle = false ), limit );
		}
	};
}

const header = document.querySelector(
	'.wp-block-create-block-my-header-block'
);

if ( header ) {
	let lastScrollY = window.scrollY;

	const handleScroll = () => {
		const scrollY = window.scrollY;
		const isScrolled = header.classList.contains( 'is-scrolled' );

		// Use hysteresis with a larger gap to prevent flashing.
		// Add at 80px, remove at 30px.
		if ( ! isScrolled && scrollY > 80 ) {
			requestAnimationFrame( () => {
				header.classList.add( 'is-scrolled' );
				// console.log("Header is now scrolled.");
			} );
		} else if ( isScrolled && scrollY < 30 ) {
			requestAnimationFrame( () => {
				header.classList.remove( 'is-scrolled' );
				// console.log("Header is now at the top.");
			} );
		}
		lastScrollY = scrollY;
	};

	// Throttle to roughly 60fps (16ms) to keep it smooth but prevent
	// excessive layout recalculations.
	window.addEventListener( 'scroll', throttle( handleScroll, 16 ), {
		passive: true,
	} );
}

/**
 * Restructure Max Mega Menu grid rows so the icon, title, and description
 * within a single row become children of the title's <a> tag. This makes
 * the entire row one real, clickable link instead of separate widgets.
 */
/**
 * Restructure Max Mega Menu grid rows so the icon and description content
 * become children of the title's <a> tag — leaving one clean <li> per row.
 */
function restructureMegaMenuRows() {
	if ( ! header ) {
		return;
	}

	const megaRows = header.querySelectorAll( '.mega-menu-row' );

	megaRows.forEach( ( row ) => {
		if ( row.dataset.restructured === 'true' ) {
			return; // avoid double-processing
		}

		const link = row.querySelector( 'a.mega-menu-link' );
		if ( ! link ) {
			return;
		}

		// Move the actual <img> (not its <li>/<ul> wrappers) to the front of the link
		const iconEl = row.querySelector( '.widget_media_image img, .widget_media_image svg' );
		if ( iconEl ) {
			link.insertBefore( iconEl, link.firstChild );
		}

		// Move the actual description content (not its <li> wrapper) into the link
		// Wrap the title text + description together so they form one column
		// next to the icon, rather than three flat flex siblings
		const descEl = row.querySelector( '.widget_text .textwidget' );
		if ( descEl ) {
			const textWrap = document.createElement( 'span' );
			textWrap.className = 'mega-menu-text-wrap';

			// Move the link's existing text nodes into the wrapper
			Array.from( link.childNodes ).forEach( ( node ) => {
				if ( node !== iconEl ) {
					textWrap.appendChild( node );
				}
			} );

			link.appendChild( textWrap );
			textWrap.appendChild( descEl );
		}
		

		// Clean up now-empty leftover <li>/<ul> shells, deepest first,
		// but never touch anything that still contains the link itself
		Array.from( row.querySelectorAll( '.mega-menu-item, .mega-menu-column, ul' ) )
			.reverse()
			.forEach( ( el ) => {
				if ( el.contains( link ) || el === link ) {
					return;
				}
				if ( el.children.length === 0 && ! el.textContent.trim() ) {
					el.remove();
				}
			} );

		row.dataset.restructured = 'true';
	} );
}

restructureMegaMenuRows();