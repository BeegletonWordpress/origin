/**
 * Simple throttle function to limit the rate of execution.
 */
function throttle(func, limit) {
	let inThrottle;
	return function (...args) {
		if (!inThrottle) {
			func.apply(this, args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
}

const header = document.querySelector(".wp-block-create-block-my-header-block");

if (header) {
	let lastScrollY = window.scrollY;

	const handleScroll = () => {
		const scrollY = window.scrollY;
		const isScrolled = header.classList.contains("is-scrolled");

		// Use hysteresis with a larger gap to prevent flashing.
		// Add at 80px, remove at 30px.
		if (!isScrolled && scrollY > 80) {
			requestAnimationFrame(() => {
				header.classList.add("is-scrolled");
				// console.log("Header is now scrolled.");
			});
		} else if (isScrolled && scrollY < 30) {
			requestAnimationFrame(() => {
				header.classList.remove("is-scrolled");
				// console.log("Header is now at the top.");
			});
		}
		lastScrollY = scrollY;
	};

	// Throttle to roughly 60fps (16ms) to keep it smooth but prevent
	// excessive layout recalculations.
	window.addEventListener("scroll", throttle(handleScroll, 16), {
		passive: true,
	});
}
