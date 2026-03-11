import { registerBlockType } from "@wordpress/blocks";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import {
	PanelBody,
	QueryControls,
	Placeholder,
	Spinner,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const blockProps = useBlockProps();
		const { postsPerPage, selectedCategory } = attributes;

		// Fetch categories
		const categories = useSelect((select) => {
			return select(coreStore).getEntityRecords("taxonomy", "category", {
				per_page: -1,
			});
		}, []);

		// Fetch posts using the REST API
		const { posts, hasResolved } = useSelect(
			(select) => {
				const query = {
					per_page: postsPerPage,
					_embed: true, // Critical for getting featured images
				};
				if (selectedCategory) {
					query.categories = [selectedCategory];
				}

				return {
					posts: select(coreStore).getEntityRecords("postType", "post", query),
					hasResolved: select(coreStore).hasFinishedResolution(
						"getEntityRecords",
						["postType", "post", query],
					),
				};
			},
			[postsPerPage, selectedCategory],
		);

		// Format categories for QueryControls
		const formattedCategories = categories?.map((cat) => ({
			id: cat.id,
			name: cat.name,
		}));

		return (
			<div {...blockProps}>
				<InspectorControls>
					<PanelBody title="Grid Settings">
						{categories ? (
							<QueryControls
								numberOfItems={postsPerPage}
								onNumberOfItemsChange={(val) =>
									setAttributes({ postsPerPage: val })
								}
								selectedCategoryId={selectedCategory}
								categoriesList={formattedCategories}
								onCategoryChange={(val) =>
									setAttributes({
										selectedCategory: val ? parseInt(val, 10) : undefined,
									})
								}
							/>
						) : (
							<div style={{ padding: "20px", textAlign: "center" }}>
								<Spinner />
							</div>
						)}
					</PanelBody>
				</InspectorControls>

				{!hasResolved ? (
					<Placeholder
						icon={<Spinner />}
						label="Fetching Cases..."
						className="min-h-50"
					/>
				) : posts?.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full opacity-70 pointer-events-none">
						{posts.map((post) => {
							// Extract featured image URL from the embedded data
							const featuredImage =
								post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes
									?.medium_large?.source_url ||
								post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

							return (
								<article
									key={post.id}
									className="flex flex-col h-full bg-white"
								>
									{featuredImage && (
										<div className="mb-6 aspect-video w-full overflow-hidden bg-gray-100">
											<img
												src={featuredImage}
												alt=""
												className="w-full h-full object-cover"
											/>
										</div>
									)}

									<h3 className="text-xl font-bold mb-3 uppercase tracking-tight">
										{post.title?.rendered || "(No Title)"}
									</h3>

									<div
										className="text-gray-700 mb-6 grow leading-relaxed line-clamp-3"
										dangerouslySetInnerHTML={{
											__html: post.excerpt?.rendered,
										}}
									/>

									<span className="mt-auto font-bold uppercase text-sm tracking-widest border-b-2 border-black pb-1 self-start">
										LÄS CASE
									</span>
								</article>
							);
						})}
					</div>
				) : (
					<Placeholder label="No cases found" icon="grid-view">
						Try selecting a different category or creating some posts.
					</Placeholder>
				)}
			</div>
		);
	},
	save: () => null, // Dynamic blocks render in PHP on the frontend
});
