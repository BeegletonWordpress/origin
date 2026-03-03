import { __ } from "@wordpress/i18n";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import "./editor.scss";

const ALLOWED_BLOCKS = ["create-block/my-footer-column"];

const TEMPLATE = [
	["create-block/my-footer-column"],
	["create-block/my-footer-column"],
	["create-block/my-footer-column"],
];

export default function Edit() {
	return (
		<footer
			{...useBlockProps({ className: "flex gap-8 p-8 bg-gray-900 text-white" })}
		>
			<InnerBlocks
				allowedBlocks={ALLOWED_BLOCKS}
				template={TEMPLATE}
				orientation="horizontal"
			/>
		</footer>
	);
}
