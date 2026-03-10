import { registerBlockType } from "@wordpress/blocks";
import {
	RichText,
	useBlockProps,
	__experimentalLinkControl as LinkControl,
	BlockControls,
	InspectorControls,
	ColorPalette,
	InnerBlocks,
} from "@wordpress/block-editor";
import {
	ToolbarGroup,
	ToolbarButton,
	Popover,
	PanelBody,
	ToggleControl,
} from "@wordpress/components";
import { link } from "@wordpress/icons";
import { useState } from "@wordpress/element";
import metadata from "./block.json";
import { HAND_DRAWN_CARD_SHAPE } from "../constants";
import "../index.css";
import "./style.css";
import "./editor.css";

const TEMPLATE = [["create-block/my-handdrawn-button", { text: "Click Here" }]];

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { headerText, subHeaderText, bodyText, backgroundColor, style } =
			attributes;

		let customBgColor = style?.color?.background;
		if (backgroundColor) {
			customBgColor = `var(--wp--preset--color--${backgroundColor})`;
		}

		const blockProps = useBlockProps({
			className: "relative inline-block w-full h-full",
			style: {
				"--handdrawn-stroke-color":
					customBgColor || "var(--wp--preset--color--primary, #000)",
			},
		});

		return (
			<>
				<div {...blockProps}>
					{HAND_DRAWN_CARD_SHAPE}
					<div className="relative z-10 flex flex-col gap-4 p-6">
						<RichText
							tagName="h3"
							value={headerText}
							onChange={(val) => setAttributes({ headerText: val })}
							placeholder="Add header text..."
						/>
						<RichText
							tagName="h4"
							value={subHeaderText}
							onChange={(val) => setAttributes({ subHeaderText: val })}
							placeholder="Add subheader text..."
						/>
						<RichText
							tagName="p"
							value={bodyText}
							onChange={(val) => setAttributes({ bodyText: val })}
							placeholder="Add body text..."
						/>
						<InnerBlocks
							allowedBlocks={["create-block/my-handdrawn-button"]}
							template={TEMPLATE}
							templateLock={false}
						/>
					</div>
				</div>
			</>
		);
	},
	save: function save({ attributes }) {
		const { headerText, subHeaderText, bodyText, backgroundColor, style } =
			attributes;

		let customBgColor = style?.color?.background;
		if (backgroundColor) {
			customBgColor = `var(--wp--preset--color--${backgroundColor})`;
		}

		const blockProps = useBlockProps.save({
			className: "relative inline-block w-full h-full",
			style: {
				"--handdrawn-stroke-color":
					customBgColor || "var(--wp--preset--color--primary, #000)",
			},
		});

		return (
			<div {...blockProps}>
				{HAND_DRAWN_CARD_SHAPE}
				<div className="relative z-10 flex flex-col gap-4 p-6">
					<RichText.Content tagName="h3" value={headerText} />
					<RichText.Content tagName="h4" value={subHeaderText} />
					<RichText.Content tagName="p" value={bodyText} />
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
