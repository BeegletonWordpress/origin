import { registerBlockType } from "@wordpress/blocks";
import {
	RichText,
	useBlockProps,
	__experimentalLinkControl as LinkControl,
	BlockControls,
	InspectorControls,
} from "@wordpress/block-editor";
import { 
	ToolbarGroup, 
	ToolbarButton, 
	Popover,
	PanelBody,
} from "@wordpress/components";
import { link } from "@wordpress/icons";
import { useState } from "@wordpress/element";
import metadata from "./block.json";
import { HAND_DRAWN_BUTTON_SHAPE } from "../constants";
import "../index.css";
import "./style.css";
import "./editor.css";

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { text, url, linkTarget, rel } = attributes;
		const [isEditingURL, setIsEditingURL] = useState(false);
		
		const blockProps = useBlockProps({
			className: "relative inline-block px-10 py-4 font-bold transition-transform hover:scale-105 active:scale-95"
		});

		const onLinkChange = (newValues) => {
			setAttributes({
				url: newValues.url,
				linkTarget: newValues.opensInNewTab ? "_blank" : undefined,
				rel: newValues.opensInNewTab ? "noopener" : undefined,
			});
		};

		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon={link}
							title="Link"
							onClick={() => setIsEditingURL(!isEditingURL)}
							isActive={!!url}
						/>
					</ToolbarGroup>
				</BlockControls>

				{isEditingURL && (
					<Popover
						onClose={() => setIsEditingURL(false)}
						anchor={blockProps.ref}
					>
						<LinkControl
							className="wp-block-navigation-link__inline-link-control"
							value={{ url, opensInNewTab: linkTarget === "_blank" }}
							onChange={onLinkChange}
						/>
					</Popover>
				)}

				<div {...blockProps}>
					{HAND_DRAWN_BUTTON_SHAPE}
					<RichText
						tagName="span"
						value={text}
						onChange={(val) => setAttributes({ text: val })}
						placeholder="Add text..."
						allowedFormats={[]} // Keep it simple for buttons
					/>
				</div>
			</>
		);
	},
	save: function save({ attributes }) {
		const { text, url, linkTarget, rel } = attributes;
		const blockProps = useBlockProps.save({
			className: "relative inline-block px-10 py-4 font-bold transition-transform hover:scale-105 active:scale-95"
		});

		const Tag = url ? "a" : "span";

		return (
			<Tag
				{...blockProps}
				href={url}
				target={linkTarget}
				rel={rel}
			>
				{HAND_DRAWN_BUTTON_SHAPE}
				<RichText.Content tagName="span" value={text} />
			</Tag>
		);
	},
});
