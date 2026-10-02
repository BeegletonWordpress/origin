import { registerBlockType } from "@wordpress/blocks";
import {
	useBlockProps,
	InspectorControls,
	PanelColorSettings,
} from "@wordpress/block-editor";
import {
	PanelBody,
	QueryControls,
	Placeholder,
	Spinner,
	SelectControl,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { cloneElement } from "@wordpress/element";
import metadata from "./block.json";
import { TEAM_BACKGROUND_SVG } from "../constants";

/**
 * Arrow SVG Components
 */
const ArrowLeft = () => (
	<svg
		width="60"
		height="52"
		viewBox="0 0 80 70"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className="cursor-pointer hover:opacity-70 transition-opacity"
	>
		<g clipPath="url(#clip0_52_263)">
			<path
				d="M77.3582 36.5734C52.4868 32.7348 27.0865 32.4002 2.16247 35.9705C0.639054 36.1919 -0.00927147 34.0489 1.54539 33.6017C3.67734 32.9943 5.72332 32.2981 7.94903 32.1331C9.13067 32.0398 9.64632 33.9129 8.55209 34.4176C6.49853 35.3608 4.3838 35.658 2.16247 35.9705C0.642715 36.1782 -0.0142725 34.0403 1.54539 33.6017C9.19744 31.4354 16.3402 26.307 22.2632 21.086C23.4419 20.0475 25.1935 21.7613 24.0061 22.8048C17.742 28.3151 10.2592 33.6745 2.16247 35.9705C1.958 35.1763 1.74986 34.3958 1.54539 33.6017C3.51387 33.3312 5.50504 33.14 7.32709 32.2959C7.52523 33.0591 7.73202 33.8172 7.93016 34.5804C5.94131 34.7356 4.06524 35.4262 2.16247 35.9705C1.958 35.1763 1.74986 34.3958 1.54539 33.6017C26.9181 29.9686 52.6719 30.2955 77.9915 34.2102C79.5467 34.4439 78.9048 36.8121 77.3582 36.5734Z"
				fill="#010101"
			/>
			<path
				d="M26.0916 43.8172C18.0243 41.3042 9.95333 38.8049 1.88601 36.2918C0.379359 35.8223 1.01259 33.459 2.51923 33.9286C10.5866 36.4416 18.6575 38.941 26.7249 41.454C28.2315 41.9236 27.5983 44.2868 26.0916 43.8172Z"
				fill="#010101"
			/>
		</g>
		<defs>
			<clipPath id="clip0_52_263">
				<rect
					width="41.28"
					height="67.81"
					fill="white"
					transform="matrix(-0.5 -0.866025 -0.866025 0.5 79.3652 35.7495)"
				/>
			</clipPath>
		</defs>
	</svg>
);

const ArrowRight = () => (
	<svg
		width="60"
		height="52"
		viewBox="0 0 80 70"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className="cursor-pointer hover:opacity-70 transition-opacity"
	>
		<g clipPath="url(#clip0_52_260)">
			<path
				d="M2.00699 36.5734C26.8784 32.7348 52.2787 32.4002 77.2028 35.9705C78.7262 36.1919 79.3745 34.0489 77.8198 33.6017C75.6879 32.9943 73.6419 32.2981 71.4162 32.1331C70.2346 32.0398 69.7189 33.9129 70.8131 34.4176C72.8667 35.3608 74.9814 35.658 77.2028 35.9705C78.7225 36.1782 79.3795 34.0403 77.8198 33.6017C70.1678 31.4354 63.0251 26.307 57.102 21.086C55.9233 20.0475 54.1718 21.7613 55.3591 22.8048C61.6232 28.3151 69.106 33.6745 77.2028 35.9705C77.4072 35.1763 77.6154 34.3958 77.8198 33.6017C75.8514 33.3312 73.8602 33.14 72.0381 32.2959C71.84 33.0591 71.6332 33.8172 71.4351 34.5804C73.4239 34.7356 75.3 35.4262 77.2028 35.9705C77.4072 35.1763 77.6154 34.3958 77.8198 33.6017C52.4471 29.9686 26.6933 30.2955 1.37377 34.2102C-0.181442 34.4439 0.460443 36.8121 2.00699 36.5734Z"
				fill="#010101"
			/>
			<path
				d="M53.2736 43.8172C61.3409 41.3042 69.4119 38.8049 77.4792 36.2918C78.9859 35.8223 78.3526 33.459 76.846 33.9286C68.7787 36.4416 60.7077 38.941 52.6404 41.454C51.1337 41.9236 51.7669 44.2868 53.2736 43.8172Z"
				fill="#010101"
			/>
		</g>
		<defs>
			<clipPath id="clip0_52_260">
				<rect
					width="41.28"
					height="67.81"
					fill="white"
					transform="translate(0 35.7495) rotate(-60)"
				/>
			</clipPath>
		</defs>
	</svg>
);

// Positioning lives here; the shape itself is TEAM_BACKGROUND_SVG in
// src/constants.js (render.php has a PHP copy of it).
const BackgroundSVG = ({ color }) =>
	cloneElement(TEAM_BACKGROUND_SVG, {
		className:
			"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[135%] h-auto -z-10 pointer-events-none",
		style: { color: color || "inherit" },
	});

/**
 * Resolves an ACF image field (attachment ID) to a media object and
 * renders the member photo. Kept as its own component so useSelect
 * follows the Rules of Hooks when rendering a list of members.
 *
 * @param root0
 * @param root0.imageId Attachment ID from the ACF "employe_image" field.
 * @param root0.alt     Alt text for the image.
 */
const MemberImage = ({ imageId, alt }) => {
	const media = useSelect(
		(select) => (imageId ? select(coreStore).getMedia(imageId) : null),
		[imageId]
	);

	if (!media?.source_url) {
		return null;
	}

	return (
		<div className="mb-6 aspect-square w-full overflow-hidden">
			<img
				src={media.source_url}
				alt={alt}
				className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
			/>
		</div>
	);
};

registerBlockType(metadata.name, {
	edit: function Edit({ attributes, setAttributes }) {
		const {
			postsPerPage,
			mobilePostsPerPage,
			currentIndex,
			svgColor,
			order,
			orderBy,
		} = attributes;

		const blockProps = useBlockProps({
			className: "team-gallery flex flex-col items-center",
		});

		// Fetch total count of staff members to handle pagination
		const { posts, hasResolved, totalPosts } = useSelect(
			(select) => {
				const query = {
					per_page: postsPerPage,
					offset: currentIndex * postsPerPage,
					_embed: true,
					orderby: orderBy,
					order: order,
				};

				return {
					posts: select(coreStore).getEntityRecords(
						"postType",
						"medarbetare",
						query,
					),
					totalPosts: select(coreStore).getEntityRecordsTotalItems(
						"postType",
						"medarbetare",
						{},
					),
					hasResolved: select(coreStore).hasFinishedResolution(
						"getEntityRecords",
						["postType", "medarbetare", query],
					),
				};
			},
			[postsPerPage, currentIndex, order, orderBy],
		);

		const maxPages = Math.ceil((totalPosts || 0) / postsPerPage);

		const handlePrev = () => {
			if (currentIndex > 0) {
				setAttributes({ currentIndex: currentIndex - 1 });
			}
		};

		const handleNext = () => {
			if (currentIndex < maxPages - 1) {
				setAttributes({ currentIndex: currentIndex + 1 });
			}
		};

		return (
			<div {...blockProps}>
				<InspectorControls>
					<PanelBody title="Urval">
						<SelectControl
							label="Sortera efter"
							value={orderBy}
							options={[
								{ label: "Datum", value: "date" },
								{ label: "Titel", value: "title" },
							]}
							onChange={(val) => setAttributes({ orderBy: val })}
						/>
						<SelectControl
							label="Ordning"
							value={order}
							options={[
								{ label: "Stigande", value: "asc" },
								{ label: "Fallande", value: "desc" },
							]}
							onChange={(val) => setAttributes({ order: val })}
						/>
					</PanelBody>

					<PanelBody title="Rutnät dator">
						<QueryControls
							numberOfItems={postsPerPage}
							onNumberOfItemsChange={(val) =>
								setAttributes({ postsPerPage: val, currentIndex: 0 })
							}
						/>
					</PanelBody>

					<PanelBody title="Rutnät mobil">
						<QueryControls
							numberOfItems={mobilePostsPerPage}
							onNumberOfItemsChange={(val) =>
								setAttributes({ mobilePostsPerPage: val, currentIndex: 0 })
							}
						/>
					</PanelBody>

					<PanelColorSettings
						title="Färger"
						colorSettings={[
							{
								value: svgColor,
								onChange: (value) => setAttributes({ svgColor: value }),
								label: "Formens färg",
							},
						]}
					/>
				</InspectorControls>

				{!hasResolved ? (
					<Placeholder icon={<Spinner />} label="Hämtar medarbetare…" />
				) : posts?.length > 0 ? (
					<div className="w-full flex flex-col items-center relative overflow-visible">
						<BackgroundSVG color={svgColor} />
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full mb-12 pointer-events-none z-1 relative">
							{posts.map((post) => (
								<article
									key={post.id}
									className="flex flex-col h-full text-center"
								>
									<MemberImage
										imageId={post.acf?.employe_image}
										alt={post.title?.rendered || ""}
									/>
									<h3 className="text-2xl! font-bold mb-0 uppercase tracking-tight">
										{post.title?.rendered || "(No Title)"}
									</h3>
									<p className="text-lg leading-normal!">
										{post.acf?.employe_role || "(No Role)"}
									</p>
								</article>
							))}
						</div>

						{/* Gallery Controls */}
						<div className="flex items-center gap-12 mt-4">
							<button
								onClick={handlePrev}
								disabled={currentIndex === 0}
								style={{
									opacity: currentIndex === 0 ? 0.3 : 1,
									background: "none",
									border: "none",
								}}
							>
								<ArrowLeft />
							</button>
							<button
								onClick={handleNext}
								disabled={currentIndex >= maxPages - 1}
								style={{
									opacity: currentIndex >= maxPages - 1 ? 0.3 : 1,
									background: "none",
									border: "none",
								}}
							>
								<ArrowRight />
							</button>
						</div>
					</div>
				) : (
					<Placeholder label="Inga medarbetare hittades" icon="grid-view" />
				)}
			</div>
		);
	},
	save: () => null, // Dynamic block
});