import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
	PanelColorSettings,
	RichText,
} from "@wordpress/block-editor";
import { PanelBody, TextareaControl } from "@wordpress/components";

import metadata from "./block.json";
import "./style.css";
import "./editor.css";

const CARDS_TEMPLATE = [
	["create-block/service-card", {}],
	["create-block/service-card", {}],
];

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const {
			themeColor,
			illustrationSvg,
			title,
			description,
			leftColumnText,
			rightColumnText,
		} = attributes;

		const blockProps = useBlockProps({
			className: "service-block w-full",
			style: {
				"--theme-color": themeColor,
				"--handdrawn-stroke-color": themeColor,
			},
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
								"Paste the full <svg>…</svg> code for the right-column illustration.",
							)}
							value={illustrationSvg}
							onChange={(val) => setAttributes({ illustrationSvg: val })}
							rows={8}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					{/* Top row */}
					<div className="service-block__top flex flex-col md:flex-row gap-12 justify-center items-center mb-8">
						{/* Left: title + description */}
						<div className="service-block__text flex-1">
							{/* Handdrawn header */}
							<div
								className="relative inline-block w-fit mb-[2.5rem]"
								style={{ minWidth: "150px" }}
							>
								<RichText
									tagName="h2"
									className="wp-block-heading"
									value={title}
									onChange={(val) => setAttributes({ title: val })}
									placeholder={__("Service title…")}
								/>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 1389.48 114.68"
									className="absolute left-0 w-full h-10 pointer-events-none handdrawn-underline-svg z-1 rotate-4"
									style={{ bottom: "-2.5rem", color: themeColor }}
									preserveAspectRatio="none"
									fill="none"
								>
									<path
										d="M.22,58.89c409.43-17.94,819.55-20,1229.13-6.16-376.42-28.84-754.24,12.48-1129.26,56.92-3.39.4-4.45-4.45-1.2-5.5,64.93-20.81,133.44-29.35,201.35-37.03C661.8,26.29,1025.62,5.54,1389.47,5"
										stroke="currentColor"
										strokeLinecap="round"
										strokeMiterlimit="10"
										strokeWidth="10px"
										className="handdrawn-underline-path"
									/>
								</svg>
							</div>

							{/* Description */}
							<RichText
								tagName="p"
								className="max-w-[650px]"
								value={description}
								onChange={(val) => setAttributes({ description: val })}
								placeholder={__("Description…")}
							/>
						</div>

						{/* Right: illustration */}
						<div className="h-full flex-1 min-w-[150px] flex items-center justify-center">
							{illustrationSvg ? (
								<div
									className="h-full w-full flex"
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
									{__("Paste your SVG illustration in the sidebar →")}
								</div>
							)}
						</div>
					</div>

					<div className="flex gap-6 mb-6">
						<RichText
							tagName="p"
							className="flex-1"
							value={leftColumnText}
							onChange={(val) => setAttributes({ leftColumnText: val })}
							placeholder={__("Left column text…")}
						/>
						<RichText
							tagName="p"
							className="flex-1"
							value={rightColumnText}
							onChange={(val) => setAttributes({ rightColumnText: val })}
							placeholder={__("Right column text…")}
						/>
					</div>

					{/* Cards row */}
					<div className="flex justify-between gap-6 flex-col md:flex-row">
						<InnerBlocks
							template={CARDS_TEMPLATE}
							templateLock="all"
							allowedBlocks={["create-block/service-card"]}
						/>
					</div>
				</div>
			</>
		);
	},

	save: ({ attributes }) => {
		const {
			themeColor,
			illustrationSvg,
			title,
			description,
			leftColumnText,
			rightColumnText,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: "service-block w-full",
			style: {
				"--theme-color": themeColor,
				"--handdrawn-stroke-color": themeColor,
			},
		});

		return (
			<div {...blockProps}>
				{/* Top row */}
				<div className="service-block__top flex flex-col md:flex-row gap-12 justify-center items-center mb-8">
					<div className="service-block__text flex-1">
						<div
							className="relative inline-block w-fit mb-[2.5rem]"
							style={{ minWidth: "150px" }}
						>
							<RichText.Content
								tagName="h2"
								className="wp-block-heading"
								value={title}
							/>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 1389.48 114.68"
								className="absolute left-0 w-full h-10 pointer-events-none handdrawn-underline-svg z-1 rotate-4"
								style={{ bottom: "-2.5rem", color: themeColor }}
								preserveAspectRatio="none"
								fill="none"
							>
								<path
									d="M.22,58.89c409.43-17.94,819.55-20,1229.13-6.16-376.42-28.84-754.24,12.48-1129.26,56.92-3.39.4-4.45-4.45-1.2-5.5,64.93-20.81,133.44-29.35,201.35-37.03C661.8,26.29,1025.62,5.54,1389.47,5"
									stroke="currentColor"
									strokeLinecap="round"
									strokeMiterlimit="10"
									strokeWidth="10px"
									className="handdrawn-underline-path"
								/>
							</svg>
						</div>

						<RichText.Content
							tagName="p"
							className="max-w-[650px]"
							value={description}
						/>
					</div>

					{illustrationSvg && (
						<div
							className="h-full flex-1 min-w-[150px] flex justify-center"
							dangerouslySetInnerHTML={{ __html: illustrationSvg }}
						/>
					)}
				</div>

				{(leftColumnText || rightColumnText) && (
					<div className="flex gap-6 mb-6">
						{leftColumnText && (
							<RichText.Content
								tagName="p"
								className="flex-1"
								value={leftColumnText}
							/>
						)}
						{rightColumnText && (
							<RichText.Content
								tagName="p"
								className="flex-1"
								value={rightColumnText}
							/>
						)}
					</div>
				)}

				{/* Cards row */}
				<div className="flex justify-between gap-6 flex-col md:flex-row">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
