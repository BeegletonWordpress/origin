import { registerBlockType } from "@wordpress/blocks";
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from "@wordpress/block-editor";
import { addFilter } from "@wordpress/hooks";
import metadata from "./block.json";
import "../../index.css";
import "./style.css";
import "./editor.css";

// 1. Allow the handdrawn button to be a child of the Navigation block
addFilter(
	"blocks.registerBlockType",
	"my-custom-block/allow-button-in-navigation",
	(settings, name) => {
		if (name === "core/navigation") {
			return {
				...settings,
				allowedBlocks: [
					...(settings.allowedBlocks || []),
					"create-block/my-handdrawn-button",
				],
			};
		}
		return settings;
	},
);

const TEMPLATE = [
	[
		"core/site-logo",
		{
			width: 235,
			isLink: true,
		},
	],
	[
		"core/navigation",
		{
			layout: { type: "flex", justifyContent: "right", flexWrap: "nowrap" },
			fontSize: "small",
			style: {
				typography: {
					fontWeight: "600",
					textTransform: "uppercase",
				},
				spacing: {
					blockGap: "30px",
				},
			},
			className: "header-navigation",
		},
		[
			["core/home-link"],
			[
				"create-block/my-handdrawn-button",
				{
					text: "KONTAKTA OSS",
					backgroundColor: "contrast",
					textColor: "accent-5",
					style: {
						spacing: {
							padding: {
								top: "15px",
								right: "30px",
								bottom: "15px",
								left: "30px",
							},
						},
					},
				},
			],
		],
	],
];

registerBlockType(metadata.name, {
	edit: function Edit() {
		const blockProps = useBlockProps({
			className: "sticky top-0 z-50 w-full",
		});

		const innerBlocksProps = useInnerBlocksProps(
			{
				className:
					"header-inner-container mx-auto w-full max-w-(--wp--style--global--wide-size) px-8",
			},
			{
				template: TEMPLATE,
				templateLock: false,
				orientation: "horizontal",
			},
		);

		return (
			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		);
	},
	save: function save() {
		const blockProps = useBlockProps.save({
			className: "sticky top-0 z-50 w-full",
		});

		return (
			<div {...blockProps}>
				<div className="header-inner-container mx-auto flex w-full max-w-(--wp--style--global--wide-size) items-center justify-between px-8">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
