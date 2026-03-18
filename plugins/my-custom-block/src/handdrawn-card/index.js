import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
} from "@wordpress/block-editor";
import { PanelBody, SelectControl } from "@wordpress/components";
import metadata from "./block.json";
import { HAND_DRAWN_CARD_SHAPE } from "../constants";
import { TEMPLATE_BUZZ, TEMPLATE_BUILD, TEMPLATE_BOOST } from "./templates";
import "../index.css";
import "./style.css";
import "./editor.css";

const BLOCK_CLASSES =
	"relative flex flex-col w-full h-full !max-w-md min-h-[500px] flex-1 basis-[350px]";
const WRAPPER_CLASSES =
	"relative z-10 flex flex-col gap-4 p-10 justify-between flex-1 items-center";

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { backgroundColor, style, cardLayout } = attributes;

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
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
					{HAND_DRAWN_CARD_SHAPE}
					<div {...innerBlocksProps} />
				</div>
			</>
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
				{HAND_DRAWN_CARD_SHAPE}
				<div className={WRAPPER_CLASSES}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
