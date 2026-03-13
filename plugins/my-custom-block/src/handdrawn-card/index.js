import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
} from '@wordpress/block-editor';
import metadata from './block.json';
import { HAND_DRAWN_CARD_SHAPE } from '../constants';
import '../index.css';
import './style.css';
import './editor.css';

const BLOCK_CLASSES =
	'relative flex flex-col w-full h-full !max-w-md min-h-[500px] flex-1 basis-[350px]';
const WRAPPER_CLASSES =
	'relative z-10 flex flex-col gap-4 p-10 justify-between flex-1 items-center';

const TEMPLATE = [
	[
		'core/group',
		{
			style: { spacing: { blockGap: '0rem' } },
			layout: {
				type: 'flex',
				orientation: 'vertical',
				justifyContent: 'center',
			},
		},
		[
			[
				'core/heading',
				{
					level: 3,
					placeholder: 'Card Header',
					content: 'Card Header',
				},
			],
			[
				'core/heading',
				{
					style: {
						spacing: { margin: { top: '0rem', bottom: '2rem' } },
						typography: { lineHeight: '1.5rem' },
					},
					level: 4,
					placeholder: 'Card Subheader',
					content: 'Card Subheader',
				},
			],
			[ 'core/paragraph', { placeholder: 'Add body text here...' } ],
		],
	],
	[ 'create-block/my-handdrawn-button', { text: 'Click Here' } ],
];

registerBlockType( metadata.name, {
	edit: function Edit( { attributes } ) {
		const { backgroundColor, style } = attributes;

		let customBgColor = style?.color?.background;
		if ( backgroundColor ) {
			customBgColor = `var(--wp--preset--color--${ backgroundColor })`;
		}

		const blockProps = useBlockProps( {
			className: BLOCK_CLASSES,
			style: {
				'--handdrawn-stroke-color':
					customBgColor || 'var(--wp--preset--color--primary, #000)',
			},
		} );

		const innerBlocksProps = useInnerBlocksProps(
			{ className: WRAPPER_CLASSES },
			{
				template: TEMPLATE,
				templateLock: 'all',
				allowedBlocks: [ 'create-block/my-handdrawn-button' ],
			}
		);

		return (
			<div { ...blockProps }>
				{ HAND_DRAWN_CARD_SHAPE }
				<div { ...innerBlocksProps } />
			</div>
		);
	},
	save: function save( { attributes } ) {
		const { backgroundColor, style } = attributes;

		let customBgColor = style?.color?.background;
		if ( backgroundColor ) {
			customBgColor = `var(--wp--preset--color--${ backgroundColor })`;
		}

		const blockProps = useBlockProps.save( {
			className: BLOCK_CLASSES,
			style: {
				'--handdrawn-stroke-color':
					customBgColor || 'var(--wp--preset--color--primary, #000)',
			},
		} );

		return (
			<div { ...blockProps }>
				{ HAND_DRAWN_CARD_SHAPE }
				<div className={ WRAPPER_CLASSES }>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
} );
