/**
 * Logo Slider - Frontend JavaScript
 * Handles continuous scrolling animation with pause on hover
 */

document.addEventListener('DOMContentLoaded', () => {
	const sliders = document.querySelectorAll('.logo-slider-container');

	sliders.forEach((container) => {
		const track = container.querySelector('.logo-slider-track');
		if (!track) {
			console.log('No track found in container');
			return;
		}

		const autoplay = track.dataset.autoplay !== 'false';
		const speed = parseInt(track.dataset.speed, 10) || 50;
		const pauseOnHover = track.dataset.pauseOnHover !== 'false';

		console.log('Logo slider init:', { autoplay, speed, pauseOnHover });
		console.log('Track items:', track.children.length);

		if (!autoplay) {
			track.style.animation = 'none';
			return;
		}

		const items = track.querySelectorAll(':scope > *');
		console.log('QuerySelector items:', items.length);
		if (items.length === 0) return;

		const trackStyle = getComputedStyle(track);
		const gap = parseFloat(trackStyle.gap) || 8; // default gap from Tailwind

		const itemWidth = Array.from(items).reduce((total, item) => {
			console.log('Item offsetWidth:', item.offsetWidth);
			return total + (item.offsetWidth || 0) + gap;
		}, 0);

		console.log('Item width:', itemWidth, 'Speed:', speed);
		const duration = (itemWidth / speed) * 2;
		track.style.animationDuration = `${duration}s`;
		console.log('Animation duration set to:', track.style.animationDuration);

		if (pauseOnHover) {
			container.addEventListener('mouseenter', () => {
				track.classList.add('paused');
			});
			container.addEventListener('mouseleave', () => {
				track.classList.remove('paused');
			});
		}
	});
});
