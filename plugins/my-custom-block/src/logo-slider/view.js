/**
 * Logo Slider - Frontend JavaScript
 * Handles continuous scrolling animation with pause on hover
 */

document.addEventListener("DOMContentLoaded", () => {
	const sliders = document.querySelectorAll(".logo-slider-container");

	sliders.forEach((container) => {
		const track = container.querySelector(".logo-slider-track");
		if (!track) {
			return;
		}

		const autoplay = track.dataset.autoplay !== "false";
		const speed = parseInt(track.dataset.speed, 10) || 50;
		const pauseOnHover = track.dataset.pauseOnHover !== "false";

		if (!autoplay) {
			track.style.animation = "none";
			return;
		}

		// Clone all items to create seamless loop
		const items = Array.from(track.children);
		if (items.length === 0) {
			return;
		}

		let resizeTimeout = null;
		const RESIZE_DEBOUNCE_MS = 300;

		items.forEach((item) => {
			track.appendChild(item.cloneNode(true));
		});

		// Calculate total width of original items
		const trackStyle = getComputedStyle(track);
		// Some Safari builds may return "normal" for gap or an empty string.
		// Fall back to a sensible value when parsing fails.
		let gap = 8; // default fallback in pixels
		try {
			const rawGap = trackStyle.gap;
			const parsed = parseFloat(rawGap);
			if (!Number.isNaN(parsed)) {
				gap = parsed;
			} else {
				// Try to infer from CSS custom properties or common Tailwind spacing
				// If track has a computed column-gap (older Safari), try that too
				const colGap = trackStyle.columnGap;
				const parsedCol = parseFloat(colGap);
				if (!Number.isNaN(parsedCol)) {
					gap = parsedCol;
				}
			}
		} catch (e) {
			// Keep fallback gap value
			// eslint-disable-next-line no-console
			console.warn("logo-slider: failed to parse gap, using fallback", e);
		}

		const originalItemCount = items.length;
		let itemWidth = 0;
		for (let i = 0; i < originalItemCount; i++) {
			// offsetWidth can be 0 if element is not laid out yet; try boundingClientRect as fallback
			const w =
				items[i].offsetWidth || items[i].getBoundingClientRect().width || 0;
			itemWidth += w + gap;
		}

		// Guard against invalid calculations
		if (!Number.isFinite(itemWidth) || itemWidth <= 0) {
			// eslint-disable-next-line no-console
			console.warn(
				"logo-slider: computed invalid itemWidth, aborting animation setup",
				itemWidth,
			);
			track.style.animation = "none";
			return;
		}

		// Duration based on moving original set width. Multiply by 2 to cover cloned set.
		const duration = (itemWidth / speed) * 2;
		if (Number.isFinite(duration) && duration > 0) {
			track.style.animationDuration = `${duration}s`;
		} else {
			// eslint-disable-next-line no-console
			console.warn("logo-slider: invalid duration calculated", duration);
			track.style.animation = "none";
		}

		if (pauseOnHover) {
			container.addEventListener("mouseenter", () => {
				track.classList.add("paused");
			});
			container.addEventListener("mouseleave", () => {
				track.classList.remove("paused");
			});
		}

		// Add ResizeObserver for post-load resize handling
		const resizeObserver = new ResizeObserver(() => {
			console.debug("logo-slider: resize detected.");
			// Debounce: ignore rapid resize events
			if (resizeTimeout) {
				clearTimeout(resizeTimeout);
			}

			resizeTimeout = setTimeout(() => {
				// Pause animation briefly when resize is detected
				track.classList.add("paused");

				// Resume after a brief pause
				setTimeout(() => {
					track.classList.remove("paused");
				}, 100);
			}, RESIZE_DEBOUNCE_MS);
		});

		// Observe all original items (not clones) for post-load resize
		items.forEach((item) => {
			resizeObserver.observe(item);
		});
	});
});
