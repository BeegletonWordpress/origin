/**
 * Earlier saved versions of the Subpage Video Hero. Keep them verbatim: any
 * change to their attributes or save() output makes the content they
 * describe invalid again.
 */
import { InnerBlocks, RichText, useBlockProps } from "@wordpress/block-editor";
import { THEMES } from "../subpage-hero/themes";
import { UnderlineSVG } from "../handdrawn-header";
import {
	getRowClasses,
	getColumnClasses,
	Overlay,
	BackgroundMedia,
} from "./components";

/**
 * v1: align had no default, and the block was always full-bleed through
 * CSS. Migrate to align "full" so those heroes keep looking the same.
 */
const v1 = {
	attributes: {
		"tagline": {
			"type": "string",
			"source": "html",
			"selector": "p"
		},
		"title": {
			"type": "string",
			"source": "html",
			"selector": "h1",
			"default": "Subpage Video Hero"
		},
		"subheader": {
			"type": "string",
			"source": "html",
			"selector": "h2"
		},
		"mediaUrl": {
			"type": "string"
		},
		"mediaId": {
			"type": "number"
		},
		"mediaAlt": {
			"type": "string"
		},
		"mediaType": {
			"type": "string"
		},
		"svgColor": {
			"type": "string"
		},
		"theme": {
			"type": "string",
			"default": "dark_1"
		},
		"contentWidth": {
			"type": "number",
			"default": 40
		},
		"overlayColor": {
			"type": "string"
		},
		"overlayGradient": {
			"type": "string",
			"default": "linear-gradient(135deg,rgba(0,0,0,0.9) 32%,rgba(0,0,0,0) 61%)"
		},
		"overlayOpacity": {
			"type": "number",
			"default": 80
		}
	},
	supports: {
		"html": false,
		"align": [
			"full",
			"wide"
		],
		"spacing": {
			"margin": true,
			"padding": true
		},
		"color": {
			"background": true,
			"text": true
		},
		"typography": {
			"fontSize": true,
			"lineHeight": true
		}
	},
	migrate: (attributes) => ({
		...attributes,
		align: attributes.align ?? "full",
	}),
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
			overlayColor,
			overlayGradient,
			overlayOpacity,
		} = attributes;
		const activeTheme = THEMES[theme] || THEMES.default;

		const blockProps = useBlockProps.save({
			className: `subpage-video-hero theme-${theme}`,
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
};

export default [v1];
