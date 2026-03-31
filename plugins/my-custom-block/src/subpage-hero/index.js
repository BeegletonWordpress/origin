import { registerBlockType } from "@wordpress/blocks";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import metadata from "./block.json";
import "./style.css";
import "./editor.css";

import { UnderlineSVG } from "../handdrawn-header";

const TEST_STRUCTURE = (
	<div className="flex flex-col p-8 md:flex-row w-fit gap-4 md:gap-2 max-w-225 m-auto mb-12 md:items-stretch">
		<div className="w-full md:w-[50%] relative">
			<div className="md:relative md:mr-auto">
				<h1 className="wrap-anywhere">Subpage Hero</h1>
				<div className="scale-125">
					<UnderlineSVG />
				</div>
			</div>
			<div className="mt-12 pt-5 md:mr-7">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a erat non
				sapien condimentum finibus sed sit amet orci. Phasellus vitae enim id
				sem fringilla facilisis. Aenean orci metus, ultricies nec purus ac,
				egestas semper augue. Nulla id turpis neque. Duis ut lorem efficitur,
				porttitor nulla quis, lobortis nulla. Praesent id augue vitae ante
				congue facilisis in quis nisl. Sed egestas est et egestas volutpat.
				Vivamus at eros in lacus commodo sagittis. Nullam iaculis accumsan nibh
				a molestie. Fusce nec urna commodo, hendrerit nunc vitae, pellentesque
				turpis. In fringilla magna id nulla porta laoreet a quis dui.
			</div>
		</div>

		<div className="w-full md:w-[40%]">
			<img
				src="https://beegleton-dev.local/wp-content/uploads/2026/03/Rectangle-4.png"
				alt="Subpage Hero Image"
				className="w-full h-full object-cover"
			/>
		</div>
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
