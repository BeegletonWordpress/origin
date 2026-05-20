import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import metadata from "./block.json";

import "./editor.css";
import "./style.css";

// Small hand-drawn border SVG copied from the parent block for visual parity.
const CARD_BORDER_SVG = (
	<svg
		width="461"
		height="501"
		viewBox="0 0 461 501"
		fill="none"
		preserveAspectRatio="none"
		xmlns="http://www.w3.org/2000/svg"
		className="absolute inset-0 w-full h-full z-0"
		style={{ stroke: "var(--handdrawn-stroke-color)" }}
	>
		<path
			d="M451.2,36.8c10.1,153.3-8.2,290.5-23.3,443.5-.4,3.6-.8,7.3-3.1,10.1-4.2,5.1-12.1,4.2-18.6,3-124.8-23-253.1,3.6-380,0,0-1.4-.1-2.7-.2-4.1C17.6,334.2,6.4,198.3,19.7,46.6c.4-4.8,2.5-9.4,5.7-13,4-4.5,10.2-6.3,16.1-7.7C160.2-3.5,322.3,5.2,443.8,17.8c7.4.5,10.1,3.4,10.2,11.1,6.1,144.9-8.6,273-12.4,418-.3,11.3-1.9,24.7-11.8,30-4.2,2.3-9.2,2.5-14.1,2.7-85.4,3.6-170.8,7.1-256.2,10.7-52,2.2-104.3,4.3-156-2.2"
			strokeWidth="5"
			strokeMiterlimit="10"
			vectorEffect="non-scaling-stroke"
		/>
	</svg>
);

const CARD_TEMPLATE = [
	[
		"core/heading",
		{
			level: 3,
			placeholder: "Card title…",
			className: "wp-block-heading mb-3",
		},
	],
	[
		"core/list",
		{ className: "list-disc list-inside" },
		[
			["core/list-item", { content: "Lorem ipsum 1" }],
			["core/list-item", { content: "Lorem ipsum 2" }],
			["core/list-item", { content: "Lorem ipsum 3" }],
		],
	],
];

registerBlockType(metadata.name, {
	edit: () => {
		const blockProps = useBlockProps({
			className:
				"wp-block-create-block-my-handdrawn-card relative flex flex-col w-full max-w-[650px] m-auto md:w-fit h-full flex-1 has-accent-2-background-color has-background",
		});

		return (
			<div {...blockProps}>
				{CARD_BORDER_SVG}
				<div className="relative z-10 flex p-14 flex-row h-full justify-start">
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-evenly",
						}}
					>
						<InnerBlocks template={CARD_TEMPLATE} templateLock="all" />
					</div>
				</div>
			</div>
		);
	},

	save: () => {
		const blockProps = useBlockProps.save({
			className:
				"wp-block-create-block-my-handdrawn-card relative flex flex-col w-full md:w-fit h-full flex-1 has-accent-2-background-color has-background",
		});

		return (
			<div {...blockProps}>
				{CARD_BORDER_SVG}
				<div className="relative z-10 flex p-14 flex-row h-full justify-start">
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-evenly",
						}}
					>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
});
