import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks, useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import metadata from "./block.json";
import "./style.css";
import "./editor.css";

const ALLOWED_BLOCKS = ["create-block/my-count-up-numbers-item"];
const TEMPLATE = [
	["create-block/my-count-up-numbers-item"],
	["create-block/my-count-up-numbers-item"],
	["create-block/my-count-up-numbers-item"],
];

registerBlockType(metadata.name, {
	edit: function Edit() {
		const blockProps = useBlockProps({
			className: "count-up-numbers flex justify-center gap-8 flex-wrap py-10",
		});
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: ALLOWED_BLOCKS,
			template: TEMPLATE,
		});

		return <div {...innerBlocksProps} />;
	},
	save: function Save() {
		const blockProps = useBlockProps.save({
			className: "count-up-numbers flex justify-center gap-8 flex-wrap py-10",
		});
		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
