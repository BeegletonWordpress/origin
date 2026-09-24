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
				"contact-info grid grid-cols-[3.75rem_1fr] gap-x-4 gap-y-1 items-center w-full max-w-none",
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
					{/* Icon - beside the heading on mobile (row 1 only), beside
					    the full heading+value column on desktop (spans both rows) */}
					<div className="w-15 aspect-square row-span-1 md:row-span-2 self-center">
						{imageUrl ? (
							<img
								src={imageUrl}
								alt={imageAlt}
								className="w-full h-full object-contain"
							/>
						) : (
							<div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
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

					<RichText
						tagName="h3"
						value={header}
						onChange={(val) => setAttributes({ header: val })}
						placeholder="Header..."
						className="has-cas-red-ink-font-family text-4xl! capitalize! font-bold! row-start-1 col-start-2"
					/>
					<RichText
						tagName="p"
						value={paragraph}
						onChange={(val) => setAttributes({ paragraph: val })}
						placeholder="Paragraph text..."
						className="text-base row-start-2 col-span-2 md:col-span-1 md:col-start-2"
					/>
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const { imageUrl, imageAlt, header, paragraph } = attributes;

		const blockProps = useBlockProps.save({
			className:
				"contact-info grid grid-cols-[3.75rem_1fr] gap-x-4 gap-y-1 items-center w-full max-w-none",
		});

		return (
			<div {...blockProps}>
				{/* Icon - beside the heading on mobile (row 1 only), beside
				    the full heading+value column on desktop (spans both rows) */}
				<div className="w-15 aspect-square row-span-1 md:row-span-2 self-center">
					{imageUrl && (
						<img
							src={imageUrl}
							alt={imageAlt}
							className="w-full h-full object-contain"
						/>
					)}
				</div>

				{header && (
					<RichText.Content
						tagName="h3"
						value={header}
						className="has-cas-red-ink-font-family capitalize! font-bold! text-4xl! row-start-1 col-start-2"
					/>
				)}
				{paragraph && (
					<RichText.Content
						tagName="p"
						value={paragraph}
						className="text-base row-start-2 col-span-2 md:col-span-1 md:col-start-2"
					/>
				)}
			</div>
		);
	},
});
