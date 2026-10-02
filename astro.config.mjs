import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lasoireebridal.com',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      filter: (page) => !/\/(thank-you|404)\/?$/.test(page),
      serialize(item) {
        if (item.url === 'https://lasoireebridal.com/') item.priority = 1.0;
        else if (/\/(collection|book|vip|experience|designers)\/$/.test(item.url)) item.priority = 0.9;
        return item;
      },
    }),
  ],
});
