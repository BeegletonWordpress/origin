import { registerBlockType } from '@wordpress/blocks';
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import metadata from './block.json';
import '../../index.css';
import './style.css';
import './editor.css';

const BLOCK_CLASSES = 'flex flex-col gap-8 p-8 pb-0';
const ALLOWED_BLOCKS = [ 'create-block/my-footer-row' ];
const TEMPLATE = [ [ 'create-block/my-footer-row' ] ];

registerBlockType( metadata.name, {
	edit: function Edit() {
		const blockProps = useBlockProps();
		const innerBlocksProps = useInnerBlocksProps(
			{ className: BLOCK_CLASSES },
			{
				allowedBlocks: ALLOWED_BLOCKS,
				template: TEMPLATE,
				orientation: 'vertical',
			}
		);

		return (
			<div { ...blockProps }>
				<div { ...innerBlocksProps } />
			</div>
		);
	},
	save: function save() {
		return (
			<div
				{ ...useBlockProps.save( {
					className: BLOCK_CLASSES,
				} ) }
			>
				<InnerBlocks.Content />
			</div>
		);
	},
} );
