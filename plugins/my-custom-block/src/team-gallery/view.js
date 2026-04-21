import { store, getContext } from "@wordpress/interactivity";

const MOBILE_BREAKPOINT = 768; // px
let resizeTimeout; // For debouncing resize events
let storedContext = null; // Store context reference from init
let storedActions = null; // Store actions reference from init
let storedState = null; // Store state reference from init

/**
 * Perform API fetch and animation for breakpoint changes
 * Uses stored context/state/actions to avoid scope issues with global resize events
 */
async function performBreakpointFetch(context, state) {
	const grid = document.querySelector("[data-team-gallery-grid]");
	const wrapper = document.querySelector(".team-gallery");

	if (!grid || !wrapper) {
		console.error("Grid or wrapper element not found");
		return;
	}

	if (!state || !state.posts) {
		console.error("State object is invalid or posts property not found");
		return;
	}

	console.log("Performing breakpoint fetch...");
	state.isLoading = true;

	try {
		// Get order/orderby from wrapper dataset
		const order = wrapper.dataset.order?.toLowerCase() || "asc";
		const orderBy = wrapper.dataset.orderby || "date";

		const offset = (context.currentPage - 1) * context.postsPerPage;
		let url = `/wp-json/wp/v2/posts?per_page=${context.postsPerPage}&offset=${offset}&_embed=1`;

		if (context.selectedCategory) {
			url += `&categories=${context.selectedCategory}`;
		}

		if (orderBy && order) {
			url += `&orderby=${orderBy}&order=${order}`;
		}

		console.log("Fetching posts from:", url);
		const response = await fetch(url);
		const data = await response.json();
		const newPosts = data.map((post) => ({
			id: post.id,
			title: post.title.rendered,
			role: post.meta?.team_member_role || "",
			featuredImage:
				post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes
					?.medium_large?.source_url ||
				post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
				"",
		}));

		// Animation direction for breakpoint changes is always "forward"
		const animationDirection = "forward";

		// Slide out current cards
		grid.style.transition = "transform 280ms ease, opacity 280ms ease";
		grid.style.transform =
			animationDirection === "forward" ? "translateX(-100%)" : "translateX(100%)";
		grid.style.opacity = "0";

		await new Promise((resolve) => setTimeout(resolve, 280));

		// Swap content while off-screen
		state.posts = newPosts;
		state.isLoading = false;

		// Position on the opposite side, hidden, no transition
		grid.style.transition = "none";
		grid.style.transform =
			animationDirection === "forward" ? "translateX(100%)" : "translateX(-100%)";
		grid.style.opacity = "0";

		// Wait for Interactivity API to flush DOM, then slide in
		await new Promise((resolve) =>
			requestAnimationFrame(() => requestAnimationFrame(resolve)),
		);
		grid.style.transition = "transform 280ms ease, opacity 280ms ease";
		grid.style.transform = "translateX(0)";
		grid.style.opacity = "1";

		await new Promise((resolve) => setTimeout(resolve, 280));

		// Clean up inline styles
		grid.style.transition = "";
		grid.style.transform = "";
		grid.style.opacity = "";
	} catch (error) {
		console.error("Failed to fetch team members on breakpoint change:", error);
		// Reset grid state if something went wrong mid-animation
		grid.style.transition = "";
		grid.style.transform = "";
		grid.style.opacity = "";
		state.isLoading = false;
	}
}

