import { registerBlockType } from "@wordpress/blocks";
import {
	InspectorControls,
	PanelColorSettings,
	useBlockProps,
	useInnerBlocksProps,
} from "@wordpress/block-editor";
import { PanelBody, ToggleControl } from "@wordpress/components";
import { cloneElement } from "@wordpress/element";
import metadata from "./block.json";
import deprecated from "./deprecated";
import { TEAM_BACKGROUND_SVG } from "../constants";
import "./style.css";
import "./editor.css";

const TEMPLATE = [["core/paragraph", { placeholder: "Lägg till innehåll…" }]];

// The shape and the content share one grid cell (see style.css), so the
// container is as tall as the shape, or as the content if that is taller.
// `isolate` on the wrapper keeps the shape behind the content but in front
// of the page background.
const Background = ({ svgColor, showOnMobile }) => (
	<div
		className={`svg-background-container__bg ${
			showOnMobile ? "" : "hidden md:block"
		}`}
		aria-hidden="true"
	>
		{cloneElement(TEAM_BACKGROUND_SVG, { style: { color: svgColor } })}
	</div>
);

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
		const { svgColor, showOnMobile } = attributes;

		const blockProps = useBlockProps({ className: "relative isolate" });
		const innerBlocksProps = useInnerBlocksProps(
			{ className: CONTENT_CLASS },
			{ template: TEMPLATE },
		);

		return (
			<>
				<InspectorControls>
					<PanelBody title="Background">
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
					<Background svgColor={svgColor} showOnMobile={showOnMobile} />
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const { svgColor, showOnMobile } = attributes;

		const blockProps = useBlockProps.save({ className: "relative isolate" });
		const innerBlocksProps = useInnerBlocksProps.save({
			className: CONTENT_CLASS,
		});

		return (
			<div {...blockProps}>
				<Background svgColor={svgColor} showOnMobile={showOnMobile} />
				<div {...innerBlocksProps} />
			</div>
		);
	},
});
