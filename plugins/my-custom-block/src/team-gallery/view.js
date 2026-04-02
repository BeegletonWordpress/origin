import { store, getContext } from "@wordpress/interactivity";

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
		async fetchPosts(direction = "forward") {
			const context = getContext();
			const grid = document.querySelector("[data-team-gallery-grid]");

			state.isLoading = true;

			try {
				const offset = (context.currentPage - 1) * context.postsPerPage;
				let url = `/wp-json/wp/v2/posts?per_page=${context.postsPerPage}&offset=${offset}&_embed=1`;

				if (context.selectedCategory) {
					url += `&categories=${context.selectedCategory}`;
				}

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

				// Slide out current cards
				grid.style.transition = "transform 280ms ease, opacity 280ms ease";
				grid.style.transform =
					direction === "forward" ? "translateX(-100%)" : "translateX(100%)";
				grid.style.opacity = "0";

				await new Promise((resolve) => setTimeout(resolve, 280));

				// Swap content while off-screen
				state.posts = newPosts;
				state.isLoading = false;

				// Position on the opposite side, hidden, no transition
				grid.style.transition = "none";
				grid.style.transform =
					direction === "forward" ? "translateX(100%)" : "translateX(-100%)";
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
});
