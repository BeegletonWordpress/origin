const header = document.querySelector(
	'.wp-block-create-block-my-header-block'
);

if ( header ) {
	// Scroll distance (px) over which the logo/header morph from their
	// top-of-page state to the scrolled state. style.css reads the
	// resulting 0–1 value from --header-progress, so the animation follows
	// the scroll position instead of playing on a timer.
	const PROGRESS_RANGE = 100;
	const reducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	);

	// Natural (unscrolled) header height, which the CSS interpolates
	// from down to the 70px scrolled height.
	const measureHeight = () => {
		header.style.height = 'auto';
		header.style.setProperty(
			'--header-h0',
			`${ header.offsetHeight }px`
		);
		header.style.removeProperty( 'height' );
	};

	const update = () => {
		const scrollY = window.scrollY;
		const isScrolled = header.classList.contains( 'is-scrolled' );

		let progress = Math.min( Math.max( scrollY / PROGRESS_RANGE, 0 ), 1 );
		if ( reducedMotion.matches ) {
			progress = scrollY > 80 ? 1 : 0;
		}
		header.style.setProperty( '--header-progress', progress.toFixed( 3 ) );

		// Use hysteresis with a larger gap to prevent flashing.
		// Add at 80px, remove at 30px.
		if ( ! isScrolled && scrollY > 80 ) {
			header.classList.add( 'is-scrolled' );
		} else if ( isScrolled && scrollY < 30 ) {
			header.classList.remove( 'is-scrolled' );
		}
	};

	let ticking = false;
	const requestUpdate = () => {
		if ( ticking ) {
			return;
		}
		ticking = true;
		requestAnimationFrame( () => {
			ticking = false;
			update();
		} );
	};

	measureHeight();
	header.classList.add( 'has-scroll-progress' );
	update();

	window.addEventListener( 'scroll', requestUpdate, { passive: true } );
	window.addEventListener( 'resize', () => {
		measureHeight();
		requestUpdate();
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