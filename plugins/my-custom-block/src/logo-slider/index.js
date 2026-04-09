import { registerBlockType } from "@wordpress/blocks";
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from "@wordpress/block-editor";
import { PanelBody, ToggleControl, RangeControl } from "@wordpress/components";
import metadata from "./block.json";
import "../index.css";
import "./style.css";
import "./editor.css";

const BLOCK_CLASSES = "logo-slider-track flex gap-15 py-15 items-center";
const ALLOWED_BLOCKS = ["create-block/my-logo-slider-item"];
const TEMPLATE = [
	["create-block/my-logo-slider-item"],
	["create-block/my-logo-slider-item"],
	["create-block/my-logo-slider-item"],
	["create-block/my-logo-slider-item"],
	["create-block/my-logo-slider-item"],
	["create-block/my-logo-slider-item"],
];

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { autoplay, scrollSpeed, pauseOnHover } = attributes;
		const blockProps = useBlockProps({
			className: "logo-slider-container overflow-hidden",
		});
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: ALLOWED_BLOCKS,
			template: TEMPLATE,
			orientation: "horizontal",
		});

		return (
			<>
				<InspectorControls>
					<PanelBody title="Slider Settings">
						<ToggleControl
							label="Autoplay"
							checked={autoplay}
							onChange={(val) => setAttributes({ autoplay: val })}
						/>
						{autoplay && (
							<>
								<RangeControl
									label="Scroll Speed"
									value={scrollSpeed}
									onChange={(val) => setAttributes({ scrollSpeed: val })}
									min={10}
									max={200}
									help="Pixels per second (lower is faster)"
								/>
								<ToggleControl
									label="Pause on Hover"
									checked={pauseOnHover}
									onChange={(val) => setAttributes({ pauseOnHover: val })}
								/>
							</>
						)}
					</PanelBody>
				</InspectorControls>

				<div {...innerBlocksProps}>
					<div
						className={BLOCK_CLASSES}
						data-autoplay={autoplay}
						data-speed={scrollSpeed}
						data-pause-on-hover={pauseOnHover}
					>
						{innerBlocksProps.children}
					</div>
				</div>
			</>
		);
	},
	save: function save({ attributes }) {
		const { autoplay, scrollSpeed, pauseOnHover } = attributes;
		const blockProps = useBlockProps.save({
			className: "logo-slider-container overflow-hidden",
		});
		return (
			<div {...blockProps}>
				<div
					className={BLOCK_CLASSES}
					data-autoplay={autoplay}
					data-speed={scrollSpeed}
					data-pause-on-hover={pauseOnHover}
				>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
