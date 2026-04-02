export default defineEventHandler(async (event) => {
	try {
		const [globals, headerNavigation, footerNavigation] = await Promise.all([
			directusServer.request(
				readSingleton('globals', {
					fields: ['title', 'description', 'logo', 'logo_dark_mode', 'logo_size', 'social_links', 'accent_color', 'favicon'],
				}),
			),
			directusServer.request(
				readItem('navigation', 'main', {
					fields: [
						'id',
						'title',
						{
							items: [
								'id',
								'title',
								'url',
								'type',
								{
									page: ['id', 'permalink'],
									post: ['id', 'slug'],
									children: ['id', 'title', 'url', 'type', {
										page: ['id', 'permalink'],
										post: ['id', 'slug']
									}],
								},
							],
						},
					],
					deep: {
						items: {
							_sort: ['sort'],
							children: {
								_sort: ['sort'],
							},
						},
					},
				}),
			),

			directusServer.request(
				readItem('navigation', 'footer', {
					fields: [
						'id',
						'title',
						{
							items: [
								'id',
								'title',
								'url',
								'type',
								{
									page: ['id', 'permalink'],
									post: ['id', 'slug'],
									children: ['id', 'title', 'url', 'type', {
										page: ['id', 'permalink'],
										post: ['id', 'slug']
									}],
								},
							],
						},
					],
					deep: {
						items: {
							_sort: ['sort'],
							children: {
								_sort: ['sort'],
							},
						},
					},
				}),
			),
		]);

		return { globals, headerNavigation, footerNavigation };
        } catch (error) {
                console.error('Directus API Error:', error);
	}
});
