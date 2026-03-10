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
	"flex flex-col gap-4 flex-auto min-w-48 [&_h2]:text-center";
const ALLOWED_BLOCKS = [
	"core/paragraph",
	"core/list",
	"core/heading",
	"core/html",
	"core/social-links",
];
const TEMPLATE = [
	["core/paragraph", { placeholder: "A column heading" }],
	["core/list"],
];

registerBlockType(metadata.name, {
	edit: function Edit() {
		const blockProps = useBlockProps();
		const innerBlocksProps = useInnerBlocksProps(
			{ className: BLOCK_CLASSES },
			{
				allowedBlocks: ALLOWED_BLOCKS,
				template: TEMPLATE,
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
