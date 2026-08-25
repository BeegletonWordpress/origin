import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	store as blockEditorStore,
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import metadata from "./block.json";

const CHILD_BLOCK = "create-block/scroll-section";

const TEMPLATE = [
	[CHILD_BLOCK, {}],
	[CHILD_BLOCK, {}],
];

/**
 * Find the first scroll-section child that has an image, for the editor
 * preview only. The real scroll-linked swapping only happens on the
 * published page.
 *
 * @param {Array} blocks Inner blocks to search.
 * @return {Object|null} The first image object found, or null.
 */
function findFirstSectionImage(blocks) {
	for (const block of blocks) {
		if (block.name === CHILD_BLOCK && block.attributes?.image?.url) {
			return block.attributes.image;
		}
	}
	return null;
}

registerBlockType(metadata.name, {
	edit: function Edit({ clientId }) {
		const blockProps = useBlockProps({
			className:
				"scroll-sections relative grid grid-cols-1 md:grid-cols-[40%_1fr] gap-12 w-full",
		});

		const innerBlocksProps = useInnerBlocksProps(
			{ className: "scroll-sections-content flex flex-col w-full" },
			{
				allowedBlocks: [CHILD_BLOCK],
				template: TEMPLATE,
			},
		);

		// Editor-only preview: show the first section's image so authors
		// have some visual feedback. The actual scroll-driven swapping is
		// handled by view.js and only runs on the front end.
		const previewImage = useSelect(
			(select) => {
				const innerBlocks = select(blockEditorStore).getBlocks(clientId);
				return findFirstSectionImage(innerBlocks);
			},
			[clientId],
		);

		return (
			<div {...blockProps}>
				<div className="hidden md:block relative">
					<div className="md:sticky md:top-24 aspect-[4/3] overflow-hidden bg-gray-100 flex items-center justify-center">
						{previewImage ? (
							<img
								src={previewImage.url}
								alt=""
								className="w-full h-full object-cover"
							/>
						) : (
							<p className="text-sm opacity-60 p-4 text-center">
								Add an image to a section — it will appear
								here and swap as visitors scroll on the
								published page.
							</p>
						)}
					</div>
				</div>
				<div {...innerBlocksProps} />
			</div>
		);
	},

	save: function save() {
		const blockProps = useBlockProps.save({
			className:
				"scroll-sections relative grid grid-cols-1 md:grid-cols-[40%_1fr] gap-12 w-full",
		});

		return (
			<div
				{...blockProps}
				data-wp-interactive="scroll-sections"
				data-wp-context={JSON.stringify({ activeImage: null })}
				data-wp-init="callbacks.initObserver"
			>
				<div className="hidden md:block relative">
					<div className="md:sticky md:top-24 aspect-[4/3] overflow-hidden">
						<img
							data-wp-bind--src="context.activeImage"
							alt=""
							className="w-full h-full object-cover"
						/>
					</div>
				</div>
				<div className="scroll-sections-content flex flex-col w-full">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});