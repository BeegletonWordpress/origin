import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	InspectorControls,
	useInnerBlocksProps,
	InnerBlocks,
} from "@wordpress/block-editor";
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
		const { postsPerPage, backgroundColor, style } =
			attributes;

		const textColor = style?.color?.text;

		const blockProps = useBlockProps({
			className: "case-grid flex flex-col items-center",
			style: {
				backgroundColor: backgroundColor
					? `var(--wp--preset--color--${backgroundColor})`
					: undefined,
				color: textColor || undefined,
			},
		});

		const { children, ...innerBlocksProps } = useInnerBlocksProps(
			{ className: "w-full flex flex-col items-center" },
			{
				allowedBlocks: ["create-block/my-handdrawn-button"],
				template: [
					["create-block/my-handdrawn-button", { text: "Visa alla case" }],
				],
			},
		);

		// Fetch posts using the REST API
		const { posts, hasResolved } = useSelect(
			(select) => {
				const query = {
					per_page: postsPerPage,
					_embed: true, // Critical for getting featured images
				};

				return {
					posts: select(coreStore).getEntityRecords("postType", "customer_case", query),
					hasResolved: select(coreStore).hasFinishedResolution(
						"getEntityRecords",
						["postType", "customer_case", query],
					),
				};
			},
			[postsPerPage],
		);

		return (
			<div {...blockProps}>
				<InspectorControls>
					<PanelBody title="Grid Settings">
						<QueryControls
							numberOfItems={postsPerPage}
							onNumberOfItemsChange={(val) =>
								setAttributes({ postsPerPage: val })
							}
						/>
					</PanelBody>
				</InspectorControls>

				{!hasResolved ? (
					<Placeholder
						icon={<Spinner />}
						label="Fetching Cases..."
						className="min-h-50"
					/>
				) : posts?.length > 0 ? (
					<div {...innerBlocksProps}>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12 pointer-events-none">
							{posts.map((post) => {
								// Extract featured image URL from the embedded data
								const featuredImage =
									post._embedded?.["wp:featuredmedia"]?.[0]?.media_details
										?.sizes?.medium_large?.source_url ||
									post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

								return (
									<article key={post.id} className="flex flex-col h-full">
										{featuredImage && (
											<div className="mb-6 aspect-3/4 w-full overflow-hidden">
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
											className="mb-6 grow leading-relaxed line-clamp-3"
											dangerouslySetInnerHTML={{
												__html: post.excerpt?.rendered,
											}}
										/>
									</article>
								);
							})}
						</div>
						{children}
					</div>
				) : (
					<Placeholder label="No cases found" icon="grid-view">
						Try creating some customer cases.
					</Placeholder>
				)}
			</div>
		);
	},
	save: () => <InnerBlocks.Content />,
});
