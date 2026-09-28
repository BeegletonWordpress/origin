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
import {
	getRowClasses,
	getColumnClasses,
	Overlay,
	BackgroundMedia,
} from "./components";
import { THEMES } from "../subpage-hero/themes";
import { UnderlineSVG } from "../handdrawn-header";
import "./style.css";
import "./editor.css";

const ALLOWED_MEDIA_TYPES = ["image", "video"];

const THEME_OPTIONS = [
	{ label: "Default (Accent 1)", value: "default" },
	{ label: "Dark 1 (Dark Gray/Blue)", value: "dark_1" },
	{ label: "Dark 2 (Dark Gray/Yellow)", value: "dark_2" },
	{ label: "Light 1 (Light Yellow/Blue)", value: "light_1" },
	{ label: "Light 2 (Light Yellow/Yellow)", value: "light_2" },
];

const INNER_BLOCKS_TEMPLATE = [
	["core/paragraph", { placeholder: "description goes here..." }],
];

// is-full-height is only added when the option is on, so heroes using the
// default height keep their original save() output.
const getHeroClasses = (theme, fullHeight) =>
	`subpage-video-hero theme-${theme}${fullHeight ? " is-full-height" : ""}`;

registerBlockType(metadata.name, {
	deprecated,
	edit: ({ attributes, setAttributes }) => {
		const {
			tagline,
			title,
			subheader,
			mediaUrl,
			mediaId,
			mediaType,
			svgColor,
			theme,
			contentWidth,
			fullHeight,
			overlayColor,
			overlayGradient,
			overlayOpacity,
		} = attributes;

		const activeTheme = THEMES[theme] || THEMES.default;
		const colorGradientSettings = useMultipleOriginColorsAndGradients();

		// Same as Subpage Hero: the theme also drives the editor canvas colours.
		useEffect(() => {
			const canvas =
				document.querySelector('iframe[name="editor-canvas"]')?.contentDocument
					?.body || document.body;

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

		const onSelectMedia = (media) => {
			setAttributes({
				mediaUrl: media.url,
				mediaId: media.id,
				mediaAlt: media.alt,
				mediaType: media.type === "video" ? "video" : "image",
			});
		};

		const blockProps = useBlockProps({
			className: getHeroClasses(theme, fullHeight),
			style: { backgroundColor: activeTheme.bg, color: activeTheme.text },
		});

		return (
			<>
				{mediaUrl && (
					<BlockControls>
						<MediaReplaceFlow
							mediaId={mediaId}
							mediaURL={mediaUrl}
							allowedTypes={ALLOWED_MEDIA_TYPES}
							onSelect={onSelectMedia}
							onReset={() =>
								setAttributes({
									mediaUrl: undefined,
									mediaId: undefined,
									mediaAlt: undefined,
									mediaType: undefined,
								})
							}
						/>
					</BlockControls>
				)}
				<InspectorControls>
					<PanelBody title="Theme Selection">
						<SelectControl
							label="Hero Theme"
							value={theme}
							options={THEME_OPTIONS}
							onChange={(value) => setAttributes({ theme: value })}
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
						<ToggleControl
							label="Full screen height"
							help="Fill the whole screen height instead of the standard hero height."
							checked={!!fullHeight}
							onChange={(value) => setAttributes({ fullHeight: value })}
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
					<PanelColorGradientSettings
						title="Background Overlay"
						settings={[
							{
								label: "Overlay",
								colorValue: overlayColor,
								gradientValue: overlayGradient,
								// Each handler sets only its own attribute: the control
								// clears the other one itself. overlayGradient has a
								// default, so a cleared gradient is stored as "".
								onColorChange: (value) =>
									setAttributes({ overlayColor: value }),
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
								onChange={(value) => setAttributes({ overlayOpacity: value })}
								min={0}
								max={100}
								step={5}
							/>
						)}
					</PanelColorGradientSettings>
				</InspectorControls>
				<div {...blockProps}>
					{mediaUrl ? (
						<div className="subpage-video-hero__media">
							<BackgroundMedia url={mediaUrl} type={mediaType} />
							<Overlay
								color={overlayColor}
								gradient={overlayGradient}
								opacity={overlayOpacity}
							/>
						</div>
					) : (
						// In flow above the content (not in the media layer, which
						// sits behind the content row and can't be clicked).
						<MediaPlaceholder
							onSelect={onSelectMedia}
							allowedTypes={ALLOWED_MEDIA_TYPES}
							multiple={false}
							labels={{ title: "Select background video or image" }}
						/>
					)}
					<div className={getRowClasses()}>
						<div className={getColumnClasses(contentWidth)}>
							<div className="md:relative z-9 md:mr-auto" style={{ isolation: "isolate" }}>
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
							<div className="mt-12 pt-5 subpage-video-hero__content md:mr-7">
								<InnerBlocks
									template={INNER_BLOCKS_TEMPLATE}
								/>
							</div>
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
			mediaUrl,
			mediaType,
			svgColor,
			theme,
			contentWidth,
			fullHeight,
			overlayColor,
			overlayGradient,
			overlayOpacity,
		} = attributes;
		const activeTheme = THEMES[theme] || THEMES.default;

		const blockProps = useBlockProps.save({
			className: getHeroClasses(theme, fullHeight),
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
				{mediaUrl && (
					<div className="subpage-video-hero__media" aria-hidden="true">
						<BackgroundMedia url={mediaUrl} type={mediaType} />
						<Overlay
							color={overlayColor}
							gradient={overlayGradient}
							opacity={overlayOpacity}
						/>
					</div>
				)}
				<div className={getRowClasses()}>
					<div className={getColumnClasses(contentWidth)}>
						<div className="md:relative z-9 md:mr-auto" style={{ isolation: "isolate" }}>
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
						<div className="mt-12 pt-5 subpage-video-hero__content md:mr-7">
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			</div>
		);
	},
});
