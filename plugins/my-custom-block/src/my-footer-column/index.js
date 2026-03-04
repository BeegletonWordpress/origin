import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

const BLOCK_CLASSES = "flex flex-col gap-4 flex-1";
const ALLOWED_BLOCKS = ["core/paragraph", "core/list"];
const TEMPLATE = [
	["core/paragraph", { placeholder: "A column heading" }],
	["core/list"],
];

registerBlockType( metadata.name, {
	edit: function Edit() {
		const blockProps = useBlockProps();
		const innerBlocksProps = useInnerBlocksProps(
			{ className: BLOCK_CLASSES },
			{ 
				allowedBlocks: ALLOWED_BLOCKS, 
				template: TEMPLATE 
			}
		);

		return (
			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		);
	},
	save: function save() {
		return (
			<div
				{...useBlockProps.save({
					className: BLOCK_CLASSES,
				})}
			>
				<InnerBlocks.Content />
			</div>
		);
	},
} );
