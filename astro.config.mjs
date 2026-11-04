// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Until opus-mobile.com points at GitHub Pages, the site lives under
// nickbrinsmade.github.io/opus-website/. The deploy workflow sets these.
const site = process.env.SITE_URL || 'https://opus-mobile.com';
const base = process.env.SITE_BASE || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/merge-artists/') })],
});
