import { registerBlockType } from '@wordpress/blocks';
import {
	RichText,
	useBlockProps,
	__experimentalLinkControl as LinkControl,
	BlockControls,
	InspectorControls,
	ColorPalette,
} from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
	Popover,
	PanelBody,
	ToggleControl,
	TextControl,
} from '@wordpress/components';
import { link } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import metadata from './block.json';
import { HAND_DRAWN_BUTTON_SHAPE } from '../constants';
import '../index.css';
import './style.css';
import './editor.css';

registerBlockType( metadata.name, {
	edit: function Edit( { attributes, setAttributes } ) {
		const {
			text,
			url,
			linkTarget,
			rel,
			isSubmit,
			backgroundColor,
			hoverBackgroundColor,
			style,
		} = attributes;
		const [ isEditingURL, setIsEditingURL ] = useState( false );

		// Handle both palette colors (backgroundColor slug) and custom hex (style.color.background)
		let customBgColor = style?.color?.background;
		if ( backgroundColor ) {
			customBgColor = `var(--wp--preset--color--${ backgroundColor })`;
		}

		const blockProps = useBlockProps( {
			className:
				'relative inline-flex items-center justify-center font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer uppercase',
			style: {
				'--handdrawn-bg-color': customBgColor || undefined,
				'--handdrawn-hover-bg-color': hoverBackgroundColor || undefined,
			},
		} );

		const onLinkChange = ( newValues ) => {
			setAttributes( {
				url: newValues.url,
				linkTarget: newValues.opensInNewTab ? '_blank' : undefined,
				rel: newValues.opensInNewTab ? 'noopener' : undefined,
			} );
		};

		return (
			<>
				<BlockControls>
					{ ! isSubmit && (
						<ToolbarGroup>
							<ToolbarButton
								icon={ link }
								title="Link"
								onClick={ () =>
									setIsEditingURL( ! isEditingURL )
								}
								isActive={ !! url }
							/>
						</ToolbarGroup>
					) }
				</BlockControls>

				<InspectorControls>
					<PanelBody title="Button Settings">
						<ToggleControl
							label="Is Submit Button?"
							help="Use this for form submissions."
							checked={ isSubmit }
							onChange={ ( val ) =>
								setAttributes( {
									isSubmit: val,
									url: val ? undefined : url,
								} )
							}
						/>
						{ ! isSubmit && (
							<TextControl
								label="Button URL"
								value={ url || '' }
								onChange={ ( val ) =>
									setAttributes( { url: val } )
								}
								placeholder="https://..."
							/>
						) }
						{ ! isSubmit && url && (
							<ToggleControl
								label="Open in new tab"
								checked={ linkTarget === '_blank' }
								onChange={ ( val ) =>
									setAttributes( {
										linkTarget: val ? '_blank' : undefined,
										rel: val ? 'noopener' : undefined,
									} )
								}
							/>
						) }
					</PanelBody>
					<PanelBody title="Hover Colors">
						<p>Hover Background Color</p>
						<ColorPalette
							value={ hoverBackgroundColor }
							onChange={ ( val ) =>
								setAttributes( { hoverBackgroundColor: val } )
							}
						/>
					</PanelBody>
				</InspectorControls>

				{ isEditingURL && ! isSubmit && (
					<Popover
						onClose={ () => setIsEditingURL( false ) }
						anchor={ blockProps.ref }
					>
						<LinkControl
							className="wp-block-navigation-link__inline-link-control"
							value={ {
								url,
								opensInNewTab: linkTarget === '_blank',
							} }
							onChange={ onLinkChange }
						/>
					</Popover>
				) }

				<div { ...blockProps }>
					{ HAND_DRAWN_BUTTON_SHAPE }
					<div className="relative z-10">
						<RichText
							tagName="span"
							value={ text }
							onChange={ ( val ) =>
								setAttributes( { text: val } )
							}
							placeholder="Add text..."
							allowedFormats={ [] }
						/>
					</div>
				</div>
			</>
		);
	},
	save: function save( { attributes } ) {
		const {
			text,
			url,
			linkTarget,
			rel,
			isSubmit,
			backgroundColor,
			hoverBackgroundColor,
			style,
		} = attributes;

		let customBgColor = style?.color?.background;
		if ( backgroundColor ) {
			customBgColor = `var(--wp--preset--color--${ backgroundColor })`;
		}

		const blockProps = useBlockProps.save( {
			className:
				'relative inline-flex items-center justify-center font-bold transition-transform hover:scale-105 active:scale-95 uppercase',
			style: {
				'--handdrawn-bg-color': customBgColor || undefined,
				'--handdrawn-hover-bg-color': hoverBackgroundColor || undefined,
			},
		} );

		// Logic for dynamic tag selection
		const isLink = !! url && ! isSubmit;
		const Tag = isLink ? 'a' : 'button';
		const typeProps =
			Tag === 'button' ? { type: isSubmit ? 'submit' : 'button' } : {};

		return (
			<Tag
				{ ...blockProps }
				href={ isLink ? url : undefined }
				target={ isLink ? linkTarget : undefined }
				rel={ isLink ? rel : undefined }
				{ ...typeProps }
			>
				{ HAND_DRAWN_BUTTON_SHAPE }
				<div className="relative z-10">
					<RichText.Content tagName="span" value={ text } />
				</div>
			</Tag>
		);
	},
} );
