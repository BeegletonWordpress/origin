import { __ } from "@wordpress/i18n";
import { InnerBlocks, useBlockProps, RichText } from "@wordpress/block-editor";
import "./editor.scss";

const ALLOWED_BLOCKS = ["core/paragraph", "core/list"];

const TEMPLATE = [
	["core/paragraph", { placeholder: "A column heading" }],
	["core/list"],
];

export default function Edit() {
	return (
		<div {...useBlockProps({ className: "flex flex-col gap-4 flex-1" })}>
			<InnerBlocks allowedBlocks={ALLOWED_BLOCKS} template={TEMPLATE} />
		</div>
	);
}
