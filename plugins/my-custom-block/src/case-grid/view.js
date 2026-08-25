import { getContext, store } from "@wordpress/interactivity";

const TRANSITION_DURATION = 180;

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
 * Return the cases for the current page.
 *
 * @param {Object} context Block context.
 * @param {Array}  posts   All matching cases.
 * @return {Array}
 */
function getVisiblePosts(context, posts) {
	const start = (context.currentPage - 1) * context.postsPerPage;
	const end = start + context.postsPerPage;

	return posts.slice(start, end);
}

const { state, actions } = store("case-grid", {
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

			if (state.isLoading || context.currentPage >= context.maxPages) {
				return;
			}

			context.currentPage += 1;

			await actions.changePage("forward");
		},

		async prevPage() {
			const context = getContext();

			if (state.isLoading || context.currentPage <= 1) {
				return;
			}

			context.currentPage -= 1;

			await actions.changePage("back");
		},

		/**
		 * Swap the visible cases with a short slide/fade transition.
		 *
		 * @param {"forward"|"back"} direction Animation direction.
		 */
		async changePage(direction = "forward") {
			const context = getContext();

			if (state.isLoading) {
				return;
			}

			const grid = document.querySelector("[data-case-grid-grid]");

			if (!grid) {
				state.posts = getVisiblePosts(context, state.allPosts ?? []);
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

				state.posts = getVisiblePosts(context, state.allPosts ?? []);

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
	},
});