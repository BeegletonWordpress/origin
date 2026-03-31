import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	InnerBlocks,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	PanelColorSettings,
} from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import metadata from "./block.json";
import "./style.css";
import "./editor.css";

import { UnderlineSVG } from "../handdrawn-header";

registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const { title, content, imageUrl, imageAlt, svgColor } = attributes;

		const onSelectImage = (media) => {
			setAttributes({
				imageUrl: media.url,
				imageId: media.id,
				imageAlt: media.alt,
			});
		};

		const blockProps = useBlockProps({
			className: "subpage-hero",
		});

		return (
			<>
				<InspectorControls>
					<PanelColorSettings
						title="SVG Color"
						colorSettings={[
							{
								value: svgColor,
								onChange: (value) => setAttributes({ svgColor: value }),
								label: "Underline SVG Color",
							},
						]}
					/>
				</InspectorControls>
				<div {...blockProps}>
					<div className="flex flex-col p-8 md:flex-row w-full gap-4 md:gap-2 max-w-225 m-auto mb-12 md:items-stretch">
						<div className="w-full md:w-[50%] relative">
							<div className="md:relative md:mr-auto">
								<RichText
									tagName="h1"
									className="wrap-anywhere"
									value={title}
									onChange={(value) => setAttributes({ title: value })}
									placeholder="Hero Title"
								/>
								<div className="scale-125 -rotate-2">
									<UnderlineSVG color={svgColor} />
								</div>
							</div>
							<RichText
								tagName="div"
								className="mt-12 pt-5 md:mr-7 subpage-hero__content"
								value={content}
								onChange={(value) => setAttributes({ content: value })}
								placeholder="Hero content text goes here..."
							/>
						</div>

						<div className="w-full md:flex-1">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={onSelectImage}
									allowedTypes={["image"]}
									value={attributes.imageId}
									render={({ open }) => (
										<div className="h-full relative group">
											{imageUrl ? (
												<>
													<img
														src={imageUrl}
														alt={imageAlt}
														className="w-full h-full object-cover"
													/>
													<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50">
														<Button
															onClick={open}
															variant="secondary"
															className="is-primary"
														>
															Replace Image
														</Button>
													</div>
												</>
											) : (
												<div className="flex items-center justify-center h-full bg-gray-100 border-2 border-dashed border-gray-300 min-h-75">
													<Button onClick={open} variant="secondary">
														Select Image
													</Button>
												</div>
											)}
										</div>
									)}
								/>
							</MediaUploadCheck>
						</div>
					</div>
					<InnerBlocks />
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const { title, content, imageUrl, imageAlt, svgColor } = attributes;
		const blockProps = useBlockProps.save({
			className: "subpage-hero",
		});

		return (
			<div {...blockProps}>
				<div className="flex flex-col p-8 md:flex-row w-full gap-4 md:gap-2 max-w-225 m-auto mb-12 md:items-stretch">
					<div className="w-full md:w-[50%] relative">
						<div className="md:relative md:mr-auto">
							<RichText.Content
								tagName="h1"
								className="wrap-anywhere"
								value={title}
							/>
							<div className="scale-125 -rotate-2">
								<UnderlineSVG color={svgColor} />
							</div>
						</div>
						<RichText.Content
							tagName="div"
							className="mt-12 pt-5 md:mr-7 subpage-hero__content"
							value={content}
						/>
					</div>

					<div className="w-full md:flex-1">
						{imageUrl && (
							<img
								src={imageUrl}
								alt={imageAlt}
								className="w-full h-full object-cover"
							/>
						)}
					</div>
				</div>
				<InnerBlocks.Content />
			</div>
		);
	},
});
