// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.nhakhoavcare.com',
  i18n: {
    locales: ['vi', 'en'],
    defaultLocale: 'vi',
    routing: {
      // Tiếng Việt ở gốc không tiền tố; tiếng Anh ở /en/.
      // Quyết định này giữ nguyên URL đang có thứ hạng — xem spec §7.
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
