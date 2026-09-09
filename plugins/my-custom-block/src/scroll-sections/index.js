import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from "@wordpress/block-editor";
import { PanelBody, Button } from "@wordpress/components";
import metadata from "./block.json";
import "./style.css";

const CHILD_BLOCK = "create-block/scroll-section";

const TEMPLATE = [
	[CHILD_BLOCK, {}],
	[CHILD_BLOCK, {}],
];

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { image } = attributes;

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

		return (
			<>
				<InspectorControls>
					<PanelBody title="Image" initialOpen={true}>
						{image?.url && (
							<img
								src={image.url}
								alt=""
								className="w-full h-32 object-cover mb-2"
							/>
						)}
						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) =>
									setAttributes({
										image: { id: media.id, url: media.url },
									})
								}
								allowedTypes={["image"]}
								value={image?.id}
								render={({ open }) => (
									<Button
										isSecondary
										onClick={open}
										className={
											!image ? "w-full h-20 border-dashed" : ""
										}
									>
										{image ? "Replace Image" : "Choose Image"}
									</Button>
								)}
							/>
						</MediaUploadCheck>
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
					<div className="hidden md:block relative">
						<div className="md:sticky md:top-24 aspect-[4/3] overflow-hidden bg-gray-100 flex items-center justify-center">
							{image?.url ? (
								<img
									src={image.url}
									alt=""
									className="w-full h-full object-cover"
								/>
							) : (
								<p className="text-sm opacity-60 p-4 text-center">
									Choose an image in the sidebar.
								</p>
							)}
						</div>
					</div>
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	},

	save: function save({ attributes }) {
		const { image } = attributes;

		const blockProps = useBlockProps.save({
			className:
				"scroll-sections relative grid grid-cols-1 md:grid-cols-[40%_1fr] gap-12 w-full",
		});

		return (
			<div {...blockProps}>
				<div className="hidden md:block relative">
					<div className="md:sticky md:top-24 aspect-[4/3] overflow-hidden">
						{image?.url && (
							<img
								src={image.url}
								alt=""
								className="w-full h-full object-cover"
							/>
						)}
					</div>
				</div>
				<div className="scroll-sections-content flex flex-col w-full">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});