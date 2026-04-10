import { registerBlockType } from "@wordpress/blocks";
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from "@wordpress/block-editor";
import metadata from "./block.json";
import { CURVY_ARROW_SHAPE_1 } from "../../constants";

const ALLOWED_BLOCKS = ["core/paragraph", "core/image", "core/heading"];

const TEMPLATE = [["core/paragraph", { placeholder: "Add some text..." }]];

const BLOCK_CLASSES = "flex items-center gap-0";

registerBlockType(metadata.name, {
	edit: function Edit() {
		const blockProps = useBlockProps({
			className: BLOCK_CLASSES,
		});

		const innerBlocksProps = useInnerBlocksProps(
			{},
			{
				allowedBlocks: ALLOWED_BLOCKS,
				template: TEMPLATE,
				templateLock: false,
			},
		);

		return (
			<div {...blockProps}>
				<div className="animated-arrow-svg-container -rotate-230 w-35 h-42">
					{CURVY_ARROW_SHAPE_1}
				</div>
				<div {...innerBlocksProps} />
			</div>
		);
	},
	save: function save() {
		const blockProps = useBlockProps.save({
			className: BLOCK_CLASSES,
		});

		return (
			<div {...blockProps}>
				<div className="animated-arrow-svg-container -rotate-230 w-35 h-42">
					{CURVY_ARROW_SHAPE_1}
				</div>
				<div>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
