import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
} from "@wordpress/block-editor";
import metadata from "./block.json";

import "./style.css";

const ALLOWED_BLOCKS = ["create-block/my-small-handdrawn-card"];
const TEMPLATE = [
	["create-block/my-small-handdrawn-card"],
	["create-block/my-small-handdrawn-card"],
	["create-block/my-small-handdrawn-card"],
	["create-block/my-small-handdrawn-card"],
];
const CLASSES =
	"flex flex-col md:flex-row w-full justify-between items-center gap-4";

registerBlockType(metadata.name, {
	edit: () => {
		const blockProps = useBlockProps({
			className: CLASSES,
		});
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: ALLOWED_BLOCKS,
			template: TEMPLATE,
		});
		return <div {...innerBlocksProps} />;
	},
	save: () => {
		const blockProps = useBlockProps.save({
			className: CLASSES,
		});
		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
