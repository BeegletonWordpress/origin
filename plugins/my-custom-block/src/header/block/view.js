const header = document.querySelector(".wp-block-create-block-my-header-block");

if (header) {
	window.addEventListener(
		"scroll",
		() => {
			if (window.scrollY > 50) {
				header.classList.add("is-scrolled");
			} else {
				header.classList.remove("is-scrolled");
			}
		},
		{ passive: true },
	);
}
