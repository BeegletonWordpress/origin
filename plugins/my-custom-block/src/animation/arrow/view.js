import { DotLottie } from "@lottiefiles/dotlottie-web";

document.addEventListener("DOMContentLoaded", () => {
	document
		.querySelectorAll("canvas.animated-arrow-block__lottie")
		.forEach((canvas) => {
			const dotLottie = new DotLottie({
				canvas,
				src: canvas.dataset.src,
				loop: true,
				autoplay: true,
				segment: [0, 43],
				speed: 0.5,
			});

			dotLottie.addEventListener("load", () => {
				console.log("total frames:", dotLottie.totalFrames);
			});
		});
});
