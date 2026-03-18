export const TEMPLATE_BUZZ = [
	[
		"core/group",
		{
			style: { spacing: { blockGap: "0rem" } },
			layout: {
				type: "flex",
				orientation: "vertical",
				justifyContent: "center",
			},
		},
		[
			[
				"core/heading",
				{
					level: 3,
					placeholder: "Buzz",
					content: "buzz",
				},
			],
			[
				"core/heading",
				{
					style: {
						spacing: { margin: { top: "0rem", bottom: "2rem" } },
						typography: { lineHeight: "1.5rem" },
					},
					level: 4,
					placeholder: "Strategi & Position",
					content: "strategi & position",
				},
			],
			[
				"core/paragraph",
				{
					content:
						"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et molestie ante. Sed risus diam, faucibus vel lectus at.",
				},
			],
			[
				"core/group",
				{
					layout: {
						type: "flex",
						flexWrap: "nowrap",
						justifyContent: "space-between",
					},
					style: { spacing: { padding: { right: "0", left: "0" } } },
				},
				[
					[
						"core/group",
						{
							layout: { type: "constrained" },
							style: { spacing: { margin: { top: "var(--wp--preset--spacing--40)" } } },
						},
						[
							[
								"core/heading",
								{
									level: 6,
									content: "lorem IPSUM",
									className: "has-accent-5-color has-text-color has-link-color",
								},
							],
							[
								"core/list",
								{
									className: "is-style-checkmark-list has-accent-5-color has-text-color has-link-color",
								},
								[
									["core/list-item", { content: "Positionering" }],
									["core/list-item", { content: "Kanaler & innehåll" }],
									["core/list-item", { content: "Workshop" }],
								],
							],
						],
					],
					[
						"core/group",
						{
							layout: { type: "constrained" },
							style: { spacing: { margin: { top: "var(--wp--preset--spacing--40)" } } },
						},
						[
							[
								"core/heading",
								{
									level: 6,
									content: "lorem IPSUM",
									className: "has-accent-5-color has-text-color has-link-color",
								},
							],
							[
								"core/list",
								{
									className: "is-style-checkmark-list has-accent-5-color has-text-color has-link-color",
								},
								[
									["core/list-item", { content: "Positionering" }],
									["core/list-item", { content: "Kanaler & innehåll" }],
									["core/list-item", { content: "Workshop" }],
								],
							],
						],
					],
				],
			],
		],
	],
	["create-block/my-handdrawn-button", { text: "SE ALLA CASE" }],
];

export const TEMPLATE_BUILD = [
	[
		"core/group",
		{
			style: { spacing: { blockGap: "0rem" } },
			layout: {
				type: "flex",
				orientation: "vertical",
				justifyContent: "center",
			},
		},
		[
			[
				"core/heading",
				{
					level: 3,
					content: "build",
				},
			],
			[
				"core/heading",
				{
					style: {
						spacing: { margin: { top: "0rem", bottom: "2rem" } },
						typography: { lineHeight: "1.5rem" },
					},
					level: 4,
					content: "produktion & plattform",
				},
			],
			[
				"core/list",
				{
					className: "!list-disc is-style-default",
					style: { typography: { lineHeight: "2" } },
				},
				[
					[
						"core/list-item",
						{
							content: "<em>Webbutveckling & design</em>",
							style: {
								typography: {
									fontStyle: "normal",
									fontWeight: "400",
									textTransform: "uppercase",
								},
							},
							className: "has-medium-font-size",
						},
					],
					[
						"core/list-item",
						{
							content: "<em>Designsystem & UX</em>",
							style: { typography: { textTransform: "uppercase" } },
						},
					],
					[
						"core/list-item",
						{
							content: "<em>Content & filmproduktion</em>",
							style: { typography: { textTransform: "uppercase" } },
						},
					],
				],
			],
			[
				"core/separator",
				{
					className: "is-style-default has-text-color has-accent-5-color has-alpha-channel-opacity has-accent-5-background-color has-background",
					style: {
						spacing: { margin: { top: "var(--wp--preset--spacing--20)", bottom: "var(--wp--preset--spacing--20)" } },
					},
				},
			],
			[
				"core/group",
				{
					layout: { type: "constrained" },
					className: "has-accent-6-color has-text-color has-link-color",
					style: { spacing: { margin: { top: "var(--wp--preset--spacing--30)" } } },
				},
				[
					[
						"core/heading",
						{
							level: 6,
							content: "vi erbjuder också",
							className: "has-text-align-left",
						},
					],
					[
						"core/paragraph",
						{
							content: "MALLAR, PRESENTATIONER, MÄSS- & EVENTMATERIAL, CONTENTPRODUKTION, MM.",
							className: "has-small-font-size",
						},
					],
				],
			],
		],
	],
	["create-block/my-handdrawn-button", { text: "SE ALLA CASE" }],
];

export const TEMPLATE_BOOST = [
	[
		"core/group",
		{
			style: { spacing: { blockGap: "0rem" } },
			layout: {
				type: "flex",
				orientation: "vertical",
				justifyContent: "center",
			},
		},
		[
			[
				"core/heading",
				{
					level: 3,
					content: "boost",
				},
			],
			[
				"core/heading",
				{
					style: {
						spacing: { margin: { top: "0rem", bottom: "2rem" } },
						typography: { lineHeight: "1.5rem" },
					},
					level: 4,
					content: "PERFORMANCE & OPTIMERING",
				},
			],
			[
				"core/group",
				{
					layout: { type: "constrained" },
					style: { spacing: { margin: { bottom: "var(--wp--preset--spacing--30)" } } },
				},
				[
					["core/heading", { level: 6, content: "LOREM IPSUM" }],
					[
						"core/paragraph",
						{
							content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et molestie ante.",
							className: "has-medium-font-size",
							style: { typography: { textTransform: "none" } },
						},
					],
				],
			],
			[
				"core/group",
				{
					layout: { type: "constrained" },
					style: { spacing: { margin: { bottom: "var(--wp--preset--spacing--30)" } } },
				},
				[
					["core/heading", { level: 6, content: "LOREM IPSUM" }],
					[
						"core/paragraph",
						{
							content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et molestie ante.",
							className: "has-medium-font-size",
							style: { typography: { textTransform: "none" } },
						},
					],
				],
			],
			[
				"core/group",
				{
					layout: { type: "constrained" },
				},
				[
					["core/heading", { level: 6, content: "LOREM IPSUM" }],
					[
						"core/paragraph",
						{
							content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et molestie ante.",
							className: "has-medium-font-size",
							style: { typography: { textTransform: "none" } },
						},
					],
				],
			],
		],
	],
	["create-block/my-handdrawn-button", { text: "SE ALLA CASE" }],
];
