import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

export default defineConfig({
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
	plugins: [enhancedImages(), tailwindcss() as Plugin[], sveltekit()]
});
