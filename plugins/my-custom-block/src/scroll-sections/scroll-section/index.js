import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	InnerBlocks,
	MediaUpload,
	MediaUploadCheck,
	PanelColorSettings,
} from "@wordpress/block-editor";
import { PanelBody, Button } from "@wordpress/components";
import { SCROLL_SECTION_DIVIDER } from "../../constants";
import metadata from "./block.json";

const ALLOWED_BLOCKS = [
	"core/heading",
	"core/paragraph",
	"core/list",
	"core/buttons",
	"create-block/label",
];

const TEMPLATE = [
	["core/heading", { level: 3, placeholder: "Section title…" }],
	["core/paragraph", { placeholder: "Section description…" }],
];

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const { image, dividerColor } = attributes;

		const blockProps = useBlockProps({
			className: "scroll-section pt-10 pb-0 relative",
		});

		const innerBlocksProps = useInnerBlocksProps(
			{ className: "flex flex-col gap-4" },
			{
				allowedBlocks: ALLOWED_BLOCKS,
				template: TEMPLATE,
			},
		);

		return (
			<div {...blockProps}>
				<div
					className="scroll-section-divider w-full h-3 mb-10"
					aria-hidden="true"
					style={{ "--handdrawn-stroke-color": dividerColor || undefined }}
				>
					{SCROLL_SECTION_DIVIDER}
				</div>
				<InspectorControls>
					<PanelColorSettings
						title="Divider Color"
						colorSettings={[
							{
								value: dividerColor,
								onChange: (val) =>
									setAttributes({ dividerColor: val }),
								label: "Divider Color",
							},
						]}
					/>
					<PanelBody title="Section Image" initialOpen={true}>
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
						{image && (
							<Button
								isDestructive
								isLink
								onClick={() => setAttributes({ image: undefined })}
								className="mt-2"
							>
								Remove Image
							</Button>
						)}
					</PanelBody>
				</InspectorControls>

				{image?.url && (
					<img
						src={image.url}
						alt=""
						title="Shown on the front end while this section is in view"
						className="absolute top-16 right-0 w-12 h-12 object-cover rounded shadow border-2 border-white"
					/>
				)}

				{image?.url && (
					<img
						src={image.url}
						alt=""
						className="float-left w-14 h-14 mr-4 mb-2 rounded object-cover md:hidden"
					/>
				)}

				<div {...innerBlocksProps} />
			</div>
		);
	},

	save: function save({ attributes }) {
		const { image, dividerColor } = attributes;

		const blockProps = useBlockProps.save({
			className: "scroll-section pt-10 pb-0",
		});

		return (
			<div {...blockProps} data-scroll-image={image?.url || ""}>
				<div
					className="scroll-section-divider w-full h-3 mb-10"
					aria-hidden="true"
					style={{ "--handdrawn-stroke-color": dividerColor || undefined }}
				>
					{SCROLL_SECTION_DIVIDER}
				</div>
				{image?.url && (
					<img
						src={image.url}
						alt=""
						className="float-left w-14 h-14 mr-4 mb-2 rounded object-cover md:hidden"
					/>
				)}
				<InnerBlocks.Content />
			</div>
		);
	},
});