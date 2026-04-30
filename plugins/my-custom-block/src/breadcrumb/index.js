import { registerBlockType } from "@wordpress/blocks";
import { useBlockProps } from "@wordpress/block-editor";
import metadata from "./block.json";

import { BEE_SHAPE } from "../constants";

import "./style.css";

registerBlockType(metadata.name, {
	edit: () => {
		const blockProps = useBlockProps();
		return (
			<nav {...blockProps} className="breadcrumbs">
				<a href="/" className="size-8">
					{BEE_SHAPE}
				</a>
				<span> / </span>
				<span>Breadcrumbs</span>
			</nav>
		);
	},
	save: () => null,
});
