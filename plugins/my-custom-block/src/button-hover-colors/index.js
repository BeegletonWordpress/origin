import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect, useRef } from '@wordpress/element';
import {
	InspectorControls,
	PanelColorSettings,
	useSetting,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

// Default button colours (palette slugs), the same as the theme.json
// defaults in my-custom-block.php (mcb_default_button_colors).
const DEFAULT_BACKGROUND = 'accent-1';
const DEFAULT_TEXT = 'contrast';

// Default hover colours (palette slugs), matching the fallbacks in
// src/index.css.
const DEFAULT_HOVER_BACKGROUND = 'accent-6';
const DEFAULT_HOVER_TEXT = 'contrast';

/**
 * Adds hoverBackgroundColor / hoverTextColor attributes to core/button only.
 */
addFilter(
	'blocks.registerBlockType',
	'my-custom-block/button-hover-color-attributes',
	( settings, name ) => {
		if ( name !== 'core/button' ) {
			return settings;
		}
		return {
			...settings,
			attributes: {
				...settings.attributes,
				hoverBackgroundColor: { type: 'string' },
				hoverTextColor: { type: 'string' },
			},
		};
	}
);

/**
 * Adds a "Hover Colors" panel to core/button's Inspector Controls, using
 * the same PanelColorSettings component and theme color palette as WP's
 * own Text/Background color controls.
 */
const isOutline = ( className ) =>
	( className || '' ).split( ' ' ).includes( 'is-style-outline' );

/**
 * Fills in the default colours (Accent 1 background, Contrast text) on a
 * button that has none, the first time it's selected, so the Colour panel
 * shows them instead of empty swatches. New buttons are selected as soon as
 * they're inserted, so they get them right away. Not done as attribute
 * defaults: those would change the saved markup of every existing button
 * and make it fail validation. Outline buttons only get the text colour
 * (a background would fill them in), and switching a button to Outline
 * drops the default background again.
 */
function ButtonColorDefaults( { attributes, setAttributes, isSelected } ) {
	const applied = useRef( false );
	const { backgroundColor, textColor, gradient, style, className } = attributes;
	const outline = isOutline( className );

	useEffect( () => {
		if ( ! isSelected || applied.current ) {
			return;
		}
		applied.current = true;

		const updates = {};
		const hasBackground =
			backgroundColor || gradient || style?.color?.background || style?.color?.gradient;
		if ( ! textColor && ! style?.color?.text ) {
			updates.textColor = DEFAULT_TEXT;
		}
		if ( ! hasBackground && ! outline ) {
			updates.backgroundColor = DEFAULT_BACKGROUND;
		}
		if ( Object.keys( updates ).length ) {
			setAttributes( updates );
		}
	}, [ isSelected ] );

	useEffect( () => {
		if ( outline && backgroundColor === DEFAULT_BACKGROUND ) {
			setAttributes( { backgroundColor: undefined } );
		}
	}, [ outline ] );

	return null;
}

const withHoverColorControls = createHigherOrderComponent( ( BlockEdit ) => ( props ) => {
	if ( props.name !== 'core/button' ) {
		return <BlockEdit { ...props } />;
	}

	const { attributes, setAttributes } = props;
	const { hoverBackgroundColor, hoverTextColor } = attributes;
	const colors = useSetting( 'color.palette' ) || [];

	// Shown when no hover colour is picked: the same defaults src/index.css
	// falls back to (Accent 6 background, Contrast text). Not stored, so
	// buttons only save hover colours someone actually chose.
	const paletteColor = ( slug ) =>
		colors.find( ( color ) => color.slug === slug )?.color;
	const defaultHoverBackground = paletteColor( DEFAULT_HOVER_BACKGROUND );
	const defaultHoverText = paletteColor( DEFAULT_HOVER_TEXT );

	return (
		<>
			<ButtonColorDefaults
				attributes={ attributes }
				setAttributes={ setAttributes }
				isSelected={ props.isSelected }
			/>
			<BlockEdit { ...props } />
			<InspectorControls>
				<PanelColorSettings
					title={ __( 'Hover Colors', 'my-custom-block' ) }
					initialOpen={ false }
					colorSettings={ [
						{
							value: hoverBackgroundColor || defaultHoverBackground,
							onChange: ( value ) =>
								setAttributes( { hoverBackgroundColor: value } ),
							label: __( 'Hover Background Color', 'my-custom-block' ),
							colors,
						},
						{
							value: hoverTextColor || defaultHoverText,
							onChange: ( value ) =>
								setAttributes( { hoverTextColor: value } ),
							label: __( 'Hover Text Color', 'my-custom-block' ),
							colors,
						},
					] }
				/>
			</InspectorControls>
		</>
	);
}, 'withHoverColorControls' );

addFilter( 'editor.BlockEdit', 'my-custom-block/button-hover-color-controls', withHoverColorControls );

/**
 * Bakes the picked colors into CSS custom properties + a marker class on
 * core/button's saved root element (the <a>/<button> link itself, per its
 * block.json "selectors.root") so a plain CSS :hover rule in src/index.css
 * can read them on the frontend. Buttons with neither color set are left
 * completely untouched.
 */
function addHoverColorSaveProps( extraProps, blockType, attributes ) {
	if ( blockType.name !== 'core/button' ) {
		return extraProps;
	}

	const { hoverBackgroundColor, hoverTextColor } = attributes;
	if ( ! hoverBackgroundColor && ! hoverTextColor ) {
		return extraProps;
	}

	const style = { ...( extraProps.style || {} ) };
	if ( hoverBackgroundColor ) {
		style[ '--mcb-hover-bg' ] = hoverBackgroundColor;
	}
	if ( hoverTextColor ) {
		style[ '--mcb-hover-text' ] = hoverTextColor;
	}

	return {
		...extraProps,
		className: extraProps.className
			? `${ extraProps.className } has-mcb-hover`
			: 'has-mcb-hover',
		style,
	};
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'my-custom-block/button-hover-color-save-props',
	addHoverColorSaveProps
);

/**
 * Mirrors the same class + custom properties onto the block's canvas
 * wrapper in the editor, so the hover preview matches the frontend. This
 * wraps the OUTER block wrapper (not the inner link that extraProps
 * above targets), so src/index.css matches both placements.
 */
const withHoverColorEditorProps = createHigherOrderComponent(
	( BlockListBlock ) => ( props ) => {
		if ( props.name !== 'core/button' ) {
			return <BlockListBlock { ...props } />;
		}

		const { hoverBackgroundColor, hoverTextColor } = props.attributes;
		if ( ! hoverBackgroundColor && ! hoverTextColor ) {
			return <BlockListBlock { ...props } />;
		}

		const style = { ...( props.wrapperProps?.style || {} ) };
		if ( hoverBackgroundColor ) {
			style[ '--mcb-hover-bg' ] = hoverBackgroundColor;
		}
		if ( hoverTextColor ) {
			style[ '--mcb-hover-text' ] = hoverTextColor;
		}

		return (
			<BlockListBlock
				{ ...props }
				wrapperProps={ {
					...props.wrapperProps,
					style,
					className: 'has-mcb-hover',
				} }
			/>
		);
	},
	'withHoverColorEditorProps'
);

addFilter(
	'editor.BlockListBlock',
	'my-custom-block/button-hover-color-editor-props',
	withHoverColorEditorProps
);
