import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	InnerBlocks,
	PanelColorSettings,
} from "@wordpress/block-editor";
import {
	PanelBody,
	ColorPicker,
	Button,
	SelectControl,
	TextControl,
	TextareaControl,
} from "@wordpress/components";

import {
	HAND_DRAWN_CARD_SHAPE,
	HAND_DRAWN_CARD_SHAPE_2,
	HAND_DRAWN_CARD_SHAPE_3,
} from "../constants";

import metadata from "./block.json";

import "./style.css";
import "./editor.css";

// Template for the top text area: handdrawn header + paragraph
const TEXT_TEMPLATE = [
	["my-custom-block/handdrawn-header", { placeholder: __("Service title…") }],
	[
		"core/paragraph",
		{
			placeholder: __("Description…"),
			className: "max-w-[650px]",
		},
	],
];

// Template for each card: heading + list, fully locked
const CARD_TEMPLATE = [
	[
		"core/heading",
		{
			level: 3,
			placeholder: __("Card title…"),
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

// The hand-drawn card border SVG — stroke color set via CSS var
const CardBorderSVG = () => (
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

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const { themeColor, illustrationSvg } = attributes;

		const blockProps = useBlockProps({
			className: "service-block w-full p-16",
			style: { "--theme-color": themeColor },
		});

		return (
			<>
				<InspectorControls>
					<PanelColorSettings
						title={__("Theme color")}
						initialOpen
						colorSettings={[
							{
								value: themeColor,
								onChange: (val) => setAttributes({ themeColor: val || "" }),
								label: __("Stroke & accent color"),
							},
						]}
					/>
					<PanelBody title={__("Illustration SVG")} initialOpen={false}>
						<TextareaControl
							label={__("Paste SVG markup")}
							help={__(
								"Paste the full <svg>…</svg> code for the illustration shown on the right.",
							)}
							value={illustrationSvg}
							onChange={(val) => setAttributes({ illustrationSvg: val })}
							rows={8}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					{/* Top row: text content + illustration */}
					<div className="service-block__top flex gap-12 justify-center items-stretch mb-8">
						{/* Left: handdrawn header block + description paragraph */}
						<div className="service-block__text flex-1">
							<InnerBlocks
								template={TEXT_TEMPLATE}
								templateLock="all"
								allowedBlocks={[
									"my-custom-block/handdrawn-header",
									"core/paragraph",
								]}
							/>
						</div>

						{/* Right: pasted SVG illustration */}
						<div className="h-full flex-1 min-w-[150px] flex items-center justify-center">
							{illustrationSvg ? (
								<div
									className="h-full w-full"
									dangerouslySetInnerHTML={{ __html: illustrationSvg }}
								/>
							) : (
								<div
									style={{
										border: "2px dashed #ccc",
										borderRadius: 8,
										padding: 24,
										color: "#aaa",
										minHeight: 160,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										textAlign: "center",
									}}
								>
									{__("Paste your SVG illustration in the sidebar panel →")}
								</div>
							)}
						</div>
					</div>

					{/* Cards row — two fixed cards with locked InnerBlocks */}
					<div className="flex justify-between gap-6">
						{["card-1", "card-2"].map((key) => (
							<div
								key={key}
								className="wp-block-create-block-my-handdrawn-card relative flex flex-col w-fit h-full flex-1 has-accent-2-background-color has-background"
								style={{ "--handdrawn-stroke-color": themeColor }}
							>
								<CardBorderSVG />
								<div className="relative z-10 flex p-14 flex-row h-full justify-start">
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											justifyContent: "space-evenly",
										}}
									>
										<InnerBlocks
											template={CARD_TEMPLATE}
											templateLock="all"
											__experimentalCaptureToolbars
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const { title, description, themeColor, image, cards, illustrationSvg } =
			attributes;
		const blockProps = useBlockProps.save({
			className: "service-block w-full p-16",
			style: { "--theme-color": themeColor },
		});

		return (
			<div {...blockProps}>
				{/* Top row */}
				<div className="service-block__top flex gap-12 justify-center items-stretch mb-8">
					<div className="service-block__text flex-1">
						<InnerBlocks.Content />
					</div>

					{illustrationSvg && (
						<div
							className="h-full flex-1 min-w-[150px]"
							dangerouslySetInnerHTML={{ __html: illustrationSvg }}
						/>
					)}
				</div>

				{/* Cards */}
				<div className="flex justify-between gap-6">
					{["card-1", "card-2"].map((key) => (
						<div
							key={key}
							className="wp-block-create-block-my-handdrawn-card relative flex flex-col w-fit h-full flex-1 has-accent-2-background-color has-background"
							style={{ "--handdrawn-stroke-color": themeColor }}
						>
							<svg
								width="461"
								height="501"
								viewBox="0 0 461 501"
								fill="none"
								preserveAspectRatio="none"
								xmlns="http://www.w3.org/2000/svg"
								className="absolute inset-0 w-full h-full z-0"
								style={{ stroke: themeColor }}
							>
								<path
									d="M451.2,36.8c10.1,153.3-8.2,290.5-23.3,443.5-.4,3.6-.8,7.3-3.1,10.1-4.2,5.1-12.1,4.2-18.6,3-124.8-23-253.1,3.6-380,0,0-1.4-.1-2.7-.2-4.1C17.6,334.2,6.4,198.3,19.7,46.6c.4-4.8,2.5-9.4,5.7-13,4-4.5,10.2-6.3,16.1-7.7C160.2-3.5,322.3,5.2,443.8,17.8c7.4.5,10.1,3.4,10.2,11.1,6.1,144.9-8.6,273-12.4,418-.3,11.3-1.9,24.7-11.8,30-4.2,2.3-9.2,2.5-14.1,2.7-85.4,3.6-170.8,7.1-256.2,10.7-52,2.2-104.3,4.3-156-2.2"
									strokeWidth="5"
									strokeMiterlimit="10"
									vectorEffect="non-scaling-stroke"
								/>
							</svg>
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
					))}
				</div>
			</div>
		);
	},
});
