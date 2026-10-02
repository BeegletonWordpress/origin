/**
 * "Beegleton-paginering": a variation of the core Pagination block, so it
 * shows up in the block inserter (inside a Query Loop, where core only
 * allows Pagination) with the Beegleton style and inner blocks already set.
 * Same setup as the "Beegleton-paginering" pattern in my-custom-block.php;
 * the look comes from src/index.css (.is-style-beegleton).
 */
import { registerBlockVariation } from "@wordpress/blocks";

registerBlockVariation("core/query-pagination", {
	name: "beegleton",
	title: "Beegleton-paginering",
	description: "Sidnummer med föregående/nästa-pilar, centrerade.",
	keywords: ["pagination", "paginering", "sidor", "beegleton"],
	scope: ["inserter", "transform"],
	attributes: {
		paginationArrow: "chevron",
		showLabel: false,
		className: "is-style-beegleton",
		layout: { type: "flex", justifyContent: "center" },
	},
	innerBlocks: [
		["core/query-pagination-previous"],
		["core/query-pagination-numbers", { midSize: 1 }],
		["core/query-pagination-next"],
	],
	isActive: (attributes) =>
		(attributes.className || "").split(" ").includes("is-style-beegleton"),
});
