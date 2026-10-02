import { registerBlockType } from "@wordpress/blocks";
import {
	InspectorControls,
	PanelColorSettings,
	useBlockProps,
	useInnerBlocksProps,
} from "@wordpress/block-editor";
import { PanelBody, SelectControl, ToggleControl } from "@wordpress/components";
import { cloneElement } from "@wordpress/element";
import metadata from "./block.json";
import deprecated from "./deprecated";
import { DEFAULT_SHAPE, SHAPES } from "./shapes";
import "./style.css";
import "./editor.css";

const TEMPLATE = [["core/paragraph", { placeholder: "Lägg till innehåll…" }]];

// The shape and the content share one grid cell (see style.css), so the
// container is as tall as the shape, or as the content if that is taller.
// `isolate` on the wrapper keeps the shape behind the content but in front
// of the page background.
// The is-shape-* class is only added for shapes other than the default,
// so containers using the original shape keep their saved markup.
const Background = ({ svgColor, showOnMobile, shape }) => {
	const shapeKey = SHAPES[shape] ? shape : DEFAULT_SHAPE;
	const shapeClass =
		shapeKey === DEFAULT_SHAPE ? "" : ` is-shape-${shapeKey}`;

	return (
		<div
			className={`svg-background-container__bg${shapeClass} ${
				showOnMobile ? "" : "hidden md:block"
			}`}
			aria-hidden="true"
		>
			{cloneElement(SHAPES[shapeKey].svg, { style: { color: svgColor } })}
		</div>
	);
};

const SHAPE_OPTIONS = Object.entries(SHAPES).map(([value, { label }]) => ({
	label,
	value,
}));

// The layout support's classes (content/wide widths, the Layout panel and
// the inner blocks' wide/full alignment) land on this element, since it is
// the one wrapping the inner blocks, both in the editor
// (useInnerBlocksProps) and on the frontend (WordPress's layout support
// targets the inner wrapper). Keep it the last element with a class before
// the inner blocks in save().
const CONTENT_CLASS = "svg-background-container__content";

registerBlockType(metadata.name, {
	deprecated,
	edit: ({ attributes, setAttributes }) => {
		const { svgColor, showOnMobile, shape } = attributes;

		const blockProps = useBlockProps({ className: "relative isolate" });
		const innerBlocksProps = useInnerBlocksProps(
			{ className: CONTENT_CLASS },
			{ template: TEMPLATE },
		);

		return (
			<>
				<InspectorControls>
					<PanelBody title="Background">
						<SelectControl
							label="Shape"
							value={shape}
							options={SHAPE_OPTIONS}
							onChange={(value) => setAttributes({ shape: value })}
						/>
						<ToggleControl
							label="Show on mobile"
							help="The Team Gallery hides this shape below 768px."
							checked={showOnMobile}
							onChange={(value) => setAttributes({ showOnMobile: value })}
						/>
					</PanelBody>
					<PanelColorSettings
						title="SVG Color"
						colorSettings={[
							{
								value: svgColor,
								onChange: (value) => setAttributes({ svgColor: value }),
								label: "Background SVG Color",
							},
						]}
					/>
				</InspectorControls>
				<div {...blockProps}>
					<Background
						svgColor={svgColor}
						showOnMobile={showOnMobile}
						shape={shape}
					/>
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const { svgColor, showOnMobile, shape } = attributes;

		const blockProps = useBlockProps.save({ className: "relative isolate" });
		const innerBlocksProps = useInnerBlocksProps.save({
			className: CONTENT_CLASS,
		});

		return (
			<div {...blockProps}>
				<Background
						svgColor={svgColor}
						showOnMobile={showOnMobile}
						shape={shape}
					/>
				<div {...innerBlocksProps} />
			</div>
		);
	},
});
