import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	InspectorControls,
	PanelColorSettings,
	MediaUpload,
	MediaUploadCheck,
} from "@wordpress/block-editor";
import {
	PanelBody,
	SelectControl,
	TextControl,
	Button,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import metadata from "./block.json";
import {
	CONTACT_CARD_BORDER_1_BACK,
	CONTACT_CARD_BORDER_1_FRONT,
	CONTACT_CARD_BORDER_2_BACK,
	CONTACT_CARD_BORDER_2_FRONT,
	CONTACT_CARD_BORDER_3_BACK,
	CONTACT_CARD_BORDER_3_FRONT,
} from "../constants";

const SHAPES = {
	shape1: {
		back: CONTACT_CARD_BORDER_1_BACK,
		front: CONTACT_CARD_BORDER_1_FRONT,
		inset: "5%",
	},
	shape2: {
		back: CONTACT_CARD_BORDER_2_BACK,
		front: CONTACT_CARD_BORDER_2_FRONT,
		inset: "5%",
	},
	shape3: {
		back: CONTACT_CARD_BORDER_3_BACK,
		front: CONTACT_CARD_BORDER_3_FRONT,
		inset: "5%",
	},
};

/**
 * Helper to render the border SVG with the correct stroke color
 */
const BorderSVG = ({ svg, color, className }) => {
	return (
		<div
			className={className}
			style={{
				stroke: color,
			}}
		>
			{/* We need to clone the SVG to add the classes that make it fill the container */}
			{React.cloneElement(svg, {
				className: "absolute inset-0 w-full h-full",
				preserveAspectRatio: "none",
			})}
		</div>
	);
};

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const {
			cardShape,
			svgColor,
			imageNormal,
			imageHover,
			staffMemberId,
			name,
			role,
		} = attributes;

		const blockProps = useBlockProps();

		const staffMembers = useSelect((select) => {
			return select(coreStore).getEntityRecords("postType", "post", {
				per_page: -1,
				_embed: true,
			});
		}, []);

		const staffOptions = [
			{ label: "Manual Entry", value: 0 },
			...(staffMembers?.map((post) => ({
				label: post.title.rendered,
				value: post.id,
			})) || []),
		];

		const handleStaffChange = (newId) => {
			const id = parseInt(newId, 10);
			setAttributes({ staffMemberId: id });
			if (id !== 0) {
				const staff = staffMembers.find((s) => s.id === id);
				if (staff) {
					setAttributes({
						name: staff.title.rendered,
						role: staff.meta?.team_member_role || "",
					});
				}
			}
		};

		const currentShape = SHAPES[cardShape] || SHAPES.shape1;

		return (
			<div {...blockProps}>
				<InspectorControls>
					<PanelBody title="Card Settings">
						<SelectControl
							label="Card Shape"
							value={cardShape}
							options={[
								{ label: "Shape 1", value: "shape1" },
								{ label: "Shape 2", value: "shape2" },
								{ label: "Shape 3", value: "shape3" },
							]}
							onChange={(val) => setAttributes({ cardShape: val })}
						/>
						<SelectControl
							label="Sync with Staff Member"
							value={staffMemberId}
							options={staffOptions}
							onChange={handleStaffChange}
						/>
						<TextControl
							label="Name"
							value={name || ""}
							onChange={(val) => setAttributes({ name: val })}
						/>
						<TextControl
							label="Role"
							value={role || ""}
							onChange={(val) => setAttributes({ role: val })}
						/>
					</PanelBody>
					<PanelColorSettings
						title="SVG Color"
						colorSettings={[
							{
								value: svgColor,
								onChange: (val) => setAttributes({ svgColor: val }),
								label: "Border Color",
							},
						]}
					/>
					<PanelBody title="Images">
						<div className="mb-4">
							<label className="block mb-2">Normal Image</label>
							{imageNormal ? (
								<img
									src={imageNormal.url}
									className="w-full h-20 object-cover mb-2"
								/>
							) : null}
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => setAttributes({ imageNormal: media })}
									allowedTypes={["image"]}
									value={imageNormal?.id}
									render={({ open }) => (
										<Button
											isSecondary
											onClick={open}
											className={
												!imageNormal ? "w-full h-20 border-dashed" : ""
											}
										>
											Upload Normal Image
										</Button>
									)}
								/>
							</MediaUploadCheck>
						</div>
						<div>
							<label className="block mb-2">Hover Image</label>
							{imageHover ? (
								<img
									src={imageHover.url}
									className="w-full h-20 object-cover mb-2"
								/>
							) : null}
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => setAttributes({ imageHover: media })}
									allowedTypes={["image"]}
									value={imageHover?.id}
									render={({ open }) => (
										<Button
											isSecondary
											onClick={open}
											className={!imageHover ? "w-full h-20 border-dashed" : ""}
										>
											Upload Hover Image
										</Button>
									)}
								/>
							</MediaUploadCheck>
						</div>
					</PanelBody>
				</InspectorControls>

				<div className="contact-card flex flex-col items-center gap-8 group cursor-pointer w-fit max-w-[320px]">
					<div className="relative w-75 aspect-square shrink-0">
						{/* Background Border (z-0) */}
						<BorderSVG
							svg={currentShape.back}
							color={svgColor}
							className="absolute inset-0 w-full h-full z-0"
						/>

						{/* Image Layer (z-1) */}
						<div
							className="absolute z-1 overflow-hidden"
							style={{
								inset: currentShape.inset,
							}}
						>
							{imageNormal?.url && (
								<img
									src={imageNormal.url}
									className="w-full h-full object-cover transition-opacity duration-300"
									alt={name}
								/>
							)}
							{imageHover?.url && (
								<img
									src={imageHover.url}
									className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:grayscale-100 transition-opacity duration-300"
									alt={`${name} hover`}
								/>
							)}
						</div>

						{/* Foreground Border (z-2) */}
						<BorderSVG
							svg={currentShape.front}
							color={svgColor}
							className="absolute inset-0 w-full h-full z-2 pointer-events-none"
						/>
					</div>

					<div className="flex flex-col justify-center w-full">
						<h3 className="text-2xl!">{name || "Staff Name"}</h3>
						<p className="text-wrap!">{role || "Job Title"}</p>
					</div>
				</div>
			</div>
		);
	},
	save: function save({ attributes }) {
		const { cardShape, svgColor, imageNormal, imageHover, name, role } =
			attributes;

		const currentShape = SHAPES[cardShape] || SHAPES.shape1;

		return (
			<div {...useBlockProps.save()}>
				<div className="contact-card flex flex-col items-center gap-8 group cursor-pointer w-fit max-w-[320px]">
					<div className="relative w-75 aspect-square shrink-0">
						{/* Background Border (z-0) */}
						<div
							className="absolute inset-0 w-full h-full z-0 group-hover:rotate-5"
							style={{ stroke: svgColor }}
						>
							{currentShape.back}
						</div>

						{/* Image Layer (z-1) */}
						<div
							className="absolute z-1 overflow-hidden"
							style={{
								inset: currentShape.inset,
							}}
						>
							{imageNormal?.url && (
								<img
									src={imageNormal.url}
									className="w-full h-full object-cover"
									alt={name}
								/>
							)}
							{imageHover?.url && (
								<img
									src={imageHover.url}
									className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:grayscale-100 transition-opacity duration-300"
									alt={`${name} hover`}
								/>
							)}
						</div>

						{/* Foreground Border (z-2) */}
						<div
							className="absolute inset-0 w-full h-full z-2 pointer-events-none group-hover:rotate-5"
							style={{ stroke: svgColor }}
						>
							{currentShape.front}
						</div>
					</div>

					<div className="flex flex-col justify-center w-full">
						<h3 className="text-2xl!">{name}</h3>
						<p className="text-wrap!">{role}</p>
					</div>
				</div>
			</div>
		);
	},
});
