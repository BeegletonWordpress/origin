import { registerBlockType } from "@wordpress/blocks";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import metadata from "./block.json";
import "./style.css";
import "./editor.css";

import { UnderlineSVG } from "../handdrawn-header";

const TEST_STRUCTURE = (
	<div className="flex flex-col md:flex-row w-fit max-w-225 justify-between gap-12 m-auto">
		<div className="w-full md:w-[50%] relative">
			<h1 className="wrap-anywhere">Subpage Hero</h1>
			<UnderlineSVG />
			<div className="mt-12">
				<img
					src="https://beegleton-dev.local/wp-content/uploads/2026/03/Rectangle-4.png"
					alt="Subpage Hero Image"
					className="max-h-64 w-full h-full object-cover"
				/>
			</div>
		</div>

		<p className="w-full md:w-[40%]">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a erat non
			sapien condimentum finibus sed sit amet orci. Phasellus vitae enim id sem
			fringilla facilisis. Aenean orci metus, ultricies nec purus ac, egestas
			semper augue. Nulla id turpis neque. Duis ut lorem efficitur, porttitor
			nulla quis, lobortis nulla. Praesent id augue vitae ante congue facilisis
			in quis nisl. Sed egestas est et egestas volutpat. Vivamus at eros in
			lacus commodo sagittis. Nullam iaculis accumsan nibh a molestie. Fusce nec
			urna commodo, hendrerit nunc vitae, pellentesque turpis. In fringilla
			magna id nulla porta laoreet a quis dui.
		</p>
	</div>
);

registerBlockType(metadata.name, {
	edit: () => {
		const blockProps = useBlockProps({
			className: "subpage-hero",
		});
		return (
			<div {...blockProps}>
				{TEST_STRUCTURE}
				<InnerBlocks />
			</div>
		);
	},
	save: () => {
		const blockProps = useBlockProps.save({
			className: "subpage-hero",
		});
		return (
			<div {...blockProps}>
				{TEST_STRUCTURE}
				<InnerBlocks.Content />
			</div>
		);
	},
});
