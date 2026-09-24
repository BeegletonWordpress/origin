/**
 * Earlier saved versions of the Small Handdrawn Card. The block is now
 * dynamic (render.php draws the ring around the heading), so these only
 * let the editor recognise — and silently upgrade — content saved by the
 * old static save() functions. Keep them verbatim: any change to their
 * output makes those saved instances invalid again.
 */
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { cloneElement } from "@wordpress/element";
import { HAND_DRAWN_RING_SHAPE_4 } from "../constants";
import metadata from "./block.json";

const SUPPORTS = {
	color: {
		background: true,
		text: true,
		gradients: true,
	},
	spacing: {
		padding: true,
		margin: true,
	},
	align: ["left", "center", "right"],
	html: false,
	typography: {
		fontSize: true,
		lineHeight: true,
		__experimentalFontFamily: true,
		__experimentalFontWeight: true,
		__experimentalFontStyle: true,
		__experimentalTextTransform: true,
		__experimentalTextDecoration: true,
		__experimentalLetterSpacing: true,
		__experimentalDefaultControls: {
			fontSize: true,
		},
	},
};

const BLOCK_CLASSES = "relative z-10";

function strokeColor({ backgroundColor, style }) {
	let customBgColor = style?.color?.background;
	if (backgroundColor) {
		customBgColor = `var(--wp--preset--color--${backgroundColor})`;
	}
	return customBgColor || "var(--wp--preset--color--primary, #000)";
}

// The old per-card ring tuning was compensating for the ring surrounding
// the whole card; it's reset rather than carried over to the heading ring.
// Defaults are filled in explicitly: a migrated block doesn't get them
// applied automatically (v0 had no svgToggle, and its ring was always on).
function migrate({ cardWidth, cardHeight, offsetX, offsetY, ...attributes }) {
	return {
		svgToggle: true,
		ringWidth: metadata.attributes.ringWidth.default,
		ringHeight: metadata.attributes.ringHeight.default,
		ringOffsetX: metadata.attributes.ringOffsetX.default,
		ringOffsetY: metadata.attributes.ringOffsetY.default,
		...attributes,
	};
}

/**
 * v1: ring around the whole card, with width/height/offset controls
 * (HAND_DRAWN_RING_SHAPE_4). The save used up to this change.
 */
const v1 = {
	attributes: {
		style: { type: "object" },
		svgToggle: { type: "boolean", default: true },
		cardWidth: { type: "number", default: 100 },
		cardHeight: { type: "number", default: 100 },
		offsetX: { type: "number", default: 0 },
		offsetY: { type: "number", default: 0 },
	},
	supports: SUPPORTS,
	migrate,
	save({ attributes }) {
		const { cardWidth, cardHeight, offsetX, offsetY, svgToggle } = attributes;

		const blockProps = useBlockProps.save({
			className: BLOCK_CLASSES,
			style: {
				"--handdrawn-stroke-color": strokeColor(attributes),
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
				<div className="relative z-10 flex flex-col items-center gap-4 max-w-[360px] min-h-[200px]">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
};

/**
 * v0: the first version — a rotated ring shape around the whole card, no
 * controls. The SVG is reproduced exactly as it was saved (the shared
 * constant it came from has changed since).
 */
const v0 = {
	attributes: {
		style: { type: "object" },
	},
	supports: SUPPORTS,
	migrate,
	save({ attributes }) {
		const blockProps = useBlockProps.save({
			className: BLOCK_CLASSES,
			style: {
				"--handdrawn-stroke-color": strokeColor(attributes),
			},
		});

		return (
			<div {...blockProps}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 769.11 390.29"
					fill="none"
					preserveAspectRatio="none"
					className="absolute inset-0 w-full h-full z-0 -rotate-90 scale-y-125 scale-x-75"
				>
					<path
						d="M5,177.09c17.77-30.05,44.88-53.46,73.44-73.54C239.75-11.82,463.89-27.36,639.58,64.68c66.22,31.87,134.09,94.44,123.42,174.06-12.78,81.38-98.32,121.5-172.15,134.44-136.2,27.56-314.95,11.97-419.37-86.97-48.74-49.38-58.37-135.94,7.98-173.62"
						strokeWidth="8"
						strokeMiterlimit="10"
						strokeLinecap="round"
						vectorEffect="non-scaling-stroke"
					/>
				</svg>
				<div className="relative z-10 flex flex-col gap-4 p-8">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
};

export default [v1, v0];
