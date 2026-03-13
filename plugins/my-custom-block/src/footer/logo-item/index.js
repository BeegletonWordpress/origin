import { registerBlockType } from '@wordpress/blocks';
import {
	MediaPlaceholder,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import metadata from './block.json';
import '../../index.css';
import './style.css';
import './editor.css';

const LOGO_CLASSES =
	'h-auto w-16 object-contain grayscale hover:grayscale-0 transition-all';

registerBlockType( metadata.name, {
	edit: function Edit( { attributes, setAttributes } ) {
		const { mediaUrl, mediaId, linkUrl } = attributes;
		const blockProps = useBlockProps();

		return (
			<>
				<InspectorControls>
					<PanelBody title="Logo Settings">
						<TextControl
							label="Link URL"
							value={ linkUrl }
							onChange={ ( val ) =>
								setAttributes( { linkUrl: val } )
							}
							help="Add a link to the logo (e.g., https://beegleton.com)"
						/>
					</PanelBody>
				</InspectorControls>

				<div { ...blockProps }>
					{ ! mediaUrl ? (
						<MediaPlaceholder
							onSelect={ ( media ) =>
								setAttributes( {
									mediaUrl: media.url,
									mediaId: media.id,
								} )
							}
							allowedTypes={ [ 'image' ] }
							multiple={ false }
							labels={ { title: 'Select Logo' } }
						/>
					) : (
						<img
							src={ mediaUrl }
							className={ LOGO_CLASSES }
							alt=""
						/>
					) }
				</div>
			</>
		);
	},
	save: function save( { attributes } ) {
		const { mediaUrl, linkUrl } = attributes;
		const blockProps = useBlockProps.save();

		if ( ! mediaUrl ) return null;

		const logoImage = (
			<img src={ mediaUrl } className={ LOGO_CLASSES } alt="" />
		);

		return (
			<div { ...blockProps }>
				{ linkUrl ? (
					<a
						href={ linkUrl }
						target="_blank"
						rel="noopener noreferrer"
					>
						{ logoImage }
					</a>
				) : (
					logoImage
				) }
			</div>
		);
	},
} );
