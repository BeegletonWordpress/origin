document.addEventListener("DOMContentLoaded", () => {
	const altSubpageHeroBlocks = document.querySelectorAll(
		".wp-block-create-block-alt-subpage-hero",
	);

	if (!altSubpageHeroBlocks.length) {
		return;
	}

	function renderRingSVG(block) {
		const placeholder = block.querySelector(".ring-svg-placeholder");
		if (!placeholder) {
			return;
		}

		const color = placeholder.getAttribute("data-svg-color") || "inherit";

		const svgHTML = `
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 -35 1900 1100"
				fill="none"
				preserveAspectRatio="none"
				class="absolute inset-0 w-full h-full z-0 translate-x-7 translate-y-4 scale-x-110"
				style="
					transform: scale(1, 1.2) translate(-4rem, -0.5rem);
					transform-origin: center;
					color: ${color};
				"
			>
				<path
					class="handdrawn-ring-path"
					d="M5.5,734.24c307.43,288.64,759.05,329.99,1162.15,295.3,220.98-10.71,500.24-80.84,565.56-320.92,30.56-120.89-16.83-248.57-83.26-354.1C1487.37,80.33,1186.66-34.72,876.38,17.93c-194.44,31.53-375.56,120.36-540.22,228.48-66.98,43.99-132.74,92.25-181.6,155.77-166.29,221.37-15.34,411.99,212.05,502.42,382.29,161.75,825.48,163.63,1216.78,25.06,342.38-109.93,399.02-378.98,136.04-625.88-173.37-152.27-416.93-221.11-644.37-182.11"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="25"
				/>
			</svg>
		`;

		placeholder.innerHTML = svgHTML;
	}

	altSubpageHeroBlocks.forEach((block) => {
		renderRingSVG(block);
	});

	function animateRingDraw() {
		altSubpageHeroBlocks.forEach((block) => {
			const path = block.querySelector(".handdrawn-ring-path");
			if (!path || path.dataset.drawn === "true") {
				return;
			}

			const actualLength = path.getTotalLength ? path.getTotalLength() : 2400;

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

	animateRingDraw();
});
