document.addEventListener("DOMContentLoaded", () => {
	const VISIBLE_LENGTH = 500;

	const subpageHeroBlocks = document.querySelectorAll(
		".wp-block-create-block-subpage-hero",
	);

	if (!subpageHeroBlocks.length) return;

	subpageHeroBlocks.forEach((block) => {
		const svg = block.querySelector(".handdrawn-underline-svg");
		if (!svg) return;

		const path = svg.querySelector(".handdrawn-underline-path");
		if (!path) return;

		const actualLength = path.getTotalLength
			? path.getTotalLength()
			: VISIBLE_LENGTH;

		path.style.strokeDasharray = actualLength;
		path.style.strokeDashoffset = actualLength;
		path.style.fill = "none";
	});

	function animateDraw() {
		subpageHeroBlocks.forEach((block) => {
			const path = block.querySelector(".handdrawn-underline-path");
			if (!path || path.dataset.drawn === "true") return;

			const actualLength = path.getTotalLength
				? path.getTotalLength()
				: VISIBLE_LENGTH;

			path.style.strokeDasharray = actualLength;
			path.style.strokeDashoffset = actualLength;

			const startTime = performance.now();
			const duration = 1000;

			function draw(currentTime) {
				const elapsed = currentTime - startTime;
				const progress = Math.min(elapsed / duration, 1);
				const eased =
					progress < 0.5
						? 4 * progress * progress * progress
						: 1 - Math.pow(-2 * progress + 2, 3) / 2;

				path.style.strokeDashoffset = actualLength * (1 - eased);

				if (progress < 1) {
					requestAnimationFrame(draw);
				} else {
					path.dataset.drawn = "true";
				}
			}

			requestAnimationFrame(draw);
		});
	}

	animateDraw();
});
