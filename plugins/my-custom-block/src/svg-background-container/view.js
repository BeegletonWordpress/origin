/**
 * Draw-in animation for the SVG Background Container's line shapes (opt-in,
 * via the is-draw-animated class, which index.js only adds for shapes marked
 * line: true in shapes.js). Same effect as My Handdrawn Card's border:
 * src/draw-in.js.
 */
import { setupDrawIn } from '../draw-in';

document.addEventListener( 'DOMContentLoaded', () => {
	setupDrawIn( {
		items: document.querySelectorAll(
			'.svg-background-container__bg.is-draw-animated'
		),
		getPaths: ( background ) => [ ...background.querySelectorAll( 'svg path' ) ],
	} );
} );
