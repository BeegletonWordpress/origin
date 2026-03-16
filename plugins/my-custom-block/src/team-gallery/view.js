import { store, getContext } from "@wordpress/interactivity";

console.log("Team Gallery Interactivity Script Loaded");

store("team-gallery", {
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
			const { state } = store("team-gallery");
			if (context.currentPage < context.maxPages) {
				context.currentPage++;
				await store("team-gallery").actions.fetchPosts();
			}
		},
		async prevPage() {
			const context = getContext();
			const { state } = store("team-gallery");
			if (context.currentPage > 1) {
				context.currentPage--;
				await store("team-gallery").actions.fetchPosts();
			}
		},
		async fetchPosts() {
			const context = getContext();
			const { state } = store("team-gallery");
			state.isLoading = true;

			try {
				const offset = (context.currentPage - 1) * context.postsPerPage;
				let url = `/wp-json/wp/v2/posts?per_page=${context.postsPerPage}&offset=${offset}&_embed=1`;

				if (context.selectedCategory) {
					url += `&categories=${context.selectedCategory}`;
				}

				const response = await fetch(url);
				const data = await response.json();

				state.posts = data.map((post) => ({
					id: post.id,
					title: post.title.rendered,
					role: post.meta?.team_member_role || "",
					featuredImage:
						post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes
							?.medium_large?.source_url ||
						post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
						"",
				}));
			} catch (error) {
				console.error("Failed to fetch team members:", error);
			} finally {
				state.isLoading = false;
			}
		},
	},
});
