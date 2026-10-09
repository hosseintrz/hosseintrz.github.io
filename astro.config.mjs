// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://hosseintrz.github.io',
  // User/organization Pages site is served from the domain root, so no `base` is needed.
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // keep internal tooling out of the sitemap
      filter: (page) => !/\/(og\/|design|uses|404)/.test(page),
    }),
  ],
  markdown: {
    shikiConfig: {
      // Dual themes: tokens are emitted as CSS vars; globals.css maps them
      // to [data-theme] so code blocks follow the site theme.
      themes: { light: 'one-light', dark: 'one-dark-pro' },
      defaultColor: false,
    },
  },
});