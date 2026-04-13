export const TEMPLATE_BUZZ = [
	[
		'core/group',
		{
			style: { spacing: { blockGap: '0rem' } },
			layout: {
				type: 'flex',
				orientation: 'vertical',
				justifyContent: 'center',
			},
		},
		[
			[
				'core/heading',
				{
					level: 3,
					placeholder: 'Buzz',
					content: 'buzz',
				},
			],
			[
				'core/heading',
				{
					style: {
						spacing: { margin: { top: '0rem', bottom: '2rem' } },
						typography: { lineHeight: '1.5rem' },
					},
					level: 4,
					placeholder: 'Strategi & Position',
					content: 'strategi & position',
				},
			],
			[
				'core/paragraph',
				{
					content:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et molestie ante. Sed risus diam, faucibus vel lectus at.',
				},
			],
			[
				'core/group',
				{
					layout: {
						type: 'flex',
						flexWrap: 'nowrap',
						justifyContent: 'space-between',
					},
					style: { spacing: { padding: { right: '0', left: '0' } } },
				},
				[
					[
						'core/group',
						{
							layout: { type: 'constrained' },
							style: {
								spacing: {
									margin: {
										top: 'var(--wp--preset--spacing--40)',
									},
								},
							},
						},
						[
							[
								'core/heading',
								{
									level: 6,
									content: 'lorem IPSUM',
									className:
										'has-accent-5-color has-text-color has-link-color',
								},
							],
							[
								'core/list',
								{
									className:
										'is-style-checkmark-list has-accent-5-color has-text-color has-link-color',
								},
								[
									[
										'core/list-item',
										{ content: 'Positionering' },
									],
									[
										'core/list-item',
										{ content: 'Kanaler & innehåll' },
									],
									[
										'core/list-item',
										{ content: 'Workshop' },
									],
								],
							],
						],
					],
					[
						'core/group',
						{
							layout: { type: 'constrained' },
							style: {
								spacing: {
									margin: {
										top: 'var(--wp--preset--spacing--40)',
									},
								},
							},
						},
						[
							[
								'core/heading',
								{
									level: 6,
									content: 'lorem IPSUM',
									className:
										'has-accent-5-color has-text-color has-link-color',
								},
							],
							[
								'core/list',
								{
									className:
										'is-style-checkmark-list has-accent-5-color has-text-color has-link-color',
								},
								[
									[
										'core/list-item',
										{ content: 'Positionering' },
									],
									[
										'core/list-item',
										{ content: 'Kanaler & innehåll' },
									],
									[
										'core/list-item',
										{ content: 'Workshop' },
									],
								],
							],
						],
					],
				],
			],
		],
	],
	[ 'create-block/my-handdrawn-button', { text: 'SE ALLA CASE' } ],
];

