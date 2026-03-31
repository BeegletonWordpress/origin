import { registerBlockType } from "@wordpress/blocks";
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from "@wordpress/block-editor";
import { PanelBody, Button } from "@wordpress/components";
import { addFilter } from "@wordpress/hooks";
import metadata from "./block.json";
import "../../index.css";
import "./style.css";
import "./editor.css";

addFilter(
	"blocks.registerBlockType",
	"my-custom-block/allow-button-in-navigation",
	(settings, name) => {
		if (name === "core/navigation") {
			return {
				...settings,
				allowedBlocks: [
					...(settings.allowedBlocks || []),
					"create-block/my-handdrawn-button",
				],
			};
		}
		return settings;
	},
);

const TEMPLATE = [
	[
		"core/site-logo",
		{
			width: 235,
			isLink: true,
		},
	],
	[
		"core/navigation",
		{
			layout: { type: "flex", justifyContent: "right", flexWrap: "nowrap" },
			fontSize: "small",
			style: {
				typography: {
					fontWeight: "600",
					textTransform: "uppercase",
				},
				spacing: {
					blockGap: "30px",
				},
			},
			className: "header-navigation",
		},
		[
			["core/home-link"],
			[
				"create-block/my-handdrawn-button",
				{
					text: "KONTAKTA OSS",
					backgroundColor: "contrast",
					textColor: "accent-5",
					style: {
						spacing: {
							padding: {
								top: "15px",
								right: "30px",
								bottom: "15px",
								left: "30px",
							},
						},
					},
				},
			],
		],
	],
];

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const {
			scrolledLogoId,
			scrolledLogoUrl,
			lightLogoId,
			lightLogoUrl,
		} = attributes;
		const blockProps = useBlockProps({ className: "sticky top-0 z-50 w-full" });
		const innerBlocksProps = useInnerBlocksProps(
			{
				className:
					"header-inner-container mx-auto w-full max-w-(--wp--style--global--wide-size) px-8",
			},
			{ template: TEMPLATE, templateLock: false, orientation: "horizontal" },
		);

		return (
			<>
				<InspectorControls>
					<PanelBody title="Logo Settings">
						<div style={{ marginBottom: "20px" }}>
							<label style={{ display: "block", marginBottom: "5px" }}>
								Scrolled Logo (Dark)
							</label>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(m) =>
										setAttributes({
											scrolledLogoId: m.id,
											scrolledLogoUrl: m.url,
										})
									}
									allowedTypes={["image"]}
									value={scrolledLogoId}
									render={({ open }) => (
										<div>
											{scrolledLogoUrl && (
												<img
													src={scrolledLogoUrl}
													style={{ maxWidth: "100%", marginBottom: "10px" }}
												/>
											)}
											<Button isPrimary onClick={open}>
												{scrolledLogoId
													? "Replace Scrolled Logo"
													: "Select Scrolled Logo"}
											</Button>
										</div>
									)}
								/>
							</MediaUploadCheck>
						</div>

						<div>
							<label style={{ display: "block", marginBottom: "5px" }}>
								Light Theme Logo (White)
							</label>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(m) =>
										setAttributes({ lightLogoId: m.id, lightLogoUrl: m.url })
									}
									allowedTypes={["image"]}
									value={lightLogoId}
									render={({ open }) => (
										<div>
											{lightLogoUrl && (
												<img
													src={lightLogoUrl}
													style={{
														maxWidth: "100%",
														backgroundColor: "#333",
														padding: "10px",
														marginBottom: "10px",
													}}
												/>
											)}
											<Button isPrimary onClick={open}>
												{lightLogoId
													? "Replace Light Logo"
													: "Select Light Logo"}
											</Button>
										</div>
									)}
								/>
							</MediaUploadCheck>
						</div>
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	},
	save: function save({ attributes }) {
		const { scrolledLogoUrl, lightLogoUrl } = attributes;
		const blockProps = useBlockProps.save({
			className: "sticky top-0 z-50 w-full",
		});

		return (
			<div {...blockProps}>
				<div className="header-inner-container mx-auto flex w-full max-w-(--wp--style--global--wide-size) items-center justify-between px-8">
					<InnerBlocks.Content />
					{scrolledLogoUrl && (
						<img
							src={scrolledLogoUrl}
							className="scrolled-logo-overlay"
							alt=""
							aria-hidden="true"
						/>
					)}
					{lightLogoUrl && (
						<img
							src={lightLogoUrl}
							className="light-logo-overlay"
							alt=""
							aria-hidden="true"
						/>
					)}
				</div>
			</div>
		);
	},
});
