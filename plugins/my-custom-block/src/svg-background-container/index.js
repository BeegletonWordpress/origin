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
import { TEAM_BACKGROUND_SVG } from "../constants";
import "./style.css";
import "./editor.css";

const TEMPLATE = [["core/paragraph", { placeholder: "Lägg till innehåll…" }]];

// Same size and placement as the background in the Team Gallery: centered,
// 135% of the container's width. `isolate` on the wrapper keeps the -z-10
// shape behind the content but in front of any section background around it.
const Background = ({ svgColor, showOnMobile }) => (
	<div
		className={`svg-background-container__bg absolute max-w-375 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[135%] -z-10 pointer-events-none ${
			showOnMobile ? "" : "hidden md:block"
		}`}
		aria-hidden="true"
	>
		{cloneElement(TEAM_BACKGROUND_SVG, { style: { color: svgColor } })}
	</div>
);

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const { svgColor, showOnMobile } = attributes;

		// Inner blocks sit directly in the wrapper (like core/group) so the
		// layout support's content/wide widths apply to them.
		const { children, ...innerBlocksProps } = useInnerBlocksProps(
			useBlockProps({ className: "relative isolate" }),
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
				<div {...innerBlocksProps}>
					<Background svgColor={svgColor} showOnMobile={showOnMobile} />
					{children}
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const { svgColor, showOnMobile } = attributes;

		const { children, ...innerBlocksProps } = useInnerBlocksProps.save(
			useBlockProps.save({ className: "relative isolate" }),
		);

		return (
			<div {...innerBlocksProps}>
				<Background svgColor={svgColor} showOnMobile={showOnMobile} />
				{children}
			</div>
		);
	},
});
