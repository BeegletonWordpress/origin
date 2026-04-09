import { registerBlockType } from "@wordpress/blocks";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
	PanelBody,
	TextControl,
	__experimentalNumberControl as NumberControl,
} from "@wordpress/components";
import metadata from "./block.json";
import "../../index.css";
import "./style.css";
import "./editor.css";

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { number, suffix, description } = attributes;
		const blockProps = useBlockProps({
			className: "count-up-number-item text-center p-4 max-w-54",
		});

		return (
			<>
				<InspectorControls>
					<PanelBody title="Number Settings">
						<NumberControl
							label="Number"
							value={number}
							onChange={(val) => setAttributes({ number: val })}
						/>
						<TextControl
							label="Suffix"
							value={suffix}
							onChange={(val) => setAttributes({ suffix: val })}
							help="Text to append after number (e.g., +, k, %)"
						/>
						<TextControl
							label="Description"
							value={description}
							onChange={(val) => setAttributes({ description: val })}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className="count-up-number text-7xl font-bold">
						{number}
						{suffix && <span className="count-up-suffix">{suffix}</span>}
					</div>
					{description && (
						<div className="count-up-description text-lg mt-2">
							{description}
						</div>
					)}
				</div>
			</>
		);
	},
	save: function Save({ attributes }) {
		const { number, suffix, description } = attributes;
		const blockProps = useBlockProps.save({
			className: "count-up-number-item text-center p-4 max-w-54",
		});

		return (
			<div {...blockProps} data-number={number} data-suffix={suffix}>
				<div className="count-up-number text-7xl font-bold">
					<span className="count-up-value">{number}</span>
					{suffix && <span className="count-up-suffix">{suffix}</span>}
				</div>
				{description && (
					<div className="count-up-description text-lg mt-2">{description}</div>
				)}
			</div>
		);
	},
});
