import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	InnerBlocks,
	RichText,
	MediaPlaceholder,
	MediaReplaceFlow,
	BlockControls,
	InspectorControls,
	PanelColorSettings,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from "@wordpress/components";
import { useEffect } from "@wordpress/element";
import metadata from "./block.json";
import deprecated from "./deprecated";
import { THEMES } from "./themes";
import "./style.css";
import "./editor.css";

import { UnderlineSVG } from "../handdrawn-header";

// Only rendered when an overlay is set, so heroes without one keep their
// original save() output and still validate.
const ImageOverlay = ({ color, gradient, opacity }) => {
	if (!color && !gradient) {
		return null;
	}

	return (
		<span
			className="subpage-hero-image-overlay"
			aria-hidden="true"
			style={{ background: gradient || color, opacity: opacity / 100 }}
		/>
	);
};

registerBlockType(metadata.name, {
	deprecated,
	edit: ({ attributes, setAttributes }) => {
		const {
			tagline,
			title,
			subheader,
			imageUrl,
			imageAlt,
			imageId,
			svgColor,
			theme,
			reverseLayout,
			contentWidth,
			overlayColor,
			overlayGradient,
			overlayOpacity,
		} = attributes;

		const activeTheme = THEMES[theme] || THEMES.default;
		const colorGradientSettings = useMultipleOriginColorsAndGradients();

		useEffect(() => {
			const canvas =
				document.querySelector('iframe[name="editor-canvas"]')?.contentDocument
					?.body || document.body;

			console.log("Applying theme colors to editor canvas:", canvas);

			canvas.style.setProperty("--page-theme-bg", activeTheme.bg);
			canvas.style.setProperty("--page-theme-text", activeTheme.text);
			canvas.style.setProperty("--page-theme-svg", svgColor || activeTheme.svg);
			canvas.style.setProperty(
				"--page-theme-is-dark",
				activeTheme.isDark ? "1" : "0",
			);
			canvas.style.setProperty(
				"--page-theme-is-light",
				activeTheme.isDark ? "0" : "1",
			);
		}, [theme, svgColor]);

		const onSelectImage = (media) => {
			setAttributes({
				imageUrl: media.url,
				imageId: media.id,
				imageAlt: media.alt,
			});
		};

		const blockProps = useBlockProps({
			className: `subpage-hero theme-${theme}`,
			style: { backgroundColor: activeTheme.bg, color: activeTheme.text },
		});

		return (
			<>
				{imageUrl && (
					<BlockControls>
						<MediaReplaceFlow
							mediaId={imageId}
							mediaURL={imageUrl}
							allowedTypes={["image"]}
							onSelect={onSelectImage}
							onReset={() =>
								setAttributes({ imageUrl: "", imageId: undefined, imageAlt: "" })
							}
						/>
					</BlockControls>
				)}
				<InspectorControls>
					<PanelBody title="Theme Selection">
						<SelectControl
							label="Hero Theme"
							value={theme}
							options={[
								{ label: "Default (Accent 1)", value: "default" },
								{ label: "Dark 1 (Dark Gray/Blue)", value: "dark_1" },
								{ label: "Dark 2 (Dark Gray/Yellow)", value: "dark_2" },
								{ label: "Light 1 (Light Yellow/Blue)", value: "light_1" },
								{ label: "Light 2 (Light Yellow/Yellow)", value: "light_2" },
							]}
							onChange={(value) => setAttributes({ theme: value })}
						/>
						<ToggleControl
							label="Flip Layout (Image on Left)"
							checked={reverseLayout}
							onChange={(value) => setAttributes({ reverseLayout: value })}
						/>
						<SelectControl
							label="Content Width"
							value={contentWidth}
							options={[
								{ label: "40%", value: 40 },
								{ label: "50%", value: 50 },
							]}
							onChange={(value) =>
								setAttributes({ contentWidth: Number(value) })
							}
						/>						
					</PanelBody>
					<PanelColorSettings
						title="SVG Color"
						colorSettings={[
							{
								value: svgColor,
								onChange: (value) => setAttributes({ svgColor: value }),
								label: "Override Theme Underline Color",
							},
						]}
					/>
					{imageUrl && (
						<PanelColorGradientSettings
							title="Image Overlay"
							settings={[
								{
									label: "Overlay",
									colorValue: overlayColor,
									gradientValue: overlayGradient,
									// Each handler sets only its own attribute: the control
									// already clears the other one itself (it calls
									// onGradientChange() right after onColorChange(value)
									// and vice versa), so clearing it here too would wipe
									// the value that was just picked.
									onColorChange: (value) =>
										setAttributes({ overlayColor: value }),
									// overlayGradient has a default, so clearing it to
									// undefined would bring the default back. Store ""
									// instead: it is saved, and means "no gradient".
									onGradientChange: (value) =>
										setAttributes({ overlayGradient: value ?? "" }),
									enableAlpha: true,
									clearable: true,
								},
							]}
							{...colorGradientSettings}
						>
							{(overlayColor || overlayGradient) && (
								<RangeControl
									label="Overlay Opacity"
									value={overlayOpacity}
									onChange={(value) =>
										setAttributes({ overlayOpacity: value })
									}
									min={0}
									max={100}
									step={5}
								/>
							)}
						</PanelColorGradientSettings>
					)}
				</InspectorControls>
				<div {...blockProps}>
					<div
						className={`flex flex-col py-12 mb-8 md:flex-row w-full gap-4 md:gap-2 m-auto md:items-stretch md:min-h-[65vh] md:max-h-187.5 ${
							reverseLayout ? "md:flex-row-reverse" : ""
						}`}
					>
						<div className={`w-full relative
							${ contentWidth === 50 ? "md:w-[50%]" : "md:w-[40%]"
							}`}
							>
							<div
								className={`md:relative z-9 ${
									reverseLayout ? "md:ml-auto" : "md:mr-auto"
								}`}
								style={{ isolation: "isolate" }}
							>
								<RichText
									tagName="p"
									value={tagline}
									onChange={(value) => setAttributes({ tagline: value })}
									placeholder="Tagline..."
									className="has-cas-red-ink-font-family text-5xl"
								/>
								<RichText
									tagName="h1"
									value={title}
									onChange={(value) => setAttributes({ title: value })}
									placeholder="Hero Title"
									className="text-pretty whitespace-nowrap"
								/>
								<RichText
									tagName="h2"
									value={subheader}
									onChange={(value) => setAttributes({ subheader: value })}
									placeholder="Optional subheader..."
								/>
								<div className="scale-125 -rotate-2">
									<UnderlineSVG color={svgColor || activeTheme.svg} />
								</div>
							</div>
							<div
								className={`mt-12 pt-5 subpage-hero__content ${
									reverseLayout ? "md:ml-7" : "md:mr-7"
								}`}
							>
								<InnerBlocks
									allowedBlocks={[
										"core/heading",
										"core/paragraph",
										"core/list",
										"create-block/my-handdrawn-button",
									]}
									template={[
										[
											"core/paragraph",
											{
												placeholder: "description goes here...",
											},
											"create-block/my-handdrawn-button",
											{
												placeholder: "CTA text",
												className: "mt-4",
											},
										],
									]}
								/>
							</div>
						</div>

						<div className="w-full h-[40vh] mt-0 md:h-auto md:flex-1 md:mt-24">
							{imageUrl ? (
								<div className="subpage-hero-image-wrapper h-full">
									<img
										src={imageUrl}
										alt={imageAlt}
										className="w-full h-full object-cover subpage-hero-image max-h-200"
									/>
									<ImageOverlay
										color={overlayColor}
										gradient={overlayGradient}
										opacity={overlayOpacity}
									/>
								</div>
							) : (
								<MediaPlaceholder
									onSelect={onSelectImage}
									allowedTypes={["image"]}
									multiple={false}
									labels={{ title: "Select Image" }}
								/>
							)}
						</div>
					</div>
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const {
			tagline,
			title,
			subheader,
			imageUrl,
			imageAlt,
			svgColor,
			theme,
			reverseLayout,
			contentWidth,
			overlayColor,
			overlayGradient,
			overlayOpacity,
		} = attributes;
		const activeTheme = THEMES[theme] || THEMES.default;

		const blockProps = useBlockProps.save({
			className: `subpage-hero theme-${theme}`,
			style: { backgroundColor: activeTheme.bg, color: activeTheme.text },
		});

		return (
			<div {...blockProps}>
				<style
					dangerouslySetInnerHTML={{
						__html: `
						:root {
							--page-theme-bg: ${activeTheme.bg};
							--page-theme-text: ${activeTheme.text};
							--page-theme-svg: ${svgColor || activeTheme.svg};
							--page-theme-is-dark: ${activeTheme.isDark ? "1" : "0"};
							--page-theme-is-light: ${activeTheme.isDark ? "0" : "1"};
						}
						body {
							background-color: var(--page-theme-bg);
							color: var(--page-theme-text);
						}
					`,
					}}
				/>
				<div
					className={`flex flex-col py-12 mb-8 md:flex-row w-full gap-4 md:gap-2 m-auto md:items-stretch md:min-h-[65vh] md:max-h-187.5 ${
						reverseLayout ? "md:flex-row-reverse" : ""
					}`}
				>
					<div className={`w-full relative ${ contentWidth === 50 ? "md:w-[50%]" : "md:w-[40%]" }`}>
						<div
							className={`md:relative z-9 ${
								reverseLayout ? "md:ml-auto" : "md:mr-auto"
							}`}
							style={{ isolation: "isolate" }}
						>
							{tagline && (
								<RichText.Content
									tagName="p"
									className="has-cas-red-ink-font-family text-5xl"
									value={tagline}
								/>
							)}
							<RichText.Content tagName="h1" value={title} />
							{subheader && <RichText.Content tagName="h2" value={subheader} />}
							<div className="scale-125 -rotate-2">
								<UnderlineSVG color={svgColor || activeTheme.svg} />
							</div>
						</div>
						<div
							className={`mt-12 pt-5 subpage-hero__content ${
								reverseLayout ? "md:ml-7" : "md:mr-7"
							}`}
						>
							<InnerBlocks.Content />
						</div>
					</div>

					<div className="w-full h-[40vh] mt-0 md:h-auto md:flex-1 md:mt-24">
						{imageUrl && (
							<div className="subpage-hero-image-wrapper h-full">
								<img
									src={imageUrl}
									alt={imageAlt}
									className="w-full h-full object-cover subpage-hero-image max-h-200"
								/>
								<ImageOverlay
									color={overlayColor}
									gradient={overlayGradient}
									opacity={overlayOpacity}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	},
});
