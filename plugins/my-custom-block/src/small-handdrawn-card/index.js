import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
} from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	CheckboxControl,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import {
	cloneElement,
	useLayoutEffect,
	useRef,
	useState,
} from "@wordpress/element";
import metadata from "./block.json";
import deprecated from "./deprecated";
import { HAND_DRAWN_RING_SHAPE_4 } from "../constants";import "./style.css";
import "./editor.css";

const BLOCK_CLASSES = "relative z-10";
const WRAPPER_CLASSES =
	"relative z-10 flex flex-col items-center gap-4 max-w-[360px] min-h-[200px]";
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

const RING_DEFAULTS = {
	ringWidth: metadata.attributes.ringWidth.default,
	ringHeight: metadata.attributes.ringHeight.default,
	ringOffsetX: metadata.attributes.ringOffsetX.default,
	ringOffsetY: metadata.attributes.ringOffsetY.default,
};

// Keep in sync with render.php, which builds the same ring on the frontend.
function ringStyle({ ringWidth, ringHeight, ringOffsetX, ringOffsetY, svgToggle }) {
	return {
		transform: `translate(${ringOffsetX ?? RING_DEFAULTS.ringOffsetX}rem, ${
			ringOffsetY ?? RING_DEFAULTS.ringOffsetY
		}rem) scale(${(ringWidth ?? RING_DEFAULTS.ringWidth) / 100}, ${
			(ringHeight ?? RING_DEFAULTS.ringHeight) / 100
		})`,
		// Missing means on, matching render.php's `?? true`.
		display: svgToggle === false ? "none" : "block",
	};
}

/**
 * The frontend (render.php) wraps the card's first Heading block in a
 * positioned box holding the ring. Inner blocks can't be wrapped in the
 * editor, so here the ring sits in an absolutely positioned box that is
 * measured to match that heading exactly — the ring's own CSS is the same
 * in both, so it lands in the same place.
 */
function useHeadingBox(clientId, cardRef) {
	const headingId = useSelect(
		(select) =>
			select(blockEditorStore)
				.getBlocks(clientId)
				.find((block) => block.name === "core/heading")?.clientId,
		[clientId],
	);
	const [box, setBox] = useState(null);

	useLayoutEffect(() => {
		const card = cardRef.current;
		if (!card || !headingId) {
			setBox(null);
			return;
		}
		const doc = card.ownerDocument;
		const win = doc.defaultView;
		let observed = null;
		let frame = 0;

		const measure = () => {
			const heading = doc.getElementById(`block-${headingId}`);
			if (!heading) {
				setBox(null);
				frame = win.requestAnimationFrame(measure);
				return;
			}
			if (observed !== heading) {
				observed && observer.unobserve(observed);
				observer.observe(heading);
				observed = heading;
			}
			const c = card.getBoundingClientRect();
			const h = heading.getBoundingClientRect();
			setBox({
				left: h.left - c.left - card.clientLeft,
				top: h.top - c.top - card.clientTop,
				width: h.width,
				height: h.height,
			});
		};

		const observer = new win.ResizeObserver(measure);
		observer.observe(card);
		measure();

		return () => {
			win.cancelAnimationFrame(frame);
			observer.disconnect();
		};
	}, [headingId]);

	return box;
}

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes, clientId }) {
		const {
			backgroundColor,
			style,
			ringWidth,
			ringHeight,
			ringOffsetX,
			ringOffsetY,
			svgToggle,
		} = attributes;

		let customBgColor = style?.color?.background;
		if (backgroundColor) {
			customBgColor = `var(--wp--preset--color--${backgroundColor})`;
		}

		const cardRef = useRef();
		const blockProps = useBlockProps({
			ref: cardRef,
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

		const headingBox = useHeadingBox(clientId, cardRef);

		const ring = cloneElement(HAND_DRAWN_RING_SHAPE_4, {
			className: "small-handdrawn-card__ring",
			style: ringStyle(attributes),
		});

		return (
			<>
				<InspectorControls>
					<PanelBody title="SVG Visibility" initialOpen={false}>
						<CheckboxControl
							label="Show SVG"
							checked={svgToggle !== false}
							onChange={(value) => setAttributes({ svgToggle: value })}
						/>
					</PanelBody>
					<PanelBody title="Ring Size & Position" initialOpen={false}>
						<RangeControl
							label="Width (%)"
							value={ringWidth}
							onChange={(value) => setAttributes({ ringWidth: value })}
							min={50}
							max={200}
							step={5}
							help="Scale the ring's width around the heading (100% = default)"
						/>
						<RangeControl
							label="Height (%)"
							value={ringHeight}
							onChange={(value) => setAttributes({ ringHeight: value })}
							min={50}
							max={200}
							step={5}
							help="Scale the ring's height around the heading (100% = default)"
						/>
						<RangeControl
							label="Offset X (rem)"
							value={ringOffsetX}
							onChange={(value) => setAttributes({ ringOffsetX: value })}
							min={-3}
							max={3}
							step={0.1}
							help="Move the ring left (negative) or right (positive)"
						/>
						<RangeControl
							label="Offset Y (rem)"
							value={ringOffsetY}
							onChange={(value) => setAttributes({ ringOffsetY: value })}
							min={-3}
							max={3}
							step={0.1}
							help="Move the ring up (negative) or down (positive)"
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					{headingBox && (
						<div
							className="small-handdrawn-card__heading-anchor"
							style={headingBox}
							aria-hidden="true"
						>
							{ring}
						</div>
					)}
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	},
	// Dynamic block: render.php builds the markup (and the ring around the
	// first Heading block), so only the inner blocks are saved.
	save: () => <InnerBlocks.Content />,
	deprecated,
});
