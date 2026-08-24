import { getContext, store } from "@wordpress/interactivity";

const MOBILE_BREAKPOINT = 768;
const TRANSITION_DURATION = 180;

let resizeTimeout;
let hasShuffled = false;

/**
 * Return a new array with the same items in random order (Fisher-Yates).
 * Does not mutate the input array.
 *
 * @param {Array} array Items to shuffle.
 * @return {Array} A new, shuffled array.
 */
function shuffleArray(array) {
	const result = [...array];

	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}

	return result;
}

/**
 * Wait until the browser has rendered pending DOM changes.
 *
 * @return {Promise<void>}
 */
function waitForRender() {
	return new Promise((resolve) => {
		requestAnimationFrame(() => {
			requestAnimationFrame(resolve);
		});
	});
}

/**
 * Wait for a specified duration.
 *
 * @param {number} duration Duration in milliseconds.
 * @return {Promise<void>}
 */
function wait(duration) {
	return new Promise((resolve) => {
		window.setTimeout(resolve, duration);
	});
}

/**
 * Return the team members for the current page.
 *
 * @param {Object} context Block context.
 * @param {Array}  posts   All team-member posts.
 * @return {Array}
 */
function getVisiblePosts(context, posts) {
	const start = (context.currentPage - 1) * context.postsPerPage;
	const end = start + context.postsPerPage;

	return posts.slice(start, end);
}

/**
 * Find the grid that belongs to the current gallery.
 *
 * This is still based on the closest initialized gallery. It avoids querying
 * an unrelated element elsewhere in the document where possible.
 *
 * @param {HTMLElement|null} element Current interactive element.
 * @return {HTMLElement|null}
 */
function getGrid(element) {
	const wrapper = element?.closest?.(".team-gallery");

	return wrapper?.querySelector("[data-team-gallery-grid]") ?? null;
}

const { state, actions } = store("team-gallery", {
	state: {
		get isFirstPage() {
			const context = getContext();

			return context.currentPage === 1;
		},

		get isLastPage() {
			const context = getContext();

			return context.currentPage >= context.maxPages;
		},
	},

	actions: {
		async nextPage() {
			const context = getContext();

			if (
				state.isLoading ||
				context.currentPage >= context.maxPages
			) {
				return;
			}

			context.currentPage += 1;

			await actions.changePage("forward");
		},

		async prevPage() {
			const context = getContext();

			if (
				state.isLoading ||
				context.currentPage <= 1
			) {
				return;
			}

			context.currentPage -= 1;

			await actions.changePage("back");
		},

		/**
		 * Change the visible members without making a network request.
		 *
		 * @param {"forward"|"back"} direction Animation direction.
		 */
		async changePage(direction = "forward") {
			const context = getContext();

			if (state.isLoading) {
				return;
			}

			const grid = document.querySelector(
				"[data-team-gallery-grid]",
			);

			if (!grid) {
				state.posts = getVisiblePosts(
					context,
					state.allPosts ?? [],
				);
				return;
			}

			state.isLoading = true;

			try {
				grid.style.transition =
					`transform ${TRANSITION_DURATION}ms ease, ` +
					`opacity ${TRANSITION_DURATION}ms ease`;

				grid.style.transform =
					direction === "forward"
						? "translateX(-40px)"
						: "translateX(40px)";

				grid.style.opacity = "0";

				await wait(TRANSITION_DURATION);

				state.posts = getVisiblePosts(
					context,
					state.allPosts ?? [],
				);

				grid.style.transition = "none";
				grid.style.transform =
					direction === "forward"
						? "translateX(40px)"
						: "translateX(-40px)";

				await waitForRender();

				grid.style.transition =
					`transform ${TRANSITION_DURATION}ms ease, ` +
					`opacity ${TRANSITION_DURATION}ms ease`;

				grid.style.transform = "translateX(0)";
				grid.style.opacity = "1";

				await wait(TRANSITION_DURATION);
			} finally {
				grid.style.transition = "";
				grid.style.transform = "";
				grid.style.opacity = "";

				state.isLoading = false;
			}
		},

		/**
		 * Configure pagination for the current browser width.
		 *
		 * @param {boolean} animate Whether to animate the changed content.
		 */
		async updateResponsivePagination(animate = false) {
			const context = getContext();
			const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

			const newPostsPerPage = isMobile
				? context.mobilePostsPerPage
				: context.desktopPostsPerPage;

			const breakpointChanged =
				context.isMobile !== isMobile ||
				context.postsPerPage !== newPostsPerPage;

			context.isMobile = isMobile;

			if (!breakpointChanged) {
				if (!context.isInitialized) {
					state.posts = getVisiblePosts(
						context,
						state.allPosts ?? [],
					);
				}

				context.isInitialized = true;
				return;
			}

			context.postsPerPage = newPostsPerPage;
			context.maxPages = Math.max(
				1,
				Math.ceil(
					context.totalPosts / newPostsPerPage,
				),
			);

			context.currentPage = 1;

			if (animate && context.isInitialized) {
				await actions.changePage("forward");
			} else {
				state.posts = getVisiblePosts(
					context,
					state.allPosts ?? [],
				);
			}

			context.isInitialized = true;
		},
	},

	callbacks: {
		async initResponsivePagination() {
			if (!hasShuffled) {
				state.allPosts = shuffleArray(state.allPosts ?? []);
				hasShuffled = true;
			}

			await actions.updateResponsivePagination(false);
		},

		updateBreakpoint() {
			window.clearTimeout(resizeTimeout);

			resizeTimeout = window.setTimeout(() => {
				actions.updateResponsivePagination(true);
			}, 200);
		},
	},
});