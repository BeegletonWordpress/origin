import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	InspectorControls,
	PanelColorSettings,
	useSetting,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

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
const withHoverColorControls = createHigherOrderComponent( ( BlockEdit ) => ( props ) => {
	if ( props.name !== 'core/button' ) {
		return <BlockEdit { ...props } />;
	}

	const { attributes, setAttributes } = props;
	const { hoverBackgroundColor, hoverTextColor } = attributes;
	const colors = useSetting( 'color.palette' ) || [];

	return (
		<>
			<BlockEdit { ...props } />
			<InspectorControls>
				<PanelColorSettings
					title={ __( 'Hover Colors', 'my-custom-block' ) }
					initialOpen={ false }
					colorSettings={ [
						{
							value: hoverBackgroundColor,
							onChange: ( value ) =>
								setAttributes( { hoverBackgroundColor: value } ),
							label: __( 'Hover Background Color', 'my-custom-block' ),
							colors,
						},
						{
							value: hoverTextColor,
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
