// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { assertNoPlaceholders } from './src/data/clinic.ts';

import sitemap from '@astrojs/sitemap';

/** Chặn deploy khi clinic.ts còn giá trị giữ chỗ. Chỉ áp dụng lúc build, không cản dev. */
function guardClinicData() {
  return {
    name: 'guard-clinic-data',
    hooks: {
      'astro:build:start': () => {
        if (process.env.ALLOW_PLACEHOLDER_CLINIC === '1') {
          console.warn(
            '⚠️  Bỏ qua kiểm tra dữ liệu phòng khám (ALLOW_PLACEHOLDER_CLINIC=1). ' +
              'Không được dùng cờ này khi deploy production.',
          );
          return;
        }
        assertNoPlaceholders();
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.nhakhoavcare.com',

  // SSG: mọi trang dựng sẵn thành HTML tĩnh lúc build. Không có máy chủ chạy lúc khách truy cập,
  // nên tốc độ chỉ phụ thuộc CDN — đúng mục tiêu nhanh trên 4G ở Đà Nẵng (spec §4).
  output: 'static',

  integrations: [
    guardClinicData(),
    sitemap({
      // Sitemap khai đầy đủ quan hệ hai ngôn ngữ để Google hiểu đây là bản dịch
      // của nhau, không phải nội dung trùng lặp.
      i18n: {
        defaultLocale: 'vi',
        locales: { vi: 'vi-VN', en: 'en-US' },
      },
      // Trang hỏng hoặc trang kỹ thuật không được vào sitemap.
      filter: (page) => !page.includes('/404'),
    }),
  ],

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