// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://hosseintrz.github.io',
  // User/organization Pages site is served from the domain root, so no `base` is needed.
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});