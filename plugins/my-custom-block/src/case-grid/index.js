import { registerBlockType } from "@wordpress/blocks";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, QueryControls, Placeholder } from "@wordpress/components";
import ServerSideRender from "@wordpress/server-side-render";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const blockProps = useBlockProps();

		return (
			<div {...blockProps}>
				<InspectorControls>
					<PanelBody title="Grid Settings">
						<QueryControls
							numberOfItems={attributes.postsPerPage}
							onNumberOfItemsChange={(val) =>
								setAttributes({ postsPerPage: val })
							}
							selectedCategoryId={attributes.selectedCategory}
							onCategoryChange={(val) =>
								setAttributes({ selectedCategory: val })
							}
						/>
					</PanelBody>
				</InspectorControls>

				<ServerSideRender
					block={metadata.name}
					attributes={attributes}
					EmptyResponsePlaceholder={() => (
						<Placeholder label="My Case Grid" icon="grid-view">
							No cases found. Make sure you have posts in the selected category.
						</Placeholder>
					)}
				/>
			</div>
		);
	},
	save: () => null, // Dynamic blocks render in PHP
});
