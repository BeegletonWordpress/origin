import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	useInnerBlocksProps,
} from "@wordpress/block-editor";
import metadata from "./block.json";
import "./style.css";
import "./editor.css";

registerBlockType(metadata.name, {
	edit: function Edit() {
		const blockProps = useBlockProps({
			className: "subpage-content",
		});

		const innerBlocksProps = useInnerBlocksProps(blockProps, {});

		return <div {...innerBlocksProps} />;
	},
	save: function Save() {
		const blockProps = useBlockProps.save({
			className: "subpage-content",
		});

		const innerBlocksProps = useInnerBlocksProps.save(blockProps);

		return <div {...innerBlocksProps} />;
	},
});