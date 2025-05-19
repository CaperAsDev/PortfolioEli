// @ts-check
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: "https://bridgetoscience.com",
  integrations: [icon(), sitemap(), mdx()],
  base: process.env.SERVER === 'development' ? `/${process.env.REPO}/` : '/',
  vite: {
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
  },
});