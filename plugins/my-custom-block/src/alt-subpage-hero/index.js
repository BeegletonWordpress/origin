import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	InnerBlocks,
	RichText,
	InspectorControls,
	PanelColorSettings,
} from "@wordpress/block-editor";
import { PanelBody, SelectControl, ToggleControl } from "@wordpress/components";
import { useEffect } from "@wordpress/element";
import metadata from "./block.json";
import "./style.css";
import "./editor.css";

const THEMES = {
	default: {
		bg: "var(--wp--preset--color--accent-1)",
		text: "#3B3632",
		svg: "#FDF0DB",
		isDark: false,
	},
	dark_1: {
		bg: "#3B3632",
		text: "#FDF0DB",
		svg: "#BBC7E7",
		isDark: true,
	},
	dark_2: {
		bg: "#3B3632",
		text: "#FDF0DB",
		svg: "#EEB137",
		isDark: true,
	},
	light_1: {
		bg: "#FDF0DB",
		text: "#3B3632",
		svg: "#4A6397",
		isDark: false,
	},
	light_2: {
		bg: "#FDF0DB",
		text: "#3B3632",
		svg: "#EEB137",
		isDark: false,
	},
};

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const { tagline, title, svgColor, theme, reverseLayout, showRightColumn } =
			attributes;

		const activeTheme = THEMES[theme] || THEMES.default;

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

		const blockProps = useBlockProps({
			className: `alt-subpage-hero theme-${theme}`,
			style: { backgroundColor: activeTheme.bg, color: activeTheme.text },
		});

		return (
			<>
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
						<ToggleControl
							label="Show Right Column"
							checked={showRightColumn}
							onChange={(value) => setAttributes({ showRightColumn: value })}
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
				</InspectorControls>
				<div {...blockProps}>
					<div
						className={`flex flex-col py-12 mb-8 md:flex-row w-full h-fit gap-4 md:gap-2 m-auto items-center ${
							reverseLayout ? "md:flex-row-reverse" : ""
						}`}
					>
						{/* Left Column - Header */}
						<div
							className={`relative h-fit ${
								showRightColumn ? "w-full md:w-[60%]" : "w-full"
							}`}
						>
							<div
								className={`md:relative z-9 ${
									reverseLayout ? "md:ml-auto" : "md:mr-auto"
								} ${!showRightColumn ? "text-center mx-auto" : ""}`}
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
								<div
									className="ring-svg-placeholder"
									data-svg-color={svgColor || activeTheme.svg}
									style={{
										position: "absolute",
										inset: 0,
										width: "100%",
										height: "100%",
										zIndex: 0,
									}}
								></div>
							</div>
						</div>

						{/* Right Column - Only if showRightColumn is true */}
						{showRightColumn && (
							<div className="w-full h-fit mt-0 md:h-auto md:flex-1">
								<InnerBlocks
									allowedBlocks={[
										"core/heading",
										"core/paragraph",
										"core/list",
										"core/image",
										"core/cover",
										"core/group",
										"core/button",
										"core/buttons",
										"core/spacer",
										"core/separator",
										"create-block/my-handdrawn-button",
										"create-block/contact-info",
									]}
									template={[
										[
											"core/paragraph",
											{
												placeholder: "Description goes here...",
											},
										],
										[
											"create-block/my-handdrawn-button",
											{
												placeholder: "CTA text",
												className: "mt-4",
											},
										],
									]}
								/>
							</div>
						)}
					</div>
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const { tagline, title, svgColor, theme, reverseLayout, showRightColumn } =
			attributes;

		const activeTheme = THEMES[theme] || THEMES.default;

		const blockProps = useBlockProps.save({
			className: `alt-subpage-hero theme-${theme} flex items-center`,
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
					className={`flex flex-col py-12 mb-8 md:flex-row w-full h-fit gap-4 md:gap-2 m-auto items-center ${
						reverseLayout ? "md:flex-row-reverse" : ""
					}`}
				>
					{/* Left Column - Header */}
					<div
						className={`relative h-fit ${
							showRightColumn ? "w-full md:w-[60%]" : "w-full"
						}`}
					>
						<div
							className={`md:relative z-9 ${
								reverseLayout ? "md:ml-auto" : "md:mr-auto"
							} ${!showRightColumn ? "text-center mx-auto" : ""}`}
							style={{ isolation: "isolate" }}
						>
							{tagline && (
								<RichText.Content
									tagName="p"
									value={tagline}
									className="has-cas-red-ink-font-family text-5xl relative z-10"
								/>
							)}
							<RichText.Content
								tagName="h1"
								value={title}
								className="relative z-10"
							/>
							<div
								className="ring-svg-placeholder"
								data-svg-color={svgColor || activeTheme.svg}
								style={{
									position: "absolute",
									inset: 0,
									width: "100%",
									height: "100%",
									zIndex: 0,
								}}
							></div>
						</div>
					</div>

					{/* Right Column - Only if showRightColumn is true */}
					{showRightColumn && (
						<div className="w-full h-[40vh] mt-0 md:h-auto md:flex-1">
							<InnerBlocks.Content />
						</div>
					)}
				</div>
			</div>
		);
	},
});
