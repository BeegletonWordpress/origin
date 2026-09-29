import { registerBlockType } from "@wordpress/blocks";
import {
	InspectorControls,
	PanelColorSettings,
	useBlockProps,
	useInnerBlocksProps,
} from "@wordpress/block-editor";
import { PanelBody, RangeControl, ToggleControl } from "@wordpress/components";
import metadata from "./block.json";
import { BEE_SHAPE } from "../constants";
import "./style.css";
import "./editor.css";

const TEMPLATE = [["core/paragraph", { placeholder: "Lägg till innehåll…" }]];

// The flight path is computed in view.js from the container's live size;
// only the bee itself and its size/colour are saved.
// no-trail / no-landing are only added when those options are off, so
// containers with the defaults keep their original save() output.
const BeeLayer = ({ beeColor, beeSize, showOnMobile, showTrail, landOnButton }) => (
	<div
		className={`bee-flight__layer${showTrail ? "" : " no-trail"}${
			landOnButton ? "" : " no-landing"
		} ${
			showOnMobile ? "" : "hidden md:block"
		}`}
		aria-hidden="true"
	>
		<div
			className="bee-flight__bee"
			style={{ "--bee-size": `${beeSize}px`, color: beeColor }}
		>
			{BEE_SHAPE}
		</div>
	</div>
);

// The layout support's classes land on this element, since it wraps the
// inner blocks (same as svg-background-container). Keep it the last element
// with a class before the inner blocks in save().
const CONTENT_CLASS = "bee-flight__content";

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const { beeColor, beeSize, showOnMobile, showTrail, landOnButton } =
			attributes;

		const blockProps = useBlockProps({ className: "relative isolate" });
		const innerBlocksProps = useInnerBlocksProps(
			{ className: CONTENT_CLASS },
			{ template: TEMPLATE },
		);

		return (
			<>
				<InspectorControls>
					<PanelBody title="Bee">
						<RangeControl
							label="Bee size (px)"
							value={beeSize}
							onChange={(value) => setAttributes({ beeSize: value })}
							min={32}
							max={160}
							step={4}
						/>
						<ToggleControl
							label="Dotted trail"
							help="Shows the path behind the bee as it flies."
							checked={showTrail}
							onChange={(value) => setAttributes({ showTrail: value })}
						/>
						<ToggleControl
							label="Land on the last button"
							help="Ends the flight sitting on top of the last button in the container."
							checked={landOnButton}
							onChange={(value) => setAttributes({ landOnButton: value })}
						/>
						<ToggleControl
							label="Show on mobile"
							checked={showOnMobile}
							onChange={(value) => setAttributes({ showOnMobile: value })}
						/>
					</PanelBody>
					<PanelColorSettings
						title="Bee Color"
						colorSettings={[
							{
								value: beeColor,
								onChange: (value) => setAttributes({ beeColor: value }),
								label: "Bee color",
							},
						]}
					/>
				</InspectorControls>
				<div {...blockProps}>
					<BeeLayer
						beeColor={beeColor}
						beeSize={beeSize}
						showOnMobile={showOnMobile}
						showTrail={showTrail}
						landOnButton={landOnButton}
					/>
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const { beeColor, beeSize, showOnMobile, showTrail, landOnButton } =
			attributes;

		const blockProps = useBlockProps.save({ className: "relative isolate" });
		const innerBlocksProps = useInnerBlocksProps.save({
			className: CONTENT_CLASS,
		});

		return (
			<div {...blockProps}>
				<BeeLayer
					beeColor={beeColor}
					beeSize={beeSize}
					showOnMobile={showOnMobile}
					showTrail={showTrail}
					landOnButton={landOnButton}
				/>
				<div {...innerBlocksProps} />
			</div>
		);
	},
});
