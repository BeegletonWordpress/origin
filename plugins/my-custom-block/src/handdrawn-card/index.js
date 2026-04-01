import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
} from "@wordpress/block-editor";
import { PanelBody, SelectControl } from "@wordpress/components";
import metadata from "./block.json";
import {
	HAND_DRAWN_CARD_SHAPE,
	HAND_DRAWN_CARD_SHAPE_2,
	HAND_DRAWN_CARD_SHAPE_3,
} from "../constants";
import { TEMPLATE_BUZZ, TEMPLATE_BUILD, TEMPLATE_BOOST } from "./templates";
import "../index.css";
import "./style.css";
import "./editor.css";

const BLOCK_CLASSES =
	"relative flex flex-col w-full h-full !max-w-md min-h-[500px] flex-1 basis-[350px]";
const WRAPPER_CLASSES =
	"relative z-10 flex flex-col gap-4 p-14 justify-between flex-1 items-center";

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { backgroundColor, style, cardLayout, cardShape } = attributes;

		let customBgColor = style?.color?.background;
		if (backgroundColor) {
			customBgColor = `var(--wp--preset--color--${backgroundColor})`;
		}

		let currentTemplate = TEMPLATE_BUZZ;
		if (cardLayout === "build") {
			currentTemplate = TEMPLATE_BUILD;
		} else if (cardLayout === "boost") {
			currentTemplate = TEMPLATE_BOOST;
		}

		let currentShape = HAND_DRAWN_CARD_SHAPE;
		if (cardShape === "shape2") {
			currentShape = HAND_DRAWN_CARD_SHAPE_2;
		} else if (cardShape === "shape3") {
			currentShape = HAND_DRAWN_CARD_SHAPE_3;
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
			{
				template: currentTemplate,
				templateLock: "all",
			},
		);

		return (
			<>
				<InspectorControls>
					<PanelBody title="Card Settings">
						<SelectControl
							label="Card Layout"
							value={cardLayout || "buzz"}
							options={[
								{ label: "Buzz", value: "buzz" },
								{ label: "Build", value: "build" },
								{ label: "Boost", value: "boost" },
							]}
							onChange={(newLayout) => setAttributes({ cardLayout: newLayout })}
						/>
						<SelectControl
							label="Card Shape"
							value={cardShape || "shape1"}
							options={[
								{ label: "Shape 1", value: "shape1" },
								{ label: "Shape 2", value: "shape2" },
								{ label: "Shape 3", value: "shape3" },
							]}
							onChange={(newShape) => setAttributes({ cardShape: newShape })}
						/>
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
					{currentShape}
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	},
	save: function save({ attributes }) {
		const { backgroundColor, style, cardShape } = attributes;

		let customBgColor = style?.color?.background;
		if (backgroundColor) {
			customBgColor = `var(--wp--preset--color--${backgroundColor})`;
		}

		let currentShape = HAND_DRAWN_CARD_SHAPE;
		if (cardShape === "shape2") {
			currentShape = HAND_DRAWN_CARD_SHAPE_2;
		} else if (cardShape === "shape3") {
			currentShape = HAND_DRAWN_CARD_SHAPE_3;
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
				{currentShape}
				<div className={WRAPPER_CLASSES}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
