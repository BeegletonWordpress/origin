import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
} from "@wordpress/block-editor";
import metadata from "./block.json";
import { HAND_DRAWN_RING_SHAPE_2 } from "../constants";
import "../index.css";
import "./style.css";
import "./editor.css";

const BLOCK_CLASSES = "relative z-10";
const WRAPPER_CLASSES = "relative z-10 flex flex-col gap-4 p-8";

registerBlockType(metadata.name, {
	edit: function Edit({ attributes }) {
		const { backgroundColor, style } = attributes;

		let customBgColor = style?.color?.background;
		if (backgroundColor) {
			customBgColor = `var(--wp--preset--color--${backgroundColor})`;
		}

		const blockProps = useBlockProps({
			className: BLOCK_CLASSES,
			style: {
				"--handdrawn-stroke-color":
					customBgColor || "var(--wp--preset--color--primary, #000)",
			},
		});

		const innerBlocksProps = useInnerBlocksProps(
			{ className: WRAPPER_CLASSES },
			{},
		);

		return (
			<div {...blockProps}>
				{HAND_DRAWN_RING_SHAPE_2}
				<div {...innerBlocksProps} />
			</div>
		);
	},
	save: function save({ attributes }) {
		const { backgroundColor, style } = attributes;

		let customBgColor = style?.color?.background;
		if (backgroundColor) {
			customBgColor = `var(--wp--preset--color--${backgroundColor})`;
		}

		const blockProps = useBlockProps.save({
			className: BLOCK_CLASSES,
			style: {
				"--handdrawn-stroke-color":
					customBgColor || "var(--wp--preset--color--primary, #000)",
			},
		});

		return (
			<div {...blockProps}>
				{HAND_DRAWN_RING_SHAPE_2}
				<div className={WRAPPER_CLASSES}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
