document.addEventListener("DOMContentLoaded", () => {
	const arrows = document.querySelectorAll(
		".animated-arrow-svg-container .curvy-arrow-svg",
	);

	if (!arrows.length) return;

	arrows.forEach((svg) => {
		const path = svg.querySelector(".curvy-arrow-path");
		if (!path) return;

		const pathLength = path.getTotalLength();
		path.style.strokeDasharray = pathLength;
		path.style.strokeDashoffset = pathLength;
		path.dataset.pathLength = pathLength;
		path.dataset.initialTop =
			svg.closest(".animated-arrow-svg-container").getBoundingClientRect().top +
			window.scrollY;
	});

	if (!window.lenis) {
		console.log("Lenis not initialized, skipping arrow animation");
		return;
	}

	function animateDraw() {
		arrows.forEach((svg) => {
			const path = svg.querySelector(".curvy-arrow-path");
			if (!path || path.dataset.drawn === "true") return;

			const pathLength = parseFloat(path.dataset.pathLength);
			const startTime = performance.now();
			const duration = 5000;

			function draw(currentTime) {
				const elapsed = currentTime - startTime;
				const progress = Math.min(elapsed / duration, 1);
				const eased = 1 - Math.pow(1 - progress, 3);

				path.style.strokeDashoffset = pathLength * (1 - eased);

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

	window.lenis.on("scroll", () => {
		const scrollY = window.lenis.animatedScroll;

		arrows.forEach((svg) => {
			const path = svg.querySelector(".curvy-arrow-path");
			if (!path || path.dataset.drawn !== "true") return;

			const initialTop = parseFloat(path.dataset.initialTop);
			const fadeStart = initialTop - window.innerHeight * 0.5;
			const fadeEnd = initialTop - window.innerHeight * 1.5;

			let opacity = 1;
			if (scrollY > fadeStart) {
				const progress = Math.min(
					(scrollY - fadeStart) / (fadeEnd - fadeStart),
					1,
				);
				opacity = 1 - progress;
			}

			svg.style.opacity = opacity;

			console.log(
				"Animating arrow fade, scrollY:",
				scrollY,
				"initialTop:",
				initialTop,
				"opacity:",
				opacity,
			);
		});
	});
});