console.log("Defining team-gallery store with responsive pagination...");

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
			if (context.currentPage < context.maxPages) {
				context.currentPage++;
				await actions.fetchPosts("forward");
			}
		},
		async prevPage() {
			const context = getContext();
			if (context.currentPage > 1) {
				context.currentPage--;
				await actions.fetchPosts("back");
			}
		},
		async handleBreakpointCheck() {
			console.log("Checking breakpoint...");
			const context = getContext();
			console.log("Current context:", context);

			if (!storedContext && !storedActions) {
				// Store context and actions references for use in updateBreakpoint
				storedContext = getContext();
				storedActions = actions;
				console.log("Stored context and actions for breakpoint handling.");
			}

			const wasMobile = context.isMobile;
			const isMobileNow = window.innerWidth < MOBILE_BREAKPOINT;

			console.log(
				`Checking breakpoint: was mobile: ${wasMobile}, is mobile now: ${isMobileNow}`,
			);

			// Only act if breakpoint actually changed
			if (wasMobile === isMobileNow) {
				console.log("Breakpoint unchanged, no action taken.");
				// Mark as initialized even if breakpoint unchanged
				context.isInitialized = true;
				return;
			}

			context.isMobile = isMobileNow;

			// Switch between mobile and desktop posts per page
			const newPostsPerPage = isMobileNow
				? context.mobilePostsPerPage
				: context.desktopPostsPerPage;

			// Calculate new max pages based on total posts and new posts per page
			const newMaxPages = Math.ceil(context.totalPosts / newPostsPerPage);

			// Reset to page 1 on breakpoint change
			const newCurrentPage = 1;

			console.log(
				`Breakpoint changed to ${isMobileNow ? "mobile" : "desktop"}. ` +
					`Window width: ${window.innerWidth}px. ` +
					`Posts per page: ${context.postsPerPage} → ${newPostsPerPage}. ` +
					`Max pages: ${context.maxPages} → ${newMaxPages}. ` +
					`Current page: ${context.currentPage} → ${newCurrentPage}`,
			);

			// Update context values
			context.postsPerPage = newPostsPerPage;
			context.maxPages = newMaxPages;
			context.currentPage = newCurrentPage;

			// Fetch posts with new pagination
			await actions.fetchPosts("current");

			// Mark as initialized after fetch completes
			context.isInitialized = true;
		},
		async fetchPosts(direction = "forward") {
			const context = getContext();
			const grid = document.querySelector("[data-team-gallery-grid]");
			const wrapper = document.querySelector(".team-gallery");

			console.log("Wrapper:", wrapper);
			console.log("Wrapper dataset:", wrapper?.dataset);

			context.order = wrapper.dataset.order?.toLowerCase() || "asc";
			context.orderBy = wrapper.dataset.orderby || "date";

			state.isLoading = true;

			try {
				const offset = (context.currentPage - 1) * context.postsPerPage;
				let url = `/wp-json/wp/v2/posts?per_page=${context.postsPerPage}&offset=${offset}&_embed=1`;

				if (context.selectedCategory) {
					url += `&categories=${context.selectedCategory}`;
				}

				if (context.orderBy && context.order) {
					url += `&orderby=${context.orderBy}&order=${context.order}`;
				}

				console.log("Fetching posts from:", url);
				const response = await fetch(url);
				const data = await response.json();
				const newPosts = data.map((post) => ({
					id: post.id,
					title: post.title.rendered,
					role: post.meta?.team_member_role || "",
					featuredImage:
						post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes
							?.medium_large?.source_url ||
						post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
						"",
				}));

				// Determine animation direction based on context
				// When direction is "current" (from breakpoint change), use smooth transition
				const animationDirection =
					direction === "current" ? "forward" : direction;

				// Slide out current cards
				grid.style.transition = "transform 280ms ease, opacity 280ms ease";
				grid.style.transform =
					animationDirection === "forward"
						? "translateX(-100%)"
						: "translateX(100%)";
				grid.style.opacity = "0";

				await new Promise((resolve) => setTimeout(resolve, 280));

				// Swap content while off-screen
				state.posts = newPosts;
				state.isLoading = false;

				// Position on the opposite side, hidden, no transition
				grid.style.transition = "none";
				grid.style.transform =
					animationDirection === "forward"
						? "translateX(100%)"
						: "translateX(-100%)";
				grid.style.opacity = "0";

				// Wait for Interactivity API to flush DOM, then slide in
				await new Promise((resolve) =>
					requestAnimationFrame(() => requestAnimationFrame(resolve)),
				);
				grid.style.transition = "transform 280ms ease, opacity 280ms ease";
				grid.style.transform = "translateX(0)";
				grid.style.opacity = "1";

				await new Promise((resolve) => setTimeout(resolve, 280));

				// Clean up inline styles
				grid.style.transition = "";
				grid.style.transform = "";
				grid.style.opacity = "";
			} catch (error) {
				console.error("Failed to fetch team members:", error);
				// Reset grid state if something went wrong mid-animation
				grid.style.transition = "";
				grid.style.transform = "";
				grid.style.opacity = "";
				state.isLoading = false;
			}
		},
	},
	callbacks: {
		initResponsivePagination() {
			console.log("Initial responsive pagination running...");

			// Store context, state and actions references for use in updateBreakpoint
			storedContext = getContext();
			storedState = state;
			storedActions = actions;

			// Check breakpoint immediately on init
			actions.handleBreakpointCheck();
		},
		updateBreakpoint() {
			console.log("Resize event detected, checking breakpoint...");

			// Use stored context to perform breakpoint check
			if (!storedContext || !storedActions || !storedState) {
				console.warn("Context, state, or actions not yet initialized");
				return;
			}

			// Debounce the breakpoint check
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(async () => {
				const wasMobile = storedContext.isMobile;
				const isMobileNow = window.innerWidth < MOBILE_BREAKPOINT;

				console.log(
					`Checking breakpoint: was mobile: ${wasMobile}, is mobile now: ${isMobileNow}`,
				);

				// Only act if breakpoint actually changed
				if (wasMobile === isMobileNow) {
					console.log("Breakpoint unchanged, no action taken.");
					return;
				}

				storedContext.isMobile = isMobileNow;

				// Switch between mobile and desktop posts per page
				const newPostsPerPage = isMobileNow
					? storedContext.mobilePostsPerPage
					: storedContext.desktopPostsPerPage;

				// Calculate new max pages based on total posts and new posts per page
				const newMaxPages = Math.ceil(storedContext.totalPosts / newPostsPerPage);

				// Reset to page 1 on breakpoint change
				const newCurrentPage = 1;

				console.log(
					`Breakpoint changed to ${isMobileNow ? "mobile" : "desktop"}. ` +
						`Window width: ${window.innerWidth}px. ` +
						`Posts per page: ${storedContext.postsPerPage} → ${newPostsPerPage}. ` +
						`Max pages: ${storedContext.maxPages} → ${newMaxPages}. ` +
						`Current page: ${storedContext.currentPage} → ${newCurrentPage}`,
				);

				// Update context values
				storedContext.postsPerPage = newPostsPerPage;
				storedContext.maxPages = newMaxPages;
				storedContext.currentPage = newCurrentPage;

				// Fetch posts with new pagination using the extracted function
				await performBreakpointFetch(storedContext, storedState);

				// Mark as initialized after fetch completes
				storedContext.isInitialized = true;
			}, 300);
		},
	},
});
