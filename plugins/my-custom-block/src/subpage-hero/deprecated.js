/**
 * Earlier saved versions of the Subpage Hero. Keep them verbatim: any change
 * to their attributes or save() output makes the content they describe
 * invalid again.
 */
import { InnerBlocks, RichText, useBlockProps } from "@wordpress/block-editor";
import { UnderlineSVG } from "../handdrawn-header";
import { THEMES } from "./themes";
import metadata from "./block.json";

const SUPPORTS = {
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
};

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

/**
 * v1: before the default gradient overlay. overlayGradient had no default
 * and overlayOpacity defaulted to 50. Also matches heroes saved before the
 * overlay existed at all, since save() only emits the overlay when one is set.
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
			"default": "Subpage Hero"
		},
		"subheader": {
			"type": "string",
			"source": "html",
			"selector": "h2"
		},
		"imageUrl": {
			"type": "string",
			"default": "https://beegleton-dev.local/wp-content/uploads/2026/03/Rectangle-4.png"
		},
		"imageAlt": {
			"type": "string",
			"default": "Subpage Hero Image"
		},
		"imageId": {
			"type": "number"
		},
		"svgColor": {
			"type": "string"
		},
		"theme": {
			"type": "string",
			"default": "default"
		},
		"reverseLayout": {
			"type": "boolean",
			"default": false
		},
		"contentWidth": {
			"type": "number",
			"default": 40
		},
		"overlayColor": {
			"type": "string"
		},
		"overlayGradient": {
			"type": "string"
		},
		"overlayOpacity": {
			"type": "number",
			"default": 50
		}
	},
	supports: SUPPORTS,
	migrate: (attributes) => {
		const { overlayColor, overlayGradient, overlayOpacity, ...rest } =
			attributes;

		// No overlay yet: give it the new default gradient and opacity. They
		// have to be set explicitly, because WordPress doesn't re-apply the
		// current attribute defaults to migrated attributes.
		if (!overlayColor && !overlayGradient) {
			return {
				...rest,
				overlayGradient: metadata.attributes.overlayGradient.default,
				overlayOpacity: metadata.attributes.overlayOpacity.default,
			};
		}

		return {
			...rest,
			overlayColor,
			// A solid colour must not be overridden by the new default gradient.
			overlayGradient: overlayGradient || "",
			overlayOpacity: overlayOpacity ?? 50,
		};
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
	}
};

export default [v1];
