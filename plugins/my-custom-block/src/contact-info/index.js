import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from "@wordpress/block-editor";
import { PanelBody, Button } from "@wordpress/components";
import metadata from "./block.json";
import "./style-index.css";
import "./editor.css";

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const { imageId, imageUrl, imageAlt, header, paragraph } = attributes;

		const onSelectImage = (media) => {
			setAttributes({
				imageUrl: media.url,
				imageId: media.id,
				imageAlt: media.alt,
			});
		};

		const blockProps = useBlockProps({
			className:
				"contact-info flex flex-col md:flex-row w-full gap-4 md:items-stretch max-w-fit",
		});

		return (
			<>
				<InspectorControls>
					<PanelBody title="Image">
						<MediaUploadCheck>
							<MediaUpload
								onSelect={onSelectImage}
								allowedTypes={["image"]}
								value={imageId}
								render={({ open }) => (
									<div>
										{imageUrl ? (
											<img
												src={imageUrl}
												alt={imageAlt}
												className="w-full mb-2"
											/>
										) : null}
										<Button onClick={open} variant="secondary">
											{imageUrl ? "Replace Image" : "Select Image"}
										</Button>
									</div>
								)}
							/>
						</MediaUploadCheck>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					{/* Icon/Image Column - Fixed width 60px, square aspect */}
					<div className="w-full md:w-15 flex items-center">
						{imageUrl ? (
							<div className="w-15 aspect-square">
								<img
									src={imageUrl}
									alt={imageAlt}
									className="w-full h-full object-contain"
								/>
							</div>
						) : (
							<div className="w-15 aspect-square bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
								<MediaUploadCheck>
									<MediaUpload
										onSelect={onSelectImage}
										allowedTypes={["image"]}
										value={imageId}
										render={({ open }) => (
											<Button onClick={open} isSmall>
												Add
											</Button>
										)}
									/>
								</MediaUploadCheck>
							</div>
						)}
					</div>

					{/* Text Column - Takes remaining space, centered vertically */}
					<div className="w-full md:flex-1 flex flex-col justify-center">
						<RichText
							tagName="h3"
							value={header}
							onChange={(val) => setAttributes({ header: val })}
							placeholder="Header..."
							className="has-cas-red-ink-font-family text-4xl! capitalize! font-bold!"
						/>
						<RichText
							tagName="p"
							value={paragraph}
							onChange={(val) => setAttributes({ paragraph: val })}
							placeholder="Paragraph text..."
							className="text-base"
						/>
					</div>
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const { imageUrl, imageAlt, header, paragraph } = attributes;

		const blockProps = useBlockProps.save({
			className:
				"contact-info flex flex-col md:flex-row w-full gap-4 md:items-stretch max-w-fit",
		});

		return (
			<div {...blockProps}>
				{/* Icon/Image Column */}
				<div className="w-full md:w-15 flex items-center">
					{imageUrl && (
						<div className="w-15 aspect-square">
							<img
								src={imageUrl}
								alt={imageAlt}
								className="w-full h-full object-contain"
							/>
						</div>
					)}
				</div>

				{/* Text Column */}
				<div className="w-full md:flex-1 flex flex-col justify-center">
					{header && (
						<RichText.Content
							tagName="h3"
							value={header}
							className="has-cas-red-ink-font-family capitalize! font-bold! text-4xl!"
						/>
					)}
					{paragraph && (
						<RichText.Content
							tagName="p"
							value={paragraph}
							className="text-base"
						/>
					)}
				</div>
			</div>
		);
	},
});
