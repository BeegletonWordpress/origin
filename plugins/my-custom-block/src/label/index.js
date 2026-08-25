import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	RichText,
	InspectorControls,
	PanelColorSettings,
} from "@wordpress/block-editor";
import { LABEL_SHAPE } from "../constants";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { text, svgColor, textColor } = attributes;

		const blockProps = useBlockProps({
			className: "label relative inline-flex items-center",
			style: { "--label-color": svgColor },
		});

		return (
			<>
				<InspectorControls>
					<PanelColorSettings
						title="Colors"
						colorSettings={[
							{
								value: svgColor,
								onChange: (val) => setAttributes({ svgColor: val }),
								label: "Shape Color",
							},
							{
								value: textColor,
								onChange: (val) => setAttributes({ textColor: val }),
								label: "Text Color",
							},
						]}
					/>
				</InspectorControls>
				<span {...blockProps}>
					{LABEL_SHAPE}
					<RichText
						tagName="span"
						className="label-text relative z-10 px-4 py-1.5 inline-block text-sm font-medium"
						value={text}
						onChange={(val) => setAttributes({ text: val })}
						placeholder="Enter label text…"
						allowedFormats={[]}
						style={{ color: textColor }}
					/>
				</span>
			</>
		);
	},

	save: function save({ attributes }) {
		const { text, svgColor, textColor } = attributes;

		const blockProps = useBlockProps.save({
			className: "label relative inline-flex items-center",
			style: { "--label-color": svgColor },
		});

		return (
			<span {...blockProps}>
				{LABEL_SHAPE}
				<RichText.Content
					tagName="span"
					className="label-text relative z-10 px-4 py-1.5 inline-block text-sm font-medium"
					value={text}
					style={{ color: textColor }}
				/>
			</span>
		);
	},
});