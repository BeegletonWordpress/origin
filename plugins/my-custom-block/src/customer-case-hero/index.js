import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	InnerBlocks,
	RichText,
	InspectorControls,
	PanelColorSettings,
} from "@wordpress/block-editor";
import { PostTitle } from "@wordpress/editor";
import {
	PanelBody,
	CheckboxControl,
	SelectControl,
	ToggleControl,
} from "@wordpress/components";
import { useEntityProp, store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
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

// Service Tagline options are admin-managed (Kundcase > Case Taglines)
// instead of hardcoded, so new ones can be added without a code change.
// window.mcbCaseTaglines is localized by
// mcb_localize_case_taglines_for_editor() in
// includes/case-tagline-settings.php; the fallback list only matters if
// that inline script somehow didn't run (e.g. outside a real editor load).
const FALLBACK_CASE_TAGLINES = [
	"Marknadsstrategi & Position",
	"Identitet & Varumärke",
	"Workshop & Strategiarbete",
	"Webbutveckling & Design",
	"Designsystem & UX",
	"Content & Filmproduktion",
	"Performance Marketing",
	"Mäss- & Eventmaterial",
	"SEO & GEO Anpassat Innehåll",
];

const taglineOptions = [
	{ label: "Välj en tjänst...", value: "" },
	...(window.mcbCaseTaglines || FALLBACK_CASE_TAGLINES).map(
		(tagline) => ({ label: tagline, value: tagline }),
	),
];

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const { imageUrl, imageAlt, svgColor, reverseLayout } = attributes;

		const [meta, setMeta] = useEntityProp("postType", "customer_case", "meta");
		const theme = meta?.hero_theme || "default";

		const [assignedCategoryIds, setAssignedCategoryIds] = useEntityProp(
			"postType",
			"customer_case",
			"case-categories",
		);
		const categoryIds = assignedCategoryIds || [];

		const categories = useSelect(
			(select) =>
				select(coreStore).getEntityRecords("taxonomy", "customer_case_category", {
					per_page: -1,
					hide_empty: false,
					orderby: "name",
					order: "asc",
				}),
			[],
		);

		const tags = (categories || []).filter((category) =>
			categoryIds.includes(category.id),
		);

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

		const toggleCategory = (categoryId, checked) => {
			setAssignedCategoryIds(
				checked
					? [...categoryIds, categoryId]
					: categoryIds.filter((id) => id !== categoryId),
			);
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
							onChange={(value) => setMeta({ ...meta, hero_theme: value })}
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
						{(categories || []).map((category) => (
							<CheckboxControl
								key={category.id}
								label={category.name}
								checked={categoryIds.includes(category.id)}
								onChange={(checked) => toggleCategory(category.id, checked)}
							/>
						))}
					</PanelBody>
					<PanelBody title="Content Settings">
						<SelectControl
							label="Service Tagline"
							value={meta?.hero_tagline || ""}
							options={taglineOptions}
							onChange={(val) => setMeta({ ...meta, hero_tagline: val })}
						/>
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
					<div
						className={`flex flex-col pt-16 pb-12 mb-8 xl:flex-row w-full justify-between gap-10 m-auto md:items-stretch md:max-h-187.5 ${
							reverseLayout ? "md:flex-row-reverse" : ""
						}`}
					>
						<div className="w-full md:w-[50%] flex-1 relative flex flex-col justify-center">
							<div
								className={`md:relative z-9 flex flex-col justify-center ${
									reverseLayout ? "md:ml-auto" : "md:mr-auto"
								}`}
								style={{ isolation: "isolate" }}
							>
								<p className="has-cas-red-ink-font-family text-5xl z-10 relative">
									{meta?.hero_tagline || "Tagline goes here..."}
								</p>
								<PostTitle className="text-pretty whitespace-nowrap z-10 relative" />
								<div
									className="ring-svg-placeholder"
									data-svg-color={svgColor || activeTheme.svg}
								/>
							</div>
							{tags.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-8 z-10 relative">
									{tags.map((category) => (
										<span
											key={category.id}
											className="border border-current/50 px-3 py-1 uppercase italic text-[0.75rem]"
										>
											{category.name}
										</span>
									))}
								</div>
							)}
						</div>

						<div className="w-full h-fit max-h-[40vh] flex flex-col justify-start md:justify-center mt-0 max-w-128.75">
							<RichText
								tagName="div"
								multiline="p"
								className="customer-case-hero__excerpt mt-4"
								value={meta?.hero_body_text || ""}
								onChange={(value) => setMeta({ ...meta, hero_body_text: value })}
								placeholder="Write the case summary here…"
							/>
						</div>
					</div>
				</div>
			</>
		);
	},
	save: () => <InnerBlocks.Content />,
});
