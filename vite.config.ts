import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Mini Rogue',
				short_name: 'Mini Rogue',
				description: 'A solitaire dungeon-crawling card game',
				theme_color: '#0a0a0f',
				background_color: '#0a0a0f',
				display: 'standalone',
				icons: [
					{
						src: 'favicon.png', // Fallback, we will use default icon logic or missing image logic for now
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'favicon.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom'
	}
});
