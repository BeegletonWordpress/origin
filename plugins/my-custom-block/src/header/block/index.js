import { registerBlockType } from "@wordpress/blocks";
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from "@wordpress/block-editor";
import metadata from "./block.json";
import "../../index.css";
import "./style.css";
import "./editor.css";

const TEMPLATE = [
	[
		"core/site-logo",
		{
			width: 235,
			isLink: true,
		},
	],
	[
		"core/group",
		{
			layout: { type: "flex", flexWrap: "nowrap" },
			className: "header-right-side",
			style: {
				spacing: {
					blockGap: "30px",
				},
			},
		},
		[
			[
				"core/navigation",
				{
					layout: { type: "flex", justifyContent: "left" },
					fontSize: "small",
					style: {
						typography: {
							fontWeight: "600",
							textTransform: "uppercase",
						},
					},
				},
			],
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

registerBlockType( metadata.name, {
	edit: function Edit() {
		const blockProps = useBlockProps( {
			className: 'sticky top-0 z-50 w-full',
		} );

		const innerBlocksProps = useInnerBlocksProps(
			{
				className: 'header-inner-container mx-auto w-full max-w-(--wp--style--global--wide-size) px-8',
			},
			{
				template: TEMPLATE,
				templateLock: false,
				orientation: 'horizontal',
			}
		);

		return (
			<header { ...blockProps }>
				<div { ...innerBlocksProps } />
			</header>
		);
	},
	save: function save() {
		const blockProps = useBlockProps.save( {
			className: 'sticky top-0 z-50 w-full',
		} );

		return (
			<header { ...blockProps }>
				<div className="header-inner-container mx-auto flex w-full max-w-(--wp--style--global--wide-size) items-center justify-between px-8">
					<InnerBlocks.Content />
				</div>
			</header>
		);
	},
} );
