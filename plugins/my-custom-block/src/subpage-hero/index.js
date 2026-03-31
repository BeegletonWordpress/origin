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
	SelectControl,
	ToggleControl,
} from "@wordpress/components";
import { useEffect } from "@wordpress/element";
import metadata from "./block.json";
import "./style.css";
import "./editor.css";

import { UnderlineSVG } from "../handdrawn-header";

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
			title,
			content,
			imageUrl,
			imageAlt,
			svgColor,
			theme,
			reverseLayout,
		} = attributes;

		// Get active theme colors
		const activeTheme = THEMES[theme] || THEMES.default;

		useEffect(() => {
			const canvas =
				document.querySelector('iframe[name="editor-canvas"]')?.contentDocument
					?.body || document.body;

			// Broadcast Theme Variables to the Editor
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
				</InspectorControls>
				<div {...blockProps}>
					<div
						className={`flex flex-col py-12 mb-8 md:flex-row w-full gap-4 md:gap-2 m-auto md:items-stretch md:max-h-[65vh] ${
							reverseLayout ? "md:flex-row-reverse" : ""
						}`}
					>
						<div className="w-full md:w-[40%] relative">
							<div
								className={`md:relative ${
									reverseLayout ? "md:ml-auto" : "md:mr-auto"
								}`}
							>
								<RichText
									tagName="h1"
									className="wrap-anywhere"
									value={title}
									onChange={(value) => setAttributes({ title: value })}
									placeholder="Hero Title"
								/>
								<div className="scale-125 -rotate-2">
									<UnderlineSVG color={svgColor || activeTheme.svg} />
								</div>
							</div>
							<RichText
								tagName="div"
								className={`mt-12 pt-5 subpage-hero__content ${
									reverseLayout ? "md:ml-7" : "md:mr-7"
								}`}
								value={content}
								onChange={(value) => setAttributes({ content: value })}
								placeholder="Hero content text goes here..."
							/>
						</div>

						<div className="w-full md:flex-1">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={onSelectImage}
									allowedTypes={["image"]}
									value={attributes.imageId}
									render={({ open }) => (
										<div className="h-full relative group">
											{imageUrl ? (
												<>
													<img
														src={imageUrl}
														alt={imageAlt}
														className="w-full h-full object-cover mt-18"
													/>
													<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50">
														<Button
															onClick={open}
															variant="secondary"
															className="is-primary"
														>
															Replace Image
														</Button>
													</div>
												</>
											) : (
												<div className="flex items-center justify-center h-full bg-gray-100 border-2 border-dashed border-gray-300 min-h-75">
													<Button onClick={open} variant="secondary">
														Select Image
													</Button>
												</div>
											)}
										</div>
									)}
								/>
							</MediaUploadCheck>
						</div>
					</div>
					<InnerBlocks />
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const {
			title,
			content,
			imageUrl,
			imageAlt,
			svgColor,
			theme,
			reverseLayout,
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
					className={`flex flex-col py-12 mb-8 md:flex-row w-full gap-4 md:gap-2 m-auto md:items-stretch md:max-h-[65vh] ${
						reverseLayout ? "md:flex-row-reverse" : ""
					}`}
				>
					<div className="w-full md:w-[40%] relative">
						<div
							className={`md:relative ${
								reverseLayout ? "md:ml-auto" : "md:mr-auto"
							}`}
						>
							<RichText.Content
								tagName="h1"
								className="wrap-anywhere"
								value={title}
							/>
							<div className="scale-125 -rotate-2">
								<UnderlineSVG color={svgColor || activeTheme.svg} />
							</div>
						</div>
						<RichText.Content
							tagName="div"
							className={`mt-12 pt-5 subpage-hero__content ${
								reverseLayout ? "md:ml-7" : "md:mr-7"
							}`}
							value={content}
						/>
					</div>

					<div className="w-full md:flex-1 mt-18">
						{imageUrl && (
							<img
								src={imageUrl}
								alt={imageAlt}
								className="w-full h-full object-cover"
							/>
						)}
					</div>
				</div>
				<InnerBlocks.Content />
			</div>
		);
	},
});
