// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { assertNoPlaceholders } from './src/data/clinic.ts';

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
  integrations: [guardClinicData()],
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
