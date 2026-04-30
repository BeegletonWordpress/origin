import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
} from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	CheckboxControl,
} from "@wordpress/components";
import { cloneElement } from "@wordpress/element";
import metadata from "./block.json";
import { HAND_DRAWN_RING_SHAPE_4 } from "../constants";
import "../index.css";
import "./style.css";
import "./editor.css";

const BLOCK_CLASSES = "relative z-10";
const WRAPPER_CLASSES =
	"relative z-10 flex flex-col gap-4 max-w-[360px] min-h-[200px]";
const INNER_TEMPLATE = [
	[
		"core/heading",
		{
			level: 4,
			placeholder: "Heading...",
		},
	],
	["core/paragraph", { placeholder: "Add content..." }],
];

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const {
			backgroundColor,
			style,
			cardWidth,
			cardHeight,
			offsetX,
			offsetY,
			svgToggle,
		} = attributes;

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
			{ template: INNER_TEMPLATE },
		);

		// Calculate transform: scale based on percentage and translate based on rem offsets
		const svgStyle = {
			transform: `scale(${(cardWidth ?? 100) / 100}, ${
				(cardHeight ?? 100) / 100
			}) translate(${offsetX - 2 ?? -2}rem, ${offsetY - 1 ?? -1}rem)`,
			transformOrigin: "center",
			display: svgToggle ? "block" : "none",
		};

		// Clone the SVG element constant and merge inline styles so we apply transforms directly to the SVG
		const styledSvg = cloneElement(HAND_DRAWN_RING_SHAPE_4, {
			style: {
				...(HAND_DRAWN_RING_SHAPE_4.props?.style || {}),
				...svgStyle,
			},
		});

		return (
			<>
				<InspectorControls>
					<PanelBody title="SVG Visibility" initialOpen={false}>
						<CheckboxControl
							label="Show SVG"
							checked={svgToggle}
							onChange={(value) => setAttributes({ svgToggle: value })}
						/>
					</PanelBody>
					<PanelBody title="SVG Size & Position" initialOpen={false}>
						<RangeControl
							label="Width (%)"
							value={cardWidth}
							onChange={(value) => setAttributes({ cardWidth: value })}
							min={50}
							max={200}
							step={5}
							help="Scale the card width relative to content (100% = default)"
						/>
						<RangeControl
							label="Height (%)"
							value={cardHeight}
							onChange={(value) => setAttributes({ cardHeight: value })}
							min={50}
							max={200}
							step={5}
							help="Scale the card height relative to content (100% = default)"
						/>
						<RangeControl
							label="Offset X (rem)"
							value={offsetX}
							onChange={(value) => setAttributes({ offsetX: value })}
							min={-5}
							max={5}
							step={0.1}
							help="Move the card left (negative) or right (positive)"
						/>
						<RangeControl
							label="Offset Y (rem)"
							value={offsetY}
							onChange={(value) => setAttributes({ offsetY: value })}
							min={-5}
							max={5}
							step={0.1}
							help="Move the card up (negative) or down (positive)"
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					{styledSvg}
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	},
	save: function save({ attributes }) {
		const {
			backgroundColor,
			style,
			cardWidth,
			cardHeight,
			offsetX,
			offsetY,
			svgToggle,
		} = attributes;

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

		const svgStyle = {
			transform: `scale(${(cardWidth ?? 100) / 100}, ${
				(cardHeight ?? 100) / 100
			}) translate(${offsetX - 2 ?? -2}rem, ${offsetY - 1 ?? -1}rem)`,
			transformOrigin: "center",
			display: svgToggle ? "block" : "none",
		};

		const styledSvgSave = cloneElement(HAND_DRAWN_RING_SHAPE_4, {
			style: {
				...(HAND_DRAWN_RING_SHAPE_4.props?.style || {}),
				...svgStyle,
			},
		});

		return (
			<div {...blockProps}>
				{styledSvgSave}
				<div className={WRAPPER_CLASSES}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
