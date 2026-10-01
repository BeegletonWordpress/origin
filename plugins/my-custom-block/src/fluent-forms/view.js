/**
 * Site-wide Fluent Forms styling: hand-drawn shapes for input fields,
 * textareas and checkboxes, which used to be pasted into every form's
 * custom JS. Styles are in ./style.css; the submit button's look is in
 * src/index.css. Uses the same marker classes as the old per-form code, so
 * forms that still have it don't get doubled shapes.
 */
import './style.css';

( function () {
	const SVG_NS = 'http://www.w3.org/2000/svg';

	const INPUT_SHAPE = [
		{
			d: 'M4.63046 50.1865C2.77531 50.1564 1.35755 49.3665 1.52346 48.4486C2.80547 41.0159 7.99386 11.2621 10.2713 3.28015C10.6182 2.08398 12.6091 1.18874 15.0374 1.15112C37.5858 0.797539 146.24 -0.54909 206.435 5.04055C208.908 5.26624 210.643 6.37965 210.492 7.62848L205.62 49.8479C205.469 51.1269 203.388 52.1425 200.824 52.1876C174.535 52.6239 28.8228 50.5401 4.63046 50.1865Z',
		},
	];

	// The focus ring around a focused field: the Knappar button blob, a
	// slightly different hand-drawn shape from the field's own outline.
	const FOCUS_RING_SHAPE = [
		{
			d: 'M5.62509 51.9341C3.76994 51.9041 2.35218 51.1141 2.51809 50.1963C3.8001 42.7635 8.98849 13.0098 11.266 5.02783C11.6129 3.83166 13.6037 2.93642 16.032 2.8988C38.5804 2.54522 147.235 1.19859 207.429 6.78823C209.903 7.01392 211.637 8.12734 211.487 9.37616L206.615 51.5956C206.464 52.8745 204.383 53.8901 201.819 53.9353C175.53 54.3716 29.8175 52.2877 5.62509 51.9341Z',
		},
	];

	const CHECKBOX_SHAPE = [
		{ d: 'M0.288678 11.8737C0.194324 18.6483 0.0944209 25.4229 6.75928e-05 32.1919C-0.0110328 33.0744 1.34876 33.0744 1.35986 32.1919C1.45422 25.4173 1.55412 18.6483 1.64847 11.8737C1.65958 10.9913 0.299778 10.9913 0.288678 11.8737Z', class: 'box-path' },
		{ d: 'M1.46519 12.4771C8.42513 12.8736 15.3851 13.2702 22.345 13.6723C23.2219 13.7225 23.2164 12.3542 22.345 12.304C15.3851 11.9074 8.42513 11.5109 1.46519 11.1088C0.588258 11.0585 0.593808 12.4268 1.46519 12.4771Z', class: 'box-path' },
		{ d: 'M20.3971 13.6216C20.4859 19.3407 20.5803 25.0653 20.6691 30.7843C20.6857 31.6612 22.0455 31.6667 22.0289 30.7843C21.9401 25.0653 21.8457 19.3407 21.7569 13.6216C21.7403 12.7448 20.3805 12.7392 20.3971 13.6216Z', class: 'box-path' },
		{ d: 'M13.2318 32.605C15.907 32.4653 18.5877 32.3313 21.2629 32.1917C22.1343 32.147 22.1399 30.7787 21.2629 30.8233C18.5877 30.963 15.907 31.097 13.2318 31.2366C12.3604 31.2813 12.3549 32.6496 13.2318 32.605Z', class: 'box-path' },
		{ d: 'M0.83791 5.57381C7.18178 16.1518 13.5201 26.7298 19.864 37.3077C20.3135 38.0617 21.4902 37.3748 21.0406 36.6152C14.6967 26.0372 8.35287 15.4592 2.01455 4.88127C1.56498 4.1273 0.388344 4.81425 0.83791 5.57381Z', class: 'check-path' },
		{ d: 'M18.4931 0.463318C13.9641 13.0296 9.44073 25.5958 4.91178 38.162C4.61207 38.9886 5.92746 39.346 6.22162 38.525C10.7506 25.9644 15.2795 13.3982 19.8029 0.831927C20.1027 0.00534854 18.7873 -0.352091 18.4931 0.468903V0.463318Z', class: 'check-path' },
	];

	// Appended as the last child, so it directly follows the input/checkbox
	// for the CSS "+" selectors (focus and checked states).
	function injectSVG( container, viewBox, paths, className ) {
		const svg = document.createElementNS( SVG_NS, 'svg' );
		svg.setAttribute( 'viewBox', viewBox );
		svg.setAttribute( 'fill', 'none' );
		svg.setAttribute( 'preserveAspectRatio', 'none' );
		svg.setAttribute( 'aria-hidden', 'true' );
		svg.classList.add( className );
		paths.forEach( ( p ) => {
			const path = document.createElementNS( SVG_NS, 'path' );
			path.setAttribute( 'd', p.d );
			if ( p.class ) {
				path.classList.add( p.class );
			}
			path.setAttribute( 'vector-effect', 'non-scaling-stroke' );
			svg.appendChild( path );
		} );
		container.appendChild( svg );
	}

	function applyHanddrawnStyles() {
		// Input fields and textareas.
		document
			.querySelectorAll(
				'.fluentform .ff-el-form-control:not(.handdrawn-input-applied)'
			)
			.forEach( ( input ) => {
				input.classList.add( 'handdrawn-input-applied' );
				const parent = input.parentElement;
				parent.classList.add( 'handdrawn-input-wrapper' );
				injectSVG( parent, '0 0 212 53', INPUT_SHAPE, 'handdrawn-input-shape' );
			} );

		// Hand-drawn focus rings, added after the shapes so the "input +
		// shape" selectors keep working. Own marker, so forms whose shapes
		// came from the old per-form JS get one too.
		document
			.querySelectorAll(
				'.fluentform .handdrawn-input-wrapper:not(.handdrawn-focus-applied)'
			)
			.forEach( ( wrapper ) => {
				wrapper.classList.add( 'handdrawn-focus-applied' );
				injectSVG( wrapper, '0 0 214 57', FOCUS_RING_SHAPE, 'handdrawn-focus-ring' );
			} );

		// Checkboxes (not the cookie banner's switches).
		document
			.querySelectorAll(
				'.fluentform input[type="checkbox"]:not(.handdrawn-checkbox-applied):not(.ch2-switch-value)'
			)
			.forEach( ( checkbox ) => {
				checkbox.classList.add( 'handdrawn-checkbox-applied' );
				const wrapper = document.createElement( 'div' );
				wrapper.className = 'handdrawn-checkbox-wrapper';
				checkbox.parentNode.insertBefore( wrapper, checkbox );
				wrapper.appendChild( checkbox );
				injectSVG( wrapper, '0 0 23 39', CHECKBOX_SHAPE, 'handdrawn-checkbox-shape' );
			} );

		document
			.querySelectorAll(
				'.fluentform .handdrawn-checkbox-wrapper:not(.handdrawn-focus-applied)'
			)
			.forEach( ( wrapper ) => {
				wrapper.classList.add( 'handdrawn-focus-applied' );
				injectSVG( wrapper, '0 0 212 53', INPUT_SHAPE, 'handdrawn-focus-ring' );
			} );
	}

	let errorId = 0;

	/**
	 * Ties Fluent Forms' validation messages to their fields (WCAG 3.3.1,
	 * 4.1.2): while a field group has an error, the message gets an id and
	 * role="alert" (so it's announced), and the field gets aria-invalid and
	 * aria-describedby pointing at it. Cleared again once the error is gone.
	 * Safe to run repeatedly.
	 */
	function linkErrors() {
		document.querySelectorAll( '.fluentform .ff-el-group' ).forEach( ( group ) => {
			const fields = group.querySelectorAll(
				'input:not([type="hidden"]), select, textarea'
			);
			const message = group.classList.contains( 'ff-el-is-error' )
				? group.querySelector( '.error' )
				: null;

			if ( message && message.textContent.trim() ) {
				if ( ! message.id ) {
					errorId += 1;
					message.id = `mcb-ff-error-${ errorId }`;
				}
				if ( message.getAttribute( 'role' ) !== 'alert' ) {
					message.setAttribute( 'role', 'alert' );
				}
				fields.forEach( ( field ) => {
					if ( field.getAttribute( 'aria-invalid' ) !== 'true' ) {
						field.setAttribute( 'aria-invalid', 'true' );
					}
					const describedBy = ( field.getAttribute( 'aria-describedby' ) || '' )
						.split( ' ' )
						.filter( Boolean );
					if ( ! describedBy.includes( message.id ) ) {
						describedBy.push( message.id );
						field.setAttribute( 'aria-describedby', describedBy.join( ' ' ) );
					}
					field.dataset.mcbErrorId = message.id;
				} );
				return;
			}

			// No error (any more): undo what we added.
			fields.forEach( ( field ) => {
				const id = field.dataset.mcbErrorId;
				if ( ! id ) {
					return;
				}
				field.removeAttribute( 'aria-invalid' );
				const describedBy = ( field.getAttribute( 'aria-describedby' ) || '' )
					.split( ' ' )
					.filter( ( value ) => value && value !== id );
				if ( describedBy.length ) {
					field.setAttribute( 'aria-describedby', describedBy.join( ' ' ) );
				} else {
					field.removeAttribute( 'aria-describedby' );
				}
				delete field.dataset.mcbErrorId;
			} );
		} );
	}

	function start() {
		// Error states are class changes on a form's field groups; watch
		// those only inside forms, not across the whole page.
		const errorObserver = new MutationObserver( linkErrors );
		const watchedForms = new WeakSet();
		const watchForms = () => {
			document.querySelectorAll( '.fluentform' ).forEach( ( form ) => {
				if ( watchedForms.has( form ) ) {
					return;
				}
				watchedForms.add( form );
				errorObserver.observe( form, {
					subtree: true,
					attributes: true,
					attributeFilter: [ 'class' ],
				} );
			} );
		};

		const update = () => {
			applyHanddrawnStyles();
			watchForms();
			linkErrors();
		};
		update();
		// Forms can render later (popups, AJAX), so keep watching for them.
		new MutationObserver( update ).observe( document.body, {
			childList: true,
			subtree: true,
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', start );
	} else {
		start();
	}
} )();
