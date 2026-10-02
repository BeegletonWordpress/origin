import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
	PanelColorSettings,
} from "@wordpress/block-editor";
import { PanelBody, SelectControl, ToggleControl } from "@wordpress/components";
import metadata from "./block.json";
import {
	HAND_DRAWN_CARD_SHAPE,
	HAND_DRAWN_CARD_SHAPE_2,
	HAND_DRAWN_CARD_SHAPE_3,
} from "../constants";
import {
	TEMPLATE_BUZZ,
	TEMPLATE_BUILD,
	TEMPLATE_BOOST,
	TEMPLATE_SMALL,
} from "./templates";import "./style.css";
import "./editor.css";

const BLOCK_CLASSES =
	"relative flex flex-col w-full h-full !max-w-md min-h-[500px] flex-1 basis-[350px]";
const WRAPPER_CLASSES_BASE = "relative z-10 flex p-14 flex-1";
const WRAPPER_CLASSES_DEFAULT = "flex-col gap-4 justify-between items-center";
const WRAPPER_CLASSES_SMALL =
	"flex-row flex-auto h-full justify-center min-h-[425px]";

// The draw-in class is only added when the animation is on, so cards
// without it keep their original save() output. view.js does the drawing.
const getBlockClasses = (drawAnimation) =>
	drawAnimation ? `${BLOCK_CLASSES} is-draw-animated` : BLOCK_CLASSES;

const getWrapperClasses = (cardLayout) =>
	`${WRAPPER_CLASSES_BASE} ${
		cardLayout === "small" ? WRAPPER_CLASSES_SMALL : WRAPPER_CLASSES_DEFAULT
	}`;

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const {
			backgroundColor,
			style,
			cardLayout,
			cardShape,
			drawAnimation,
			cardFill,
		} = attributes;

		let customBgColor = style?.color?.background;
		if (backgroundColor) {
			customBgColor = `var(--wp--preset--color--${backgroundColor})`;
		}

		let currentTemplate = TEMPLATE_BUZZ;
		if (cardLayout === "build") {
			currentTemplate = TEMPLATE_BUILD;
		} else if (cardLayout === "boost") {
			currentTemplate = TEMPLATE_BOOST;
		} else if (cardLayout === "small") {
			currentTemplate = TEMPLATE_SMALL;
		}

		let currentShape = HAND_DRAWN_CARD_SHAPE;
		if (cardShape === "shape2") {
			currentShape = HAND_DRAWN_CARD_SHAPE_2;
		} else if (cardShape === "shape3") {
			currentShape = HAND_DRAWN_CARD_SHAPE_3;
		}

		const blockProps = useBlockProps({
			className: getBlockClasses(drawAnimation),
			style: {
				"--handdrawn-stroke-color":
					customBgColor || "var(--wp--preset--color--primary, #000)",
				// Only set when a fill is picked, so cards without one keep
				// their original saved markup.
				"--handdrawn-fill": cardFill || undefined,
			},
		});

		const innerBlocksProps = useInnerBlocksProps(
			{
				className: cardLayout === "small" ? "" : getWrapperClasses(cardLayout),
				style:
					cardLayout === "small"
						? {
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-evenly",
						  }
						: {},
			},
			{
				template: currentTemplate,
				templateLock: false,
			},
		);

		return (
			<>
				<InspectorControls>
					<PanelBody title="Kortinställningar">
						<SelectControl
							label="Layout"
							value={cardLayout || "buzz"}
							options={[
								{ label: "Buzz", value: "buzz" },
								{ label: "Build", value: "build" },
								{ label: "Boost", value: "boost" },
								{ label: "Liten", value: "small" },
							]}
							onChange={(newLayout) => setAttributes({ cardLayout: newLayout })}
						/>
						<SelectControl
							label="Form"
							value={cardShape || "shape1"}
							options={[
								{ label: "Form 1", value: "shape1" },
								{ label: "Form 2", value: "shape2" },
								{ label: "Form 3", value: "shape3" },
							]}
							onChange={(newShape) => setAttributes({ cardShape: newShape })}
						/>
						<ToggleControl
							label="Ritanimation"
							help="Ritar fram ramen när kortet scrollas in i bild."
							checked={!!drawAnimation}
							onChange={(value) => setAttributes({ drawAnimation: value })}
						/>
					</PanelBody>
					<PanelColorSettings
						title="Kortets bakgrund"
						colorSettings={[
							{
								value: cardFill,
								onChange: (value) => setAttributes({ cardFill: value }),
								label: "Bakgrundsfärg",
							},
						]}
					>
						<p className="components-base-control__help">
							Fyller ytan innanför den handritade ramen. Ramens egen färg
							väljs under Stilar → Bakgrund.
						</p>
					</PanelColorSettings>
				</InspectorControls>
				<div {...blockProps}>
					{currentShape}
					{cardLayout === "small" ? (
						<div className={getWrapperClasses(cardLayout)}>
							<div {...innerBlocksProps} />
						</div>
					) : (
						<div {...innerBlocksProps} />
					)}
				</div>
			</>
		);
	},
	save: function save({ attributes }) {
		const {
			backgroundColor,
			style,
			cardLayout,
			cardShape,
			drawAnimation,
			cardFill,
		} = attributes;

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
			className: getBlockClasses(drawAnimation),
			style: {
				"--handdrawn-stroke-color":
					customBgColor || "var(--wp--preset--color--primary, #000)",
				// Only set when a fill is picked, so cards without one keep
				// their original saved markup.
				"--handdrawn-fill": cardFill || undefined,
			},
		});

		return (
			<div {...blockProps}>
				{currentShape}
				{cardLayout === "small" ? (
					<div className={getWrapperClasses(cardLayout)}>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-evenly",
							}}
						>
							<InnerBlocks.Content />
						</div>
					</div>
				) : (
					<div className={getWrapperClasses(cardLayout)}>
						<InnerBlocks.Content />
					</div>
				)}
			</div>
		);
	},
});
