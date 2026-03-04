import { registerBlockType } from "@wordpress/blocks";
import {
	InnerBlocks,
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from "@wordpress/block-editor";
import metadata from "./block.json";
import "../index.css";
import "./style.css";
import "./editor.css";

const TRIGGER_CLASSES = "group relative py-6 cursor-pointer inline-block";
const DROPDOWN_CLASSES = "absolute top-full left-0 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 w-screen max-w-4xl bg-white shadow-2xl rounded-b-lg p-8 z-50";
const ALLOWED_BLOCKS = ["create-block/my-footer-row", "create-block/my-footer-column"];
const TEMPLATE = [["create-block/my-footer-row"]];

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { label } = attributes;
		const blockProps = useBlockProps({ className: TRIGGER_CLASSES });
		
		const innerBlocksProps = useInnerBlocksProps(
			{ className: "mt-4 border-2 border-dashed p-4" },
			{
				allowedBlocks: ALLOWED_BLOCKS,
				template: TEMPLATE,
			}
		);

		return (
			<div {...blockProps}>
				<RichText
					tagName="span"
					className="font-medium border-b-2 border-transparent transition-colors"
					value={label}
					onChange={(val) => setAttributes({ label: val })}
					placeholder="Menu Item..."
				/>
				<div {...innerBlocksProps} />
			</div>
		);
	},
	save: function save({ attributes }) {
		const { label } = attributes;
		const blockProps = useBlockProps.save({ className: TRIGGER_CLASSES });

		return (
			<div {...blockProps}>
				<span className="font-medium transition-colors">
					{label}
				</span>
				<div className={DROPDOWN_CLASSES}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
