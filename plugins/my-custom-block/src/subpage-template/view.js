document.addEventListener("DOMContentLoaded", () => {
	// Only apply if subpage-template block exists on the page
	const subpageTemplate = document.querySelector(
		".wp-block-create-block-subpage-template"
	);

	if (!subpageTemplate) {
		return;
	}

	// Find the WordPress post content wrapper and remove padding
	const postContent = document.querySelector(
		".entry-content.wp-block-post-content.has-global-padding.is-layout-constrained.wp-block-post-content-is-layout-constrained"
	);

	if (postContent) {
		postContent.style.setProperty("padding-left", "0", "important");
		postContent.style.setProperty("padding-right", "0", "important");
	}
});