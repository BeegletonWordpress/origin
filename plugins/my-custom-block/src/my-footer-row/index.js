import { registerBlockType } from "@wordpress/blocks";
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from "@wordpress/block-editor";
import metadata from "./block.json";
import "../index.css";
import "./style.css";
import "./editor.css";

const BLOCK_CLASSES = "flex flex-col md:flex-row gap-8 w-full";
const ALLOWED_BLOCKS = ["create-block/my-footer-column"];
const TEMPLATE = [
	["create-block/my-footer-column"],
	["create-block/my-footer-column"],
	["create-block/my-footer-column"],
];

registerBlockType(metadata.name, {
	edit: function Edit() {
		const blockProps = useBlockProps();
		const innerBlocksProps = useInnerBlocksProps(
			{ className: BLOCK_CLASSES },
			{
				allowedBlocks: ALLOWED_BLOCKS,
				template: TEMPLATE,
				orientation: "horizontal",
			},
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
});
