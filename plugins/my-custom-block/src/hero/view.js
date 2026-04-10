document.addEventListener("DOMContentLoaded", () => {
	/* 	// Prevent multiple instances
	if (window.lenis) {
		console.log("Lenis is already initialized.");
		return;
	}
 */
	console.log("Initializing Lenis for hero block...");

	window.lenis = new Lenis({ autoRaf: true });
	lenis.on("scroll", () => {
		const scroll = lenis.animatedScroll;
		document.querySelectorAll(".hero-left-col").forEach((el) => {
			el.style.transform = `translateY(${scroll * -0.5}px)`;
		});

		document
			.querySelectorAll(".wp-block-my-custom-block-animation-arrow")
			.forEach((block) => {
				block.style.transform = `translateY(${scroll * 0.2}px)`;
			});
	});
});
