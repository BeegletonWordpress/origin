/**
 * Earlier saved versions of the SVG Background Container. Keep them
 * verbatim: any change to their attributes or save() output makes the
 * content they describe invalid again.
 */
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { cloneElement } from "@wordpress/element";
import { TEAM_BACKGROUND_SVG } from "../constants";

/**
 * v1: the shape was absolutely positioned (so it didn't give the container
 * any height) and the inner blocks sat directly in the wrapper, which had
 * the layout support.
 */
// Older containers didn't default to full width; make them full width.
const migrate = (attributes) => ({
	...attributes,
	align: attributes.align ?? "full",
});

const ATTRIBUTES = {
	svgColor: {
		type: "string",
		default: "#edb239",
	},
	showOnMobile: {
		type: "boolean",
		default: false,
	},
};

/**
 * v2: the shape and content were stacked in a grid cell (as now), but the
 * block had no layout support; the content div carried a hardcoded
 * is-layout-constrained class instead, and align had no default.
 */
const v2 = {
	attributes: ATTRIBUTES,
	supports: {
		html: false,
		anchor: true,
		align: ["wide", "full"],
		spacing: {
			margin: true,
			padding: true,
		},
		color: {
			background: true,
			gradients: true,
			text: true,
		},
	},
	migrate,
	save: ({ attributes }) => {
		const { svgColor, showOnMobile } = attributes;

		const blockProps = useBlockProps.save({ className: "relative isolate" });
		const innerBlocksProps = useInnerBlocksProps.save({
			className: "svg-background-container__content is-layout-constrained",
		});

		return (
			<div {...blockProps}>
				<div
					className={`svg-background-container__bg ${
						showOnMobile ? "" : "hidden md:block"
					}`}
					aria-hidden="true"
				>
					{cloneElement(TEAM_BACKGROUND_SVG, { style: { color: svgColor } })}
				</div>
				<div {...innerBlocksProps} />
			</div>
		);
	},
};

/**
 * v3: had an optional paint-in animation (paintAnimation attribute, which
 * added an is-paint-animated class to the shape). The animation was
 * removed; only containers saved with it turned on need this.
 */
const v3 = {
	attributes: {
		align: {
			type: "string",
			default: "full",
		},
		...ATTRIBUTES,
		paintAnimation: {
			type: "boolean",
			default: false,
		},
	},
	supports: {
		html: false,
		anchor: true,
		align: ["wide", "full"],
		layout: {
			default: {
				type: "constrained",
			},
		},
		spacing: {
			margin: true,
			padding: true,
		},
		color: {
			background: true,
			gradients: true,
			text: true,
		},
	},
	migrate: ({ paintAnimation, ...attributes }) => attributes,
	save: ({ attributes }) => {
		const { svgColor, showOnMobile, paintAnimation } = attributes;

		const blockProps = useBlockProps.save({ className: "relative isolate" });
		const innerBlocksProps = useInnerBlocksProps.save({
			className: "svg-background-container__content",
		});

		return (
			<div {...blockProps}>
				<div
					className={`svg-background-container__bg${
						paintAnimation ? " is-paint-animated" : ""
					} ${showOnMobile ? "" : "hidden md:block"}`}
					aria-hidden="true"
				>
					{cloneElement(TEAM_BACKGROUND_SVG, { style: { color: svgColor } })}
				</div>
				<div {...innerBlocksProps} />
			</div>
		);
	},
};

const v1 = {
	attributes: {
		svgColor: {
			type: "string",
			default: "#edb239",
		},
		showOnMobile: {
			type: "boolean",
			default: false,
		},
	},
	migrate,
	supports: {
		html: false,
		anchor: true,
		align: ["wide", "full"],
		layout: {
			default: {
				type: "constrained",
			},
		},
		spacing: {
			margin: true,
			padding: true,
		},
		color: {
			background: true,
			text: true,
		},
	},
	save: ({ attributes }) => {
		const { svgColor, showOnMobile } = attributes;

		const { children, ...innerBlocksProps } = useInnerBlocksProps.save(
			useBlockProps.save({ className: "relative isolate" }),
		);

		return (
			<div {...innerBlocksProps}>
				<div
					className={`svg-background-container__bg absolute max-w-375 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[135%] -z-10 pointer-events-none ${
						showOnMobile ? "" : "hidden md:block"
					}`}
					aria-hidden="true"
				>
					{cloneElement(TEAM_BACKGROUND_SVG, { style: { color: svgColor } })}
				</div>
				{children}
			</div>
		);
	},
};

export default [v3, v2, v1];