export const TEMPLATE_BUILD = [
	[
		'core/group',
		{
			style: { spacing: { blockGap: '0rem' } },
			layout: {
				type: 'flex',
				orientation: 'vertical',
				justifyContent: 'center',
			},
		},
		[
			[
				'core/heading',
				{
					level: 3,
					content: 'build',
				},
			],
			[
				'core/heading',
				{
					style: {
						spacing: { margin: { top: '0rem', bottom: '2rem' } },
						typography: { lineHeight: '1.5rem' },
					},
					level: 4,
					content: 'produktion & plattform',
				},
			],
			[
				'core/group',
				{
					layout: {
						type: 'flex',
						orientation: 'vertical',
						justifyContent: 'center',
					},
				},
				[
					[
						'core/list',
						{
							style: {
								typography: {
									fontStyle: 'italic',
									fontWeight: '400',
									lineHeight: '2',
									letterSpacing: '1px',
								},
							},
						},
						[
							[
								'core/list-item',
								{
									content: 'Webbutveckling & design',
									style: {
										typography: {
											textTransform: 'uppercase',
										},
									},
									className: 'has-medium-font-size',
								},
							],
							[
								'core/list-item',
								{
									content: 'Designsystem & UX',
									style: {
										typography: {
											textTransform: 'uppercase',
										},
									},
									className: 'has-medium-font-size',
								},
							],
							[
								'core/list-item',
								{
									content: 'Content & filmproduktion',
									style: {
										typography: {
											textTransform: 'uppercase',
										},
									},
									className: 'has-medium-font-size',
								},
							],
						],
					],
					[
						'core/group',
						{
							layout: { type: 'constrained' },
							className: 'w-full has-link-color',
							style: {
								color: {
									text: '#8f8f8f',
								},
								spacing: {
									margin: {
										top: 'var(--wp--preset--spacing--30)',
									},
								},
							},
						},
						[
							[
								'core/separator',
								{
									className: 'is-style-default',
									style: {
										border: {
											width: '1px',
											style: 'solid',
										},
										color: {
											text: 'inherit',
										},
										spacing: {
											margin: {
												top: '0',
												bottom: 'var(--wp--preset--spacing--20)',
											},
										},
									},
								},
							],
							[
								'core/heading',
								{
									level: 5,
									content: 'vi erbjuder också',
									className:
										'has-text-align-left has-small-font-size',
									style: {
										typography: { lineHeight: '2' },
										spacing: {
											margin: { bottom: '5px' },
										},
									},
								},
							],
							[
								'core/paragraph',
								{
									content:
										'Mallar, Presentationer, Mäss- & Eventmaterial, Contentproduktion, mm.',
									className: 'has-small-font-size',
									style: {
										typography: { textTransform: 'none' },
									},
								},
							],
						],
					],
				],
			],
		],
	],
	[ 'create-block/my-handdrawn-button', { text: 'SE ALLA CASE' } ],
];

export const TEMPLATE_BOOST = [
	[
		'core/group',
		{
			style: { spacing: { blockGap: '0rem' } },
			layout: {
				type: 'flex',
				orientation: 'vertical',
				justifyContent: 'center',
			},
		},
		[
			[
				'core/heading',
				{
					level: 3,
					content: 'boost',
				},
			],
			[
				'core/heading',
				{
					style: {
						spacing: { margin: { top: '0rem', bottom: '2rem' } },
						typography: { lineHeight: '1.5rem' },
					},
					level: 4,
					content: 'PERFORMANCE & OPTIMERING',
				},
			],
			[
				'core/group',
				{
					layout: { type: 'constrained' },
					style: {
						spacing: {
							margin: {
								bottom: 'var(--wp--preset--spacing--30)',
							},
						},
					},
				},
				[
					[ 'core/heading', { level: 6, content: 'LOREM IPSUM' } ],
					[
						'core/paragraph',
						{
							content:
								'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et molestie ante.',
							className: 'has-medium-font-size',
							style: { typography: { textTransform: 'none' } },
						},
					],
				],
			],
			[
				'core/group',
				{
					layout: { type: 'constrained' },
					style: {
						spacing: {
							margin: {
								bottom: 'var(--wp--preset--spacing--30)',
							},
						},
					},
				},
				[
					[ 'core/heading', { level: 6, content: 'LOREM IPSUM' } ],
					[
						'core/paragraph',
						{
							content:
								'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et molestie ante.',
							className: 'has-medium-font-size',
							style: { typography: { textTransform: 'none' } },
						},
					],
				],
			],
			[
				'core/group',
				{
					layout: { type: 'constrained' },
				},
				[
					[ 'core/heading', { level: 6, content: 'LOREM IPSUM' } ],
					[
						'core/paragraph',
						{
							content:
								'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et molestie ante.',
							className: 'has-medium-font-size',
							style: { typography: { textTransform: 'none' } },
						},
					],
				],
			],
		],
	],
	[ 'create-block/my-handdrawn-button', { text: 'SE ALLA CASE' } ],
];
