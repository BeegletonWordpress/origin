/**
 * Markup pieces shared by index.js and deprecated.js. Changing their output
 * changes save() for every version that uses them, so freeze a copy in
 * deprecated.js first if older content still depends on the old output.
 */
export const getRowClasses = () =>
	"subpage-video-hero__row flex flex-col py-12 mb-8 md:flex-row w-full gap-4 md:gap-2 m-auto md:items-stretch md:min-h-[65vh] md:max-h-187.5";

export const getColumnClasses = (contentWidth) =>
	`w-full relative ${contentWidth === 50 ? "md:w-[50%]" : "md:w-[40%]"}`;

// Only rendered when an overlay is set; a cleared gradient is saved as "".
export const Overlay = ({ color, gradient, opacity }) => {
	if (!color && !gradient) {
		return null;
	}

	return (
		<span
			className="subpage-video-hero__overlay"
			aria-hidden="true"
			style={{ background: gradient || color, opacity: opacity / 100 }}
		/>
	);
};

export const BackgroundMedia = ({ url, type }) => {
	if (!url) {
		return null;
	}

	if (type === "video") {
		return (
			<video
				className="w-full h-full object-cover"
				src={url}
				autoPlay
				muted
				loop
				playsInline
				preload="auto"
			/>
		);
	}

	return <img className="w-full h-full object-cover" src={url} alt="" />;
};
