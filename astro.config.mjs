// @ts-check
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: "https://focuson.com",
  integrations: [icon(), sitemap()],
  base: process.env.SERVER === 'development' ? `/${process.env.REPO}/` : '/',
});