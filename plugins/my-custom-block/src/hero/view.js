document.addEventListener("DOMContentLoaded", () => {
	const desktopQuery = window.matchMedia("(min-width: 1024px)");

	if (!desktopQuery.matches) {
		return;
	}

	if (!window.lenis) {
		return;
	}

	window.lenis.on("scroll", () => {
		const scroll = window.lenis.animatedScroll;

		document.querySelectorAll(".hero-left-col").forEach((el) => {
			el.style.transform = `translateY(${scroll * -0.5}px)`;
		});
	});
});