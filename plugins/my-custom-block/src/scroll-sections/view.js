import { getContext, getElement, store } from "@wordpress/interactivity";

store("scroll-sections", {
	callbacks: {
		initObserver() {
			// Captured once, synchronously, while the directive is being
			// processed — safe to reference from inside the async
			// IntersectionObserver callback below.
			const context = getContext();
			const { ref } = getElement();

			const sections = ref.querySelectorAll("[data-scroll-image]");

			if (!sections.length) {
				return; 
			}

			// Seed the initial image synchronously so there's no flash of
			// a blank sticky image before the observer's first callback
			// fires (which normally happens almost immediately, but not
			// necessarily before first paint).
			if (!context.activeImage) {
				context.activeImage =
					sections[0].getAttribute("data-scroll-image") || null;
			}

			// Shrink the observed viewport to a thin horizontal band near
			// vertical center. Whichever section crosses that band as the
			// visitor scrolls becomes the "active" one — a standard
			// scrollspy technique.
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (!entry.isIntersecting) {
							return;
						}

						const url = entry.target.getAttribute(
							"data-scroll-image",
						);

						if (url) {
							context.activeImage = url;
						}
					});
				},
				{ rootMargin: "-45% 0px -45% 0px", threshold: 0 },
			);

			sections.forEach((section) => observer.observe(section));
		},
	},
});