import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	InnerBlocks,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	PanelColorSettings,
} from "@wordpress/block-editor";
import {
	Button,
	PanelBody,
	PanelRow,
	TextControl,
	SelectControl,
	ToggleControl,
} from "@wordpress/components";
import { useEffect } from "@wordpress/element";
import metadata from "./block.json";
import "./style.css";
import "./editor.css";

import { SmallRingShapeSVG } from "../handdrawn-header";

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
		const {
			tagline,
			title,
			tags,
			imageUrl,
			imageAlt,
			svgColor,
			theme,
			reverseLayout,
		} = attributes;

		const activeTheme = THEMES[theme] || THEMES.default;

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

		const addTag = () => {
			setAttributes({ tags: [...tags, ""] });
		};

		const removeTag = (index) => {
			const newTags = [...tags];
			newTags.splice(index, 1);
			setAttributes({ tags: newTags });
		};

		const updateTag = (index, value) => {
			const newTags = [...tags];
			newTags[index] = value;
			setAttributes({ tags: newTags });
		};

		const blockProps = useBlockProps({
			className: `customer-case-hero theme-${theme}`,
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
					<PanelBody title="Tags">
						{tags.map((tag, index) => (
							<PanelRow key={index}>
								<div className="flex gap-2 w-full">
									<TextControl
										value={tag}
										onChange={(value) => updateTag(index, value)}
										placeholder={`Tag ${index + 1}`}
										className="flex-1"
									/>
									<Button
										onClick={() => removeTag(index)}
										icon="no-alt"
										className="components-tab-button"
									/>
								</div>
							</PanelRow>
						))}
						<Button onClick={addTag} variant="secondary" className="mt-2">
							Add Tag
						</Button>
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
					<div
						className={`flex flex-col pt-16 pb-12 mb-8 md:flex-row w-full justify-between gap-10 m-auto md:items-stretch md:max-h-187.5 ${
							reverseLayout ? "md:flex-row-reverse" : ""
						}`}
					>
						<div className="w-full md:w-[40%] relative flex flex-col justify-center">
							<div
								className={`md:relative z-9 flex flex-col justify-center ${
									reverseLayout ? "md:ml-auto" : "md:mr-auto"
								}`}
								style={{ isolation: "isolate" }}
							>
								{tagline && (
									<RichText
										tagName="p"
										value={tagline}
										onChange={(value) => setAttributes({ tagline: value })}
										placeholder="Tagline..."
										className="has-cas-red-ink-font-family text-5xl z-10 relative"
									/>
								)}
								<RichText
									tagName="h1"
									value={title}
									onChange={(value) => setAttributes({ title: value })}
									placeholder="Hero Title"
									className="text-pretty whitespace-nowrap z-10 relative"
								/>
								<SmallRingShapeSVG color={svgColor || activeTheme.svg} />
							</div>
							{tags.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-8 z-10 relative">
									{tags.map((tag, index) => (
										<span
											key={index}
											className="border border-current/50 px-3 py-1 uppercase italic text-[0.75rem]"
										>
											{tag}
										</span>
									))}
								</div>
							)}
						</div>

						<div className="w-full h-[40vh] flex flex-col justify-center mt-0 max-w-128.75">
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
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const {
			tagline,
			title,
			tags,
			imageUrl,
			imageAlt,
			svgColor,
			theme,
			reverseLayout,
		} = attributes;
		const activeTheme = THEMES[theme] || THEMES.default;

		const blockProps = useBlockProps.save({
			className: `customer-case-hero theme-${theme}`,
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
					className={`flex flex-col pt-16 pb-12 mb-8 md:flex-row w-full justify-between gap-10 m-auto md:items-stretch md:max-h-187.5 ${
						reverseLayout ? "md:flex-row-reverse" : ""
					}`}
				>
					<div className="w-full md:w-[40%] relative flex flex-col justify-center">
						<div
							className={`md:relative z-9 ${
								reverseLayout ? "md:ml-auto" : "md:mr-auto"
							}`}
							style={{ isolation: "isolate" }}
						>
							{tagline && (
								<RichText.Content
									tagName="p"
									className="has-cas-red-ink-font-family text-5xl z-10 relative"
									value={tagline}
								/>
							)}
							<RichText.Content
								tagName="h1"
								value={title}
								className="z-10 relative"
							/>
							<SmallRingShapeSVG color={svgColor || activeTheme.svg} />
						</div>
						{tags.length > 0 && (
							<div className="flex flex-wrap gap-2 mt-8 z-10 relative">
								{tags.map((tag, index) => (
									<span
										key={index}
										className="border border-current/50 px-3 py-1 uppercase italic text-[0.75rem]"
									>
										{tag}
									</span>
								))}
							</div>
						)}
					</div>

					<div className="w-full h-[40vh] flex flex-col justify-center mt-0 max-w-128.75">
						{imageUrl && (
							<div className="customer-case-hero-content">
								<InnerBlocks.Content />
							</div>
						)}
					</div>
				</div>
			</div>
		);
	},
});
