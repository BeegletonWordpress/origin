/**
 * Draw-in animation for My Handdrawn Card (opt-in per card, via the
 * is-draw-animated class): the border draws in when the card scrolls into
 * view, then style.css fades in the fill and the content. The animation
 * itself is the shared src/draw-in.js, also used by the SVG Background
 * Container's line shapes.
 */
import { setupDrawIn } from '../draw-in';

document.addEventListener( 'DOMContentLoaded', () => {
	setupDrawIn( {
		items: document.querySelectorAll(
			'.wp-block-create-block-my-handdrawn-card.is-draw-animated'
		),
		getPaths: ( card ) =>
			[ card.querySelector( ':scope > svg path' ) ].filter( Boolean ),
	} );
} );
