import { registerBlockType } from "@wordpress/blocks";
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from "@wordpress/block-editor";
import metadata from "./block.json";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ALLOWED_BLOCKS = ["core/paragraph", "core/image", "core/heading"];

const TEMPLATE = [["core/paragraph", { placeholder: "Add some text..." }]];

const BLOCK_CLASSES = "flex items-center gap-4";

registerBlockType(metadata.name, {
	edit: function Edit() {
		const blockProps = useBlockProps({
			className: BLOCK_CLASSES,
		});

		const innerBlocksProps = useInnerBlocksProps(
			{},
			{
				allowedBlocks: ALLOWED_BLOCKS,
				template: TEMPLATE,
				templateLock: false,
			},
		);

		return (
			<div {...blockProps}>
				<div>
					<DotLottieReact
						src="https://lottie.host/1e7e3c44-cfd7-493a-8f6b-9ec51b1041bd/S2mngFWUIQ.lottie"
						loop
						autoplay
						style={{ width: "125px", height: "180px" }}
					/>
				</div>
				<div {...innerBlocksProps} />
			</div>
		);
	},
	save: function save() {
		const blockProps = useBlockProps.save({
			className: BLOCK_CLASSES,
		});

		return (
			<div {...blockProps}>
				<div className="-rotate-45 w-31.25 h-45">
					<canvas
						className="animated-arrow-block__lottie"
						width="125"
						height="180"
						style={{ width: "125px", height: "180px" }}
						data-src="https://lottie.host/1e7e3c44-cfd7-493a-8f6b-9ec51b1041bd/S2mngFWUIQ.lottie"
					/>
				</div>
				<div>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
