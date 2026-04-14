import { registerBlockType } from "@wordpress/blocks";
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import metadata from "./block.json";
import "./style.css";
import "./editor.css";

const TEMPLATE = [["create-block/subpage-hero"]];

registerBlockType(metadata.name, {
	edit: function Edit() {
		const blockProps = useBlockProps({
			className: "subpage-template",
		});

		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			template: TEMPLATE,
		});

		return <div {...innerBlocksProps} />;
	},
	save: function Save() {
		const blockProps = useBlockProps.save({
			className: "subpage-template",
		});

		const innerBlocksProps = useInnerBlocksProps.save(blockProps);

		return <div {...innerBlocksProps} />;
	},
});
