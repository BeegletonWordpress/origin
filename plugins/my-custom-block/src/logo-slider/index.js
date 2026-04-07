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

const BLOCK_CLASSES =
	"flex flex-row flex-wrap gap-8 items-center justify-center w-auto py-12 mt-0!";
const ALLOWED_BLOCKS = ["create-block/my-logo-slider-item"];
const TEMPLATE = [
	["create-block/my-logo-slider-item"],
	["create-block/my-logo-slider-item"],
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
		const blockProps = useBlockProps.save({ className: BLOCK_CLASSES });
		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
