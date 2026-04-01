import { registerBlockType } from "@wordpress/blocks";
import { useBlockProps } from "@wordpress/block-editor";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	edit: function Edit() {
		const blockProps = useBlockProps();

		return (
			<div {...blockProps}>
				<p>contact card</p>
			</div>
		);
	},
	save: function save() {
		const blockProps = useBlockProps.save();

		return (
			<div {...blockProps}>
				<p>contact card</p>
			</div>
		);
	},
});
