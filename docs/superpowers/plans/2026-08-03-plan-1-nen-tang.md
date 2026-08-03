# Plan 1 — Nền tảng: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dựng nền tảng Astro đa ngôn ngữ deploy được lên Cloudflare Pages, với một nguồn dữ liệu phòng khám duy nhất, lớp định tuyến i18n có slug dịch riêng, và Zod schema chặn nội dung sai từ lúc build.

**Architecture:** Astro 5 xuất tĩnh, không JavaScript phía client trừ đoạn script chống lóe sáng khi đổi theme. Toàn bộ logic thuần (dữ liệu phòng khám, chuỗi giao diện, ánh xạ route) nằm trong file `.ts` riêng có unit test; component `.astro` chỉ lắp ráp và được kiểm bằng Astro Container API. Slug dịch theo từng ngôn ngữ nên `getRelativeLocaleUrl()` của Astro không đủ — có lớp `routes.ts` tự viết làm nguồn sự thật cho mọi đường dẫn.

**Tech Stack:** Astro 5, Tailwind 4 (`@tailwindcss/vite`), TypeScript strict, Zod (`astro/zod`), Vitest, Wrangler, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-08-03-nhakhoavcare-rebuild-design.md`

---

## Phạm vi Plan 1

**Trong:** scaffold, i18n routing + slug dịch, `clinic.ts`, chuỗi giao diện, Content Collections + Zod, design tokens sáng/tối, script chống lóe sáng, layout/header/footer, nút chuyển ngôn ngữ, wrangler deploy, lệnh kiểm tổng hợp.

**Ngoài (để Plan 2–4):** nội dung thật, hệ ngôn ngữ thiết kế qua Impeccable, Pagefind, modal tìm kiếm, JSON-LD, redirects, đổi DNS.

**Kết quả:** một site hai ngôn ngữ deploy được lên URL preview của Cloudflare, có header/footer đọc từ `clinic.ts`, chuyển ngôn ngữ giữ đúng trang, chuyển theme không lóe, toàn bộ test xanh.

---

## Cấu trúc file

| File | Trách nhiệm |
|---|---|
| `astro.config.mjs` | Cấu hình Astro: i18n, Tailwind, site URL |
| `vitest.config.ts` | Cấu hình test dùng `getViteConfig` của Astro |
| `wrangler.toml` | Cấu hình Cloudflare Pages |
| `src/i18n/locales.ts` | Kiểu `Locale`, hằng số ngôn ngữ. Không phụ thuộc gì |
| `src/i18n/ui.ts` | Chuỗi giao diện vi/en + hàm `t()` |
| `src/i18n/routes.ts` | **Nguồn sự thật cho mọi đường dẫn.** key+locale → path, path → key, cặp hreflang |
| `src/data/clinic.ts` | **Nguồn sự thật cho dữ liệu phòng khám.** Có Zod tự kiểm, chặn giá trị giả khi build production |
| `src/content.config.ts` | Zod schema cho collection `services` |
| `src/styles/global.css` | Import Tailwind + design token theo vai trò, hai chế độ màu |
| `src/components/ThemeScript.astro` | Script chặn trong `<head>`, chống lóe sáng |
| `src/components/Header.astro` | Điều hướng + nút gọi, đọc từ `clinic.ts` |
| `src/components/Footer.astro` | Liên hệ + giờ làm việc, đọc từ `clinic.ts` |
| `src/components/LanguageSwitcher.astro` | Chuyển ngôn ngữ giữ đúng trang, dùng `routes.ts` |
| `src/layouts/BaseLayout.astro` | HTML ngữ nghĩa, meta, hreflang, skip link |
| `src/pages/index.astro` · `src/pages/en/index.astro` | Trang chủ hai ngôn ngữ |

Nguyên tắc: mọi thứ có logic đều nằm trong `.ts` để test thẳng. File `.astro` chỉ lắp ráp.

---

## Task 1: Scaffold dự án

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/global.css`

- [ ] **Step 1: Tạo dự án Astro tối giản**

```bash
npm create astro@latest . -- --template minimal --install --no-git --typescript strict --skip-houston
```

Trả lời `y` khi hỏi ghi vào thư mục đang có file (repo đã có `docs/` và `.gitignore`).

- [ ] **Step 2: Thêm Tailwind 4**

```bash
npx astro add tailwind --yes
```

Lệnh này cài `@tailwindcss/vite`, thêm plugin vào `astro.config.mjs`, và tạo `src/styles/global.css` chứa `@import "tailwindcss";`.

- [ ] **Step 3: Cài Vitest**

```bash
npm i -D vitest
```

- [ ] **Step 4: Kiểm scaffold chạy được**

```bash
npx astro check && npx astro build
```

Kỳ vọng: `0 errors` và build thành công, sinh thư mục `dist/`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro 5 + Tailwind 4 + TypeScript strict"
```

---

## Task 2: Cấu hình i18n và Vitest

**Files:**
- Modify: `astro.config.mjs`
- Create: `vitest.config.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Cấu hình i18n trong `astro.config.mjs`**

Thay toàn bộ nội dung file bằng:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

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
```

- [ ] **Step 2: Tạo `vitest.config.ts`**

```ts
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 3: Thêm scripts vào `package.json`**

Trong khối `"scripts"`, thêm:

```json
"test": "vitest run",
"test:watch": "vitest",
"verify": "astro check && vitest run && astro build"
```

- [ ] **Step 4: Kiểm Vitest chạy được**

```bash
npm test
```

Kỳ vọng: `No test files found` — Vitest khởi động được, chưa có test nào. Đây là kết quả đúng ở bước này.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: cấu hình i18n vi/en và Vitest"
```

---

## Task 3: Kiểu Locale

**Files:**
- Create: `src/i18n/locales.ts`
- Test: `src/i18n/locales.test.ts`

- [ ] **Step 1: Viết test thất bại**

`src/i18n/locales.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { LOCALES, DEFAULT_LOCALE, isLocale } from './locales';

describe('locales', () => {
  it('hỗ trợ đúng hai ngôn ngữ', () => {
    expect(LOCALES).toEqual(['vi', 'en']);
  });

  it('mặc định là tiếng Việt', () => {
    expect(DEFAULT_LOCALE).toBe('vi');
  });

  it('nhận diện locale hợp lệ', () => {
    expect(isLocale('vi')).toBe(true);
    expect(isLocale('en')).toBe(true);
  });

  it('từ chối chuỗi không phải locale', () => {
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('')).toBe(false);
    expect(isLocale('VI')).toBe(false);
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận thất bại**

```bash
npm test -- src/i18n/locales.test.ts
```

Kỳ vọng: FAIL — `Failed to resolve import "./locales"`.

- [ ] **Step 3: Viết implementation tối thiểu**

`src/i18n/locales.ts`:

```ts
export const LOCALES = ['vi', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'vi';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
```

- [ ] **Step 4: Chạy test để xác nhận pass**

```bash
npm test -- src/i18n/locales.test.ts
```

Kỳ vọng: PASS, 4 test.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/locales.ts src/i18n/locales.test.ts
git commit -m "feat(i18n): thêm kiểu Locale và hằng số ngôn ngữ"
```

---

## Task 4: Lớp định tuyến có slug dịch

Đây là task quan trọng nhất của Plan 1. `getRelativeLocaleUrl()` của Astro chỉ thêm tiền tố `/en/`, **không đổi được slug**. Vì spec chốt slug dịch riêng cho từng ngôn ngữ, cần lớp này làm nguồn sự thật.

**Files:**
- Create: `src/i18n/routes.ts`
- Test: `src/i18n/routes.test.ts`

- [ ] **Step 1: Viết test thất bại**

`src/i18n/routes.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { pathFor, keyFromPath, alternateLinks, SERVICE_KEYS } from './routes';

describe('pathFor', () => {
  it('trang chủ tiếng Việt ở gốc, không tiền tố', () => {
    expect(pathFor('home', 'vi')).toBe('/');
  });

  it('trang chủ tiếng Anh có tiền tố /en/', () => {
    expect(pathFor('home', 'en')).toBe('/en/');
  });

  it('dịch cả segment lẫn slug cho trang dịch vụ', () => {
    expect(pathFor('service:implant', 'vi')).toBe('/dich-vu/cay-ghep-implant/');
    expect(pathFor('service:implant', 'en')).toBe('/en/services/dental-implant/');
  });

  it('dịch trang tĩnh', () => {
    expect(pathFor('pricing', 'vi')).toBe('/bang-gia/');
    expect(pathFor('pricing', 'en')).toBe('/en/pricing/');
  });

  it('ném lỗi với key không tồn tại', () => {
    // @ts-expect-error key không hợp lệ, kiểm hành vi lúc chạy
    expect(() => pathFor('khong-ton-tai', 'vi')).toThrow(/khong-ton-tai/);
  });
});

describe('keyFromPath', () => {
  it('nhận ra trang chủ ở cả hai ngôn ngữ', () => {
    expect(keyFromPath('/')).toEqual({ key: 'home', locale: 'vi' });
    expect(keyFromPath('/en/')).toEqual({ key: 'home', locale: 'en' });
  });

  it('nhận ra trang dịch vụ ở cả hai ngôn ngữ', () => {
    expect(keyFromPath('/dich-vu/cay-ghep-implant/')).toEqual({
      key: 'service:implant',
      locale: 'vi',
    });
    expect(keyFromPath('/en/services/dental-implant/')).toEqual({
      key: 'service:implant',
      locale: 'en',
    });
  });

  it('bỏ qua dấu gạch chéo cuối', () => {
    expect(keyFromPath('/bang-gia')).toEqual({ key: 'pricing', locale: 'vi' });
    expect(keyFromPath('/bang-gia/')).toEqual({ key: 'pricing', locale: 'vi' });
  });

  it('trả null với đường dẫn không nhận ra', () => {
    expect(keyFromPath('/khong-co-trang-nay/')).toBeNull();
  });
});

describe('alternateLinks — đây là thứ chặn lỗi nút đổi ngôn ngữ đá về trang chủ', () => {
  it('trang dịch vụ tiếng Việt trỏ sang đúng trang dịch vụ tiếng Anh', () => {
    expect(alternateLinks('/dich-vu/cay-ghep-implant/')).toEqual([
      { locale: 'vi', path: '/dich-vu/cay-ghep-implant/' },
      { locale: 'en', path: '/en/services/dental-implant/' },
    ]);
  });

  it('hoạt động theo chiều ngược lại', () => {
    expect(alternateLinks('/en/services/dental-implant/')).toEqual([
      { locale: 'vi', path: '/dich-vu/cay-ghep-implant/' },
      { locale: 'en', path: '/en/services/dental-implant/' },
    ]);
  });

  it('đường dẫn lạ thì lùi về trang chủ từng ngôn ngữ', () => {
    expect(alternateLinks('/khong-co-trang-nay/')).toEqual([
      { locale: 'vi', path: '/' },
      { locale: 'en', path: '/en/' },
    ]);
  });
});

describe('mọi key đều có đường dẫn ở cả hai ngôn ngữ', () => {
  it('không dịch vụ nào thiếu slug', () => {
    for (const key of SERVICE_KEYS) {
      expect(pathFor(`service:${key}`, 'vi')).toMatch(/^\/dich-vu\//);
      expect(pathFor(`service:${key}`, 'en')).toMatch(/^\/en\/services\//);
    }
  });

  it('đường dẫn sinh ra luôn quay ngược lại đúng key', () => {
    for (const key of SERVICE_KEYS) {
      const routeKey = `service:${key}` as const;
      expect(keyFromPath(pathFor(routeKey, 'vi'))).toEqual({ key: routeKey, locale: 'vi' });
      expect(keyFromPath(pathFor(routeKey, 'en'))).toEqual({ key: routeKey, locale: 'en' });
    }
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận thất bại**

```bash
npm test -- src/i18n/routes.test.ts
```

Kỳ vọng: FAIL — `Failed to resolve import "./routes"`.

- [ ] **Step 3: Viết implementation**

`src/i18n/routes.ts`:

```ts
import { DEFAULT_LOCALE, LOCALES, type Locale } from './locales';

/** Slug từng dịch vụ theo ngôn ngữ. Đây là nguồn sự thật — không viết URL tay ở bất kỳ đâu khác. */
export const SERVICE_SLUGS = {
  implant: { vi: 'cay-ghep-implant', en: 'dental-implant' },
  veneer: { vi: 'dan-su-veneer', en: 'porcelain-veneers' },
  crown: { vi: 'boc-rang-su', en: 'dental-crowns' },
  whitening: { vi: 'tay-trang-rang', en: 'teeth-whitening' },
  braces: { vi: 'nieng-rang-chinh-nha', en: 'orthodontics' },
  scaling: { vi: 'lay-cao-rang', en: 'teeth-scaling' },
  rootCanal: { vi: 'chua-tuy-rang', en: 'root-canal-treatment' },
  denture: { vi: 'phuc-hinh-thao-lap', en: 'dentures' },
} as const satisfies Record<string, Record<Locale, string>>;

export type ServiceKey = keyof typeof SERVICE_SLUGS;

export const SERVICE_KEYS = Object.keys(SERVICE_SLUGS) as ServiceKey[];

/** Segment đầu của đường dẫn, dịch theo ngôn ngữ. */
const SEGMENTS = {
  services: { vi: 'dich-vu', en: 'services' },
} as const satisfies Record<string, Record<Locale, string>>;

/** Trang tĩnh: key → slug theo ngôn ngữ. Chuỗi rỗng nghĩa là trang gốc. */
const STATIC_PAGES = {
  home: { vi: '', en: '' },
  about: { vi: 'gioi-thieu', en: 'about' },
  pricing: { vi: 'bang-gia', en: 'pricing' },
  contact: { vi: 'lien-he', en: 'contact' },
  blog: { vi: 'kien-thuc-nha-khoa', en: 'dental-knowledge' },
} as const satisfies Record<string, Record<Locale, string>>;

export type StaticPageKey = keyof typeof STATIC_PAGES;

export type RouteKey = StaticPageKey | `service:${ServiceKey}`;

/** Thêm tiền tố ngôn ngữ. Tiếng Việt là mặc định nên không có tiền tố. */
function withLocalePrefix(locale: Locale, segments: string[]): string {
  const parts = locale === DEFAULT_LOCALE ? segments : [locale, ...segments];
  const body = parts.filter(Boolean).join('/');
  return body === '' ? '/' : `/${body}/`;
}

/** Đường dẫn tuyệt đối cho một key ở một ngôn ngữ. Luôn có gạch chéo cuối. */
export function pathFor(key: RouteKey, locale: Locale): string {
  if (key.startsWith('service:')) {
    const serviceKey = key.slice('service:'.length) as ServiceKey;
    const slugs = SERVICE_SLUGS[serviceKey];
    if (!slugs) throw new Error(`Không có dịch vụ nào ứng với key: ${key}`);
    return withLocalePrefix(locale, [SEGMENTS.services[locale], slugs[locale]]);
  }

  const page = STATIC_PAGES[key as StaticPageKey];
  if (!page) throw new Error(`Không có trang nào ứng với key: ${key}`);
  return withLocalePrefix(locale, [page[locale]]);
}

/** Bảng tra ngược, dựng một lần lúc nạp module. */
const PATH_TO_KEY = new Map<string, { key: RouteKey; locale: Locale }>();
for (const locale of LOCALES) {
  for (const key of Object.keys(STATIC_PAGES) as StaticPageKey[]) {
    PATH_TO_KEY.set(pathFor(key, locale), { key, locale });
  }
  for (const serviceKey of SERVICE_KEYS) {
    const key = `service:${serviceKey}` as const;
    PATH_TO_KEY.set(pathFor(key, locale), { key, locale });
  }
}

/** Chuẩn hoá về dạng có gạch chéo hai đầu để tra bảng. */
function normalise(path: string): string {
  const trimmed = path.replace(/\/+$/, '');
  return trimmed === '' ? '/' : `${trimmed}/`;
}

export function keyFromPath(path: string): { key: RouteKey; locale: Locale } | null {
  return PATH_TO_KEY.get(normalise(path)) ?? null;
}

/**
 * Đường dẫn tương ứng ở mọi ngôn ngữ, dùng cho hreflang và nút đổi ngôn ngữ.
 * Đường dẫn không nhận ra thì lùi về trang chủ từng ngôn ngữ — thà về trang chủ
 * còn hơn dẫn khách tới trang 404.
 */
export function alternateLinks(path: string): Array<{ locale: Locale; path: string }> {
  const match = keyFromPath(path);
  return LOCALES.map((locale) => ({
    locale,
    path: match ? pathFor(match.key, locale) : pathFor('home', locale),
  }));
}
```

- [ ] **Step 4: Chạy test để xác nhận pass**

```bash
npm test -- src/i18n/routes.test.ts
```

Kỳ vọng: PASS, 12 test.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/routes.ts src/i18n/routes.test.ts
git commit -m "feat(i18n): lớp định tuyến có slug dịch riêng cho từng ngôn ngữ"
```

---

## Task 5: Chuỗi giao diện

**Files:**
- Create: `src/i18n/ui.ts`
- Test: `src/i18n/ui.test.ts`

- [ ] **Step 1: Viết test thất bại**

`src/i18n/ui.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { UI, useTranslations } from './ui';
import { LOCALES } from './locales';

describe('UI', () => {
  it('mọi ngôn ngữ có đúng cùng bộ key', () => {
    const viKeys = Object.keys(UI.vi).sort();
    const enKeys = Object.keys(UI.en).sort();
    expect(enKeys).toEqual(viKeys);
  });

  it('không chuỗi nào để rỗng', () => {
    for (const locale of LOCALES) {
      for (const [key, value] of Object.entries(UI[locale])) {
        expect(value, `${locale}.${key} đang rỗng`).not.toBe('');
      }
    }
  });
});

describe('useTranslations', () => {
  it('trả chuỗi đúng ngôn ngữ', () => {
    expect(useTranslations('vi')('nav.services')).toBe('Dịch vụ');
    expect(useTranslations('en')('nav.services')).toBe('Services');
  });

  it('ném lỗi khi key không tồn tại — thiếu bản dịch phải fail lúc build, không im lặng', () => {
    // @ts-expect-error key không hợp lệ, kiểm hành vi lúc chạy
    expect(() => useTranslations('vi')('nav.khong-ton-tai')).toThrow(/nav.khong-ton-tai/);
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận thất bại**

```bash
npm test -- src/i18n/ui.test.ts
```

Kỳ vọng: FAIL — `Failed to resolve import "./ui"`.

- [ ] **Step 3: Viết implementation**

`src/i18n/ui.ts`:

```ts
import type { Locale } from './locales';

export const UI = {
  vi: {
    'nav.home': 'Trang chủ',
    'nav.about': 'Giới thiệu',
    'nav.services': 'Dịch vụ',
    'nav.pricing': 'Bảng giá',
    'nav.blog': 'Kiến thức nha khoa',
    'nav.contact': 'Liên hệ',
    'nav.skipToContent': 'Bỏ qua, tới nội dung chính',
    'nav.openMenu': 'Mở menu',
    'nav.closeMenu': 'Đóng menu',
    'cta.call': 'Gọi ngay',
    'cta.zalo': 'Nhắn Zalo',
    'cta.directions': 'Chỉ đường',
    'footer.hours': 'Giờ làm việc',
    'footer.contact': 'Liên hệ',
    'footer.address': 'Địa chỉ',
    'footer.closed': 'Nghỉ',
    'lang.switchTo': 'Chuyển sang tiếng Anh',
    'lang.current': 'Tiếng Việt',
    'theme.label': 'Giao diện',
    'theme.system': 'Theo hệ thống',
    'theme.light': 'Sáng',
    'theme.dark': 'Tối',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.pricing': 'Pricing',
    'nav.blog': 'Dental Knowledge',
    'nav.contact': 'Contact',
    'nav.skipToContent': 'Skip to main content',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'cta.call': 'Call now',
    'cta.zalo': 'Chat on Zalo',
    'cta.directions': 'Get directions',
    'footer.hours': 'Opening hours',
    'footer.contact': 'Contact',
    'footer.address': 'Address',
    'footer.closed': 'Closed',
    'lang.switchTo': 'Chuyển sang tiếng Việt',
    'lang.current': 'English',
    'theme.label': 'Theme',
    'theme.system': 'System',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UIKey = keyof (typeof UI)['vi'];

export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    const value = UI[locale][key];
    if (value === undefined) {
      throw new Error(`Thiếu bản dịch cho key "${key}" ở ngôn ngữ "${locale}"`);
    }
    return value;
  };
}
```

- [ ] **Step 4: Chạy test để xác nhận pass**

```bash
npm test -- src/i18n/ui.test.ts
```

Kỳ vọng: PASS, 4 test.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/ui.ts src/i18n/ui.test.ts
git commit -m "feat(i18n): chuỗi giao diện vi/en với kiểm tra đủ key"
```

---

## Task 6: Dữ liệu phòng khám — nguồn duy nhất

Spec §6: site cũ hiện giờ làm việc ở hai nơi với số liệu khác nhau. File này chặn lỗi đó về mặt cấu trúc.

Dữ liệu thật chưa có (spec §18-B). Giải pháp: giá trị giữ chỗ mang sentinel `CHUA_CO`, và Zod **từ chối sentinel khi build production** — làm được `npm run dev` ngay bây giờ, nhưng không thể lỡ tay deploy site với số điện thoại giả.

**Files:**
- Create: `src/data/clinic.ts`
- Test: `src/data/clinic.test.ts`

- [ ] **Step 1: Viết test thất bại**

`src/data/clinic.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { clinic, clinicSchema, PLACEHOLDER, telHref, zaloHref } from './clinic';

describe('clinic', () => {
  it('hợp lệ theo schema', () => {
    expect(() => clinicSchema.parse(clinic)).not.toThrow();
  });

  it('có đủ 7 ngày trong tuần', () => {
    expect(Object.keys(clinic.hours)).toHaveLength(7);
  });
});

describe('bảo vệ giá trị giữ chỗ', () => {
  it('cho phép sentinel khi KHÔNG phải build production', () => {
    const result = clinicSchema.safeParse({ ...clinic, phone: PLACEHOLDER });
    expect(result.success).toBe(true);
  });

  it('từ chối sentinel khi build production — không thể deploy với số điện thoại giả', () => {
    const strict = clinicSchema.refine(
      (c) => !JSON.stringify(c).includes(PLACEHOLDER),
      { message: `Còn giá trị giữ chỗ ${PLACEHOLDER} trong clinic.ts` },
    );
    const result = strict.safeParse({ ...clinic, phone: PLACEHOLDER });
    expect(result.success).toBe(false);
  });
});

describe('helper liên kết', () => {
  it('telHref bỏ khoảng trắng và dấu chấm', () => {
    expect(telHref('0236 3 888 999')).toBe('tel:02363888999');
    expect(telHref('0905.123.456')).toBe('tel:0905123456');
  });

  it('zaloHref dựng đúng URL từ số điện thoại', () => {
    expect(zaloHref('0905 123 456')).toBe('https://zalo.me/0905123456');
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận thất bại**

```bash
npm test -- src/data/clinic.test.ts
```

Kỳ vọng: FAIL — `Failed to resolve import "./clinic"`.

- [ ] **Step 3: Viết implementation**

`src/data/clinic.ts`:

```ts
import { z } from 'astro/zod';

/**
 * Sentinel cho dữ liệu chưa có. Build production sẽ fail nếu còn sót —
 * xem hàm assertNoPlaceholders() ở cuối file.
 */
export const PLACEHOLDER = 'CHUA_CO';

const daySchema = z.union([
  z.object({ open: z.string(), close: z.string() }),
  z.literal('closed'),
]);

export const clinicSchema = z.object({
  name: z.string().min(1),
  legalName: z.string().min(1),
  licenceNumber: z.string().min(1),
  phone: z.string().min(1),
  zalo: z.string().min(1),
  email: z.string(),
  address: z.object({
    street: z.string().min(1),
    ward: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
  }),
  geo: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  hours: z.object({
    monday: daySchema,
    tuesday: daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema,
    saturday: daySchema,
    sunday: daySchema,
  }),
  sameAs: z.object({
    facebook: z.string(),
    googleBusiness: z.string(),
  }),
});

export type Clinic = z.infer<typeof clinicSchema>;

/**
 * NGUỒN SỰ THẬT DUY NHẤT cho dữ liệu phòng khám.
 * Header, footer, trang liên hệ, JSON-LD đều đọc từ đây — không ai được viết cứng lại.
 *
 * ⚠️ Mọi giá trị PLACEHOLDER phải thay bằng dữ liệu thật trước khi launch (spec §18-B).
 * Riêng giờ làm việc: site cũ hiện HAI phiên bản mâu thuẫn, cần phòng khám xác nhận bản đúng.
 */
export const clinic = {
  name: 'Nha Khoa Vcare',
  legalName: PLACEHOLDER,
  licenceNumber: PLACEHOLDER,
  phone: PLACEHOLDER,
  zalo: PLACEHOLDER,
  email: PLACEHOLDER,
  address: {
    street: PLACEHOLDER,
    ward: PLACEHOLDER,
    city: 'Đà Nẵng',
    country: 'VN',
  },
  geo: { lat: 16.047079, lng: 108.20623 },
  hours: {
    monday: { open: PLACEHOLDER, close: PLACEHOLDER },
    tuesday: { open: PLACEHOLDER, close: PLACEHOLDER },
    wednesday: { open: PLACEHOLDER, close: PLACEHOLDER },
    thursday: { open: PLACEHOLDER, close: PLACEHOLDER },
    friday: { open: PLACEHOLDER, close: PLACEHOLDER },
    saturday: { open: PLACEHOLDER, close: PLACEHOLDER },
    sunday: 'closed',
  },
  sameAs: {
    facebook: PLACEHOLDER,
    googleBusiness: PLACEHOLDER,
  },
} as const satisfies Clinic;

/** Bỏ mọi ký tự không phải số để dùng trong tel: và zalo.me */
function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function telHref(phone: string): string {
  return `tel:${digitsOnly(phone)}`;
}

export function zaloHref(phone: string): string {
  return `https://zalo.me/${digitsOnly(phone)}`;
}

/**
 * Gọi lúc build. Chặn deploy khi còn dữ liệu giả.
 * Chỉ chạy khi build production để dev vẫn làm việc được với dữ liệu chưa có.
 */
export function assertNoPlaceholders(): void {
  if (JSON.stringify(clinic).includes(PLACEHOLDER)) {
    throw new Error(
      `clinic.ts còn giá trị giữ chỗ "${PLACEHOLDER}". ` +
        'Điền dữ liệu thật trước khi build production — xem spec §18-B.',
    );
  }
}
```

- [ ] **Step 4: Chạy test để xác nhận pass**

```bash
npm test -- src/data/clinic.test.ts
```

Kỳ vọng: PASS, 6 test.

- [ ] **Step 5: Commit**

```bash
git add src/data/clinic.ts src/data/clinic.test.ts
git commit -m "feat(data): nguồn dữ liệu phòng khám duy nhất, chặn build khi còn giá trị giả"
```

---

## Task 7: Content Collections + Zod schema

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/services/vi/cay-ghep-implant.md`
- Create: `src/content/services/en/dental-implant.md`

- [ ] **Step 1: Viết schema**

`src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { SERVICE_KEYS } from './i18n/routes';
import { LOCALES } from './i18n/locales';

const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
  schema: z.object({
    /** Nối bản dịch giữa các ngôn ngữ. Phải khớp một key trong SERVICE_SLUGS. */
    key: z.enum(SERVICE_KEYS as [string, ...string[]]),
    lang: z.enum(LOCALES as unknown as [string, ...string[]]),
    title: z.string().min(1),
    /** 120–160 ký tự: ngắn hơn thì phí chỗ, dài hơn thì Google cắt cụt giữa câu. */
    description: z.string().min(120).max(160),
    priceFrom: z.number().int().positive(),
    order: z.number().int(),
    faq: z
      .array(z.object({ question: z.string().min(1), answer: z.string().min(1) }))
      .default([]),
  }),
});

export const collections = { services };
```

- [ ] **Step 2: Tạo nội dung mẫu tiếng Việt**

`src/content/services/vi/cay-ghep-implant.md`:

```markdown
---
key: implant
lang: vi
title: Cấy ghép Implant
description: Cấy ghép Implant tại Đà Nẵng — trụ titanium thay chân răng đã mất, ăn nhai như răng thật. Bài viết giải thích quy trình, chi phí và thời gian điều trị.
priceFrom: 15000000
order: 1
faq:
  - question: Trồng răng Implant mất bao lâu?
    answer: Nội dung thật sẽ được viết ở Plan 2.
---

Nội dung thật sẽ được viết ở Plan 2. File này tồn tại để kiểm chứng schema hoạt động.
```

- [ ] **Step 3: Tạo nội dung mẫu tiếng Anh**

`src/content/services/en/dental-implant.md`:

```markdown
---
key: implant
lang: en
title: Dental Implants
description: Dental implants in Da Nang — a titanium post replaces the missing tooth root so you can chew normally again. Covers the procedure, cost and treatment time.
priceFrom: 15000000
order: 1
faq:
  - question: How long does a dental implant take?
    answer: Real content will be written in Plan 2.
---

Real content will be written in Plan 2. This file exists to prove the schema works.
```

- [ ] **Step 4: Xác nhận schema chấp nhận nội dung hợp lệ**

```bash
npx astro sync && npx astro build
```

Kỳ vọng: build thành công, không lỗi schema.

- [ ] **Step 5: Xác nhận schema TỪ CHỐI nội dung sai**

Sửa tạm `src/content/services/vi/cay-ghep-implant.md`, rút gọn `description` thành `description: Quá ngắn.` rồi chạy:

```bash
npx astro build
```

Kỳ vọng: FAIL với thông báo kiểu `**description**: String must contain at least 120 character(s)`.

**Hoàn tác** về description cũ, rồi chạy lại `npx astro build` để xác nhận đã xanh.

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/content/
git commit -m "feat(content): Zod schema cho collection services + nội dung mẫu hai ngôn ngữ"
```

---

## Task 8: Design token sáng/tối

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Viết token theo vai trò**

Thay toàn bộ `src/styles/global.css`:

```css
@import "tailwindcss";

/*
  Màu khai theo VAI TRÒ, không theo tên màu. Đổi theme là đổi một tầng biến.
  Giá trị dưới đây là tạm — hệ màu thật do /impeccable shape quyết định ở Plan 2.
*/
:root {
  --surface: #ffffff;
  --surface-raised: #f6f7f9;
  --text-primary: #14181d;
  --text-secondary: #4b5563;
  --border: #e2e5ea;
  --accent: #0f766e;
  --accent-contrast: #ffffff;

  /*
    Nền cho ảnh lâm sàng. GIỮ NGUYÊN Ở CẢ HAI CHẾ ĐỘ — spec §8.
    Mắt người đánh giá độ trắng của răng theo nền xung quanh; nền tối làm
    kết quả trước/sau trông phóng đại. Đây là ràng buộc đạo đức, không phải thẩm mỹ.
  */
  --clinical-surface: #f4f5f7;
  --clinical-text: #14181d;
}

:root.dark {
  --surface: #101418;
  --surface-raised: #181d23;
  --text-primary: #f2f4f7;
  --text-secondary: #a8b0ba;
  --border: #2a313a;
  --accent: #2dd4bf;
  --accent-contrast: #06201d;

  /* Cố tình KHÔNG đổi. Xem ghi chú trên. */
  --clinical-surface: #f4f5f7;
  --clinical-text: #14181d;
}

@theme inline {
  --color-surface: var(--surface);
  --color-surface-raised: var(--surface-raised);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --color-accent-contrast: var(--accent-contrast);
  --color-clinical-surface: var(--clinical-surface);
  --color-clinical-text: var(--clinical-text);
}

body {
  background-color: var(--surface);
  color: var(--text-primary);
}

/* Vùng ảnh lâm sàng: dùng class này cho mọi gallery trước/sau và ảnh cận cảnh răng. */
.clinical-frame {
  background-color: var(--clinical-surface);
  color: var(--clinical-text);
}

/* Tôn trọng toàn cục — bắt buộc, không phải tuỳ chọn. Spec §9. */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Xác nhận CSS build được**

```bash
npx astro build
```

Kỳ vọng: build thành công.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(style): design token theo vai trò, hai chế độ màu, nền ảnh lâm sàng cố định"
```

---

## Task 9: Script theme chống lóe sáng

**Files:**
- Create: `src/lib/theme.ts`
- Test: `src/lib/theme.test.ts`
- Create: `src/components/ThemeScript.astro`

Tách logic ra `.ts` để test được; component `.astro` chỉ nhúng nó dưới dạng script chặn.

- [ ] **Step 1: Viết test thất bại**

`src/lib/theme.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { resolveTheme, THEME_STORAGE_KEY, isThemePreference } from './theme';

describe('resolveTheme', () => {
  it('lựa chọn rõ ràng thắng cài đặt hệ thống', () => {
    expect(resolveTheme('dark', true)).toBe('dark');
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('chế độ system đi theo cài đặt hệ điều hành', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });

  it('giá trị hỏng trong localStorage lùi về system', () => {
    expect(resolveTheme('rac', true)).toBe('dark');
    expect(resolveTheme(null, false)).toBe('light');
  });
});

describe('isThemePreference', () => {
  it('nhận đúng ba giá trị hợp lệ', () => {
    expect(isThemePreference('system')).toBe(true);
    expect(isThemePreference('light')).toBe(true);
    expect(isThemePreference('dark')).toBe(true);
  });

  it('từ chối giá trị khác', () => {
    expect(isThemePreference('auto')).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });
});

describe('THEME_STORAGE_KEY', () => {
  it('khoá lưu trữ ổn định — đổi là mất lựa chọn của mọi khách cũ', () => {
    expect(THEME_STORAGE_KEY).toBe('vcare-theme');
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận thất bại**

```bash
npm test -- src/lib/theme.test.ts
```

Kỳ vọng: FAIL — `Failed to resolve import "./theme"`.

- [ ] **Step 3: Viết implementation**

`src/lib/theme.ts`:

```ts
export const THEME_STORAGE_KEY = 'vcare-theme';

export const THEME_PREFERENCES = ['system', 'light', 'dark'] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export type ResolvedTheme = 'light' | 'dark';

export function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && (THEME_PREFERENCES as readonly string[]).includes(value);
}

/** Giá trị lưu trữ + cài đặt hệ điều hành → theme thật sự áp dụng. */
export function resolveTheme(stored: unknown, systemPrefersDark: boolean): ResolvedTheme {
  if (stored === 'dark' || stored === 'light') return stored;
  return systemPrefersDark ? 'dark' : 'light';
}
```

- [ ] **Step 4: Chạy test để xác nhận pass**

```bash
npm test -- src/lib/theme.test.ts
```

Kỳ vọng: PASS, 6 test.

- [ ] **Step 5: Tạo component script chặn**

`src/components/ThemeScript.astro`:

```astro
---
import { THEME_STORAGE_KEY } from '../lib/theme';
---

{/*
  Chạy CHẶN trong <head>, trước khi trình duyệt vẽ. Không có nó, trang lóe trắng
  một nhịp rồi mới chuyển sang tối — lỗi này nhìn rất rẻ tiền.
  Đây là ngoại lệ JavaScript duy nhất trên đường tải chính (spec §8).
  is:inline bắt buộc: Astro không được bundle/hoãn đoạn này.
*/}
<script is:inline define:vars={{ storageKey: THEME_STORAGE_KEY }}>
  try {
    const stored = localStorage.getItem(storageKey);
    const dark =
      stored === 'dark' ||
      (stored !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch {
    /* localStorage bị chặn (chế độ riêng tư) — để mặc định sáng, không làm hỏng trang */
  }
</script>
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/theme.ts src/lib/theme.test.ts src/components/ThemeScript.astro
git commit -m "feat(theme): logic theme có test + script chặn chống lóe sáng"
```

---

## Task 10: Layout nền

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Viết layout**

`src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/global.css';
import ThemeScript from '../components/ThemeScript.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { alternateLinks } from '../i18n/routes';
import { useTranslations } from '../i18n/ui';
import type { Locale } from '../i18n/locales';

interface Props {
  locale: Locale;
  title: string;
  description: string;
}

const { locale, title, description } = Astro.props;
const t = useTranslations(locale);
const alternates = alternateLinks(Astro.url.pathname);
const canonical = new URL(Astro.url.pathname, Astro.site).href;
---

<!doctype html>
<html lang={locale}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />

    {/* hreflang trỏ đúng trang tương ứng, không phải trang chủ — nhờ routes.ts */}
    {
      alternates.map(({ locale: alt, path }) => (
        <link rel="alternate" hreflang={alt} href={new URL(path, Astro.site).href} />
      ))
    }
    <link
      rel="alternate"
      hreflang="x-default"
      href={new URL(alternates[0].path, Astro.site).href}
    />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:type" content="website" />

    <ThemeScript />
  </head>
  <body>
    <a href="#main" class="sr-only focus:not-sr-only">{t('nav.skipToContent')}</a>
    <Header locale={locale} />
    <main id="main">
      <slot />
    </main>
    <Footer locale={locale} />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(layout): layout nền với HTML ngữ nghĩa, hreflang và skip link"
```

Ghi chú: build sẽ chưa chạy được cho tới khi có `Header` và `Footer` ở Task 11.

---

## Task 11: Header và Footer

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/LanguageSwitcher.astro`
- Create: `src/components/Footer.astro`
- Test: `src/components/Footer.test.ts`

- [ ] **Step 1: Viết test thất bại cho Footer**

Test này chứng minh footer đọc từ `clinic.ts` chứ không viết cứng — chính là lỗi giờ làm việc mâu thuẫn của site cũ.

`src/components/Footer.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Footer from './Footer.astro';
import { clinic } from '../data/clinic';

describe('Footer', () => {
  it('hiện số điện thoại lấy từ clinic.ts, không viết cứng', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer, { props: { locale: 'vi' } });
    expect(html).toContain(clinic.phone);
  });

  it('hiện tên phòng khám lấy từ clinic.ts', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer, { props: { locale: 'vi' } });
    expect(html).toContain(clinic.name);
  });

  it('render được ở tiếng Anh', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer, { props: { locale: 'en' } });
    expect(html).toContain('Opening hours');
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận thất bại**

```bash
npm test -- src/components/Footer.test.ts
```

Kỳ vọng: FAIL — không tìm thấy `./Footer.astro`.

- [ ] **Step 3: Viết LanguageSwitcher**

`src/components/LanguageSwitcher.astro`:

```astro
---
import { alternateLinks } from '../i18n/routes';
import { useTranslations } from '../i18n/ui';
import { UI } from '../i18n/ui';
import type { Locale } from '../i18n/locales';

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = useTranslations(locale);

// Trỏ sang ĐÚNG trang tương ứng ở ngôn ngữ kia, không đá về trang chủ.
const other = alternateLinks(Astro.url.pathname).find((a) => a.locale !== locale)!;
---

<a href={other.path} hreflang={other.locale} rel="alternate" aria-label={t('lang.switchTo')}>
  {UI[other.locale]['lang.current']}
</a>
```

- [ ] **Step 4: Viết Header**

`src/components/Header.astro`:

```astro
---
import { clinic, telHref } from '../data/clinic';
import { pathFor } from '../i18n/routes';
import { useTranslations } from '../i18n/ui';
import LanguageSwitcher from './LanguageSwitcher.astro';
import type { Locale } from '../i18n/locales';

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = useTranslations(locale);

const nav = [
  { key: 'about', label: t('nav.about') },
  { key: 'pricing', label: t('nav.pricing') },
  { key: 'blog', label: t('nav.blog') },
  { key: 'contact', label: t('nav.contact') },
] as const;
---

<header class="border-b border-border">
  <nav aria-label={t('nav.home')} class="flex items-center gap-4 p-4">
    <a href={pathFor('home', locale)} class="font-semibold">{clinic.name}</a>

    <ul class="flex gap-4">
      {
        nav.map(({ key, label }) => (
          <li>
            <a href={pathFor(key, locale)}>{label}</a>
          </li>
        ))
      }
    </ul>

    <div class="ms-auto flex items-center gap-3">
      <LanguageSwitcher locale={locale} />
      <a href={telHref(clinic.phone)} class="rounded bg-accent px-3 py-2 text-accent-contrast">
        {t('cta.call')}
      </a>
    </div>
  </nav>
</header>
```

- [ ] **Step 5: Viết Footer**

`src/components/Footer.astro`:

```astro
---
import { clinic, telHref, zaloHref } from '../data/clinic';
import { useTranslations } from '../i18n/ui';
import type { Locale } from '../i18n/locales';

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = useTranslations(locale);

const DAY_LABELS: Record<Locale, Record<keyof typeof clinic.hours, string>> = {
  vi: {
    monday: 'Thứ Hai',
    tuesday: 'Thứ Ba',
    wednesday: 'Thứ Tư',
    thursday: 'Thứ Năm',
    friday: 'Thứ Sáu',
    saturday: 'Thứ Bảy',
    sunday: 'Chủ Nhật',
  },
  en: {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  },
};

const days = Object.entries(clinic.hours) as Array<
  [keyof typeof clinic.hours, (typeof clinic.hours)[keyof typeof clinic.hours]]
>;
---

<footer class="border-t border-border p-4">
  {/* Mọi giá trị đọc từ clinic.ts — spec §6. Không viết cứng lại ở đây. */}
  <section aria-labelledby="footer-contact">
    <h2 id="footer-contact">{t('footer.contact')}</h2>
    <p class="font-semibold">{clinic.name}</p>
    <address class="not-italic">
      {clinic.address.street}, {clinic.address.ward}, {clinic.address.city}
    </address>
    <p><a href={telHref(clinic.phone)}>{clinic.phone}</a></p>
    <p><a href={zaloHref(clinic.zalo)}>{t('cta.zalo')}</a></p>
  </section>

  <section aria-labelledby="footer-hours">
    <h2 id="footer-hours">{t('footer.hours')}</h2>
    <dl>
      {
        days.map(([day, value]) => (
          <div>
            <dt>{DAY_LABELS[locale][day]}</dt>
            <dd>{value === 'closed' ? t('footer.closed') : `${value.open} – ${value.close}`}</dd>
          </div>
        ))
      }
    </dl>
  </section>

  <p><small>© {new Date().getFullYear()} {clinic.name}</small></p>
</footer>
```

- [ ] **Step 6: Chạy test để xác nhận pass**

```bash
npm test -- src/components/Footer.test.ts
```

Kỳ vọng: PASS, 3 test.

- [ ] **Step 7: Commit**

```bash
git add src/components/
git commit -m "feat(ui): header, footer và nút chuyển ngôn ngữ đọc từ clinic.ts"
```

---

## Task 12: Trang chủ hai ngôn ngữ

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/pages/en/index.astro`

- [ ] **Step 1: Trang chủ tiếng Việt**

Thay toàn bộ `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { clinic } from '../data/clinic';
---

<BaseLayout
  locale="vi"
  title={`${clinic.name} — Nha khoa tại Đà Nẵng`}
  description="Phòng khám nha khoa tại Đà Nẵng. Cấy ghép Implant, bọc răng sứ, niềng răng và điều trị nha khoa tổng quát. Nội dung đầy đủ sẽ có ở Plan 2."
>
  <h1>{clinic.name}</h1>
  <p>Nền tảng đã dựng xong. Nội dung thật sẽ được viết ở Plan 2.</p>
</BaseLayout>
```

- [ ] **Step 2: Trang chủ tiếng Anh**

`src/pages/en/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { clinic } from '../../data/clinic';
---

<BaseLayout
  locale="en"
  title={`${clinic.name} — Dental Clinic in Da Nang`}
  description="A dental clinic in Da Nang, Vietnam. Dental implants, crowns, orthodontics and general dentistry. Full content arrives in Plan 2."
>
  <h1>{clinic.name}</h1>
  <p>The foundation is in place. Real content will be written in Plan 2.</p>
</BaseLayout>
```

- [ ] **Step 3: Kiểm bằng mắt trên dev server**

```bash
npm run dev
```

Mở `http://localhost:4321/` và `http://localhost:4321/en/`. Kiểm:
- Bấm nút chuyển ngôn ngữ ở trang chủ vi → tới `/en/`, và ngược lại
- Đổi cài đặt sáng/tối của hệ điều hành rồi tải lại → **không lóe trắng**
- Footer hiện đủ 7 ngày

Dừng server bằng `Ctrl+C`.

- [ ] **Step 4: Xác nhận build đầy đủ**

```bash
npm run verify
```

Kỳ vọng: `astro check` 0 lỗi → toàn bộ test PASS → build thành công.

- [ ] **Step 5: Commit**

```bash
git add src/pages/
git commit -m "feat(pages): trang chủ hai ngôn ngữ dùng layout nền"
```

---

## Task 13: Wrangler và deploy

**Files:**
- Create: `wrangler.toml`
- Modify: `package.json`

- [ ] **Step 1: Cài Wrangler**

```bash
npm i -D wrangler
```

- [ ] **Step 2: Tạo `wrangler.toml`**

```toml
name = "nhakhoavcare"
compatibility_date = "2026-08-03"
pages_build_output_dir = "dist"
```

- [ ] **Step 3: Thêm script deploy vào `package.json`**

```json
"deploy": "npm run verify && wrangler pages deploy dist",
"deploy:preview": "npm run verify && wrangler pages deploy dist --branch preview"
```

`deploy` chạy `verify` trước — không deploy được nếu test đỏ hoặc type sai.

- [ ] **Step 4: Đăng nhập Cloudflare**

```bash
npx wrangler login
```

Mở trình duyệt để cấp quyền. **Cần tài khoản Cloudflare của phòng khám** (spec §18-A).

- [ ] **Step 5: Deploy bản preview**

```bash
npm run deploy:preview
```

Kỳ vọng: in ra một URL dạng `https://<hash>.nhakhoavcare.pages.dev`. Mở URL đó, kiểm cả `/` và `/en/` đều chạy.

- [ ] **Step 6: Commit**

```bash
git add wrangler.toml package.json package-lock.json
git commit -m "chore(deploy): cấu hình Wrangler cho Cloudflare Pages"
```

---

## Task 14: Chặn build production khi còn dữ liệu giả

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json`

- [ ] **Step 1: Thêm integration gọi `assertNoPlaceholders` lúc build**

Sửa `astro.config.mjs`, thêm import và integration:

```js
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

export default defineConfig({
  site: 'https://www.nhakhoavcare.com',
  integrations: [guardClinicData()],
  i18n: {
    locales: ['vi', 'en'],
    defaultLocale: 'vi',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 2: Xác nhận build BỊ CHẶN khi còn dữ liệu giả**

```bash
npx astro build
```

Kỳ vọng: FAIL với `clinic.ts còn giá trị giữ chỗ "CHUA_CO"`.

Đây là hành vi đúng — chứng minh không thể lỡ tay deploy site với số điện thoại giả.

- [ ] **Step 3: Xác nhận cờ tạm cho phép build khi đang phát triển**

```bash
ALLOW_PLACEHOLDER_CLINIC=1 npx astro build
```

Kỳ vọng: in cảnh báo rồi build thành công.

- [ ] **Step 4: Cập nhật script để dev vẫn chạy được**

Trong `package.json`, sửa `verify` thành:

```json
"verify": "astro check && vitest run && ALLOW_PLACEHOLDER_CLINIC=1 astro build"
```

Giữ nguyên `deploy` **không** có cờ — deploy production vẫn bị chặn cho tới khi có dữ liệu thật.

⚠️ Khi đã điền dữ liệu thật vào `clinic.ts`, **xoá cờ khỏi `verify`**.

- [ ] **Step 5: Chạy verify**

```bash
npm run verify
```

Kỳ vọng: xanh toàn bộ.

- [ ] **Step 6: Commit**

```bash
git add astro.config.mjs package.json
git commit -m "feat(build): chặn build production khi clinic.ts còn giá trị giữ chỗ"
```

---

## Task 15: README bàn giao

**Files:**
- Create: `README.md`

- [ ] **Step 1: Viết README**

```markdown
# Nha Khoa Vcare — website

Astro 5 · Tailwind 4 · TypeScript · Cloudflare Pages

## Lệnh

| Lệnh | Việc |
|---|---|
| `npm run dev` | Chạy dev server tại `localhost:4321` |
| `npm test` | Chạy unit test |
| `npm run verify` | Kiểm type + test + build (chạy trước mọi commit lớn) |
| `npm run deploy:preview` | Deploy bản xem trước |
| `npm run deploy` | Deploy production |

## Sửa nội dung

| Muốn đổi | Sửa file |
|---|---|
| SĐT, địa chỉ, giờ làm việc | `src/data/clinic.ts` — **nguồn duy nhất**, đổi ở đây là đổi cả site |
| Chữ trên giao diện (menu, nút) | `src/i18n/ui.ts` |
| Đường dẫn URL | `src/i18n/routes.ts` — **nguồn duy nhất**, đừng viết URL tay ở nơi khác |
| Nội dung trang dịch vụ | `src/content/services/{vi,en}/*.md` |
| Màu sắc | `src/styles/global.css` |

## Trước khi launch

`npm run deploy` sẽ **fail** nếu `src/data/clinic.ts` còn giá trị `CHUA_CO`.
Đây là chủ ý — xem spec §18-B để biết cần điền những gì.

Khi đã có dữ liệu thật, xoá `ALLOW_PLACEHOLDER_CLINIC=1` khỏi script `verify`.

## Tài liệu

- Thiết kế: `docs/superpowers/specs/2026-08-03-nhakhoavcare-rebuild-design.md`
- Kế hoạch: `docs/superpowers/plans/`
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README hướng dẫn lệnh và nơi sửa nội dung"
```

---

## Định nghĩa hoàn thành Plan 1

- [ ] `npm run verify` xanh toàn bộ
- [ ] `npm run deploy:preview` cho URL chạy được cả `/` và `/en/`
- [ ] Bấm nút chuyển ngôn ngữ ở bất kỳ trang nào → tới **đúng trang tương ứng**, không về trang chủ
- [ ] Đổi cài đặt sáng/tối hệ điều hành rồi tải lại → **không lóe trắng**
- [ ] `npx astro build` (không có cờ) **fail** vì `clinic.ts` còn dữ liệu giả — đúng như thiết kế
- [ ] Sửa `description` của một file markdown thành quá ngắn → build fail với lỗi Zod rõ ràng

---

## Lệch khỏi plan khi thi công (ghi ngày 2026-08-03)

### Plan sai, đã sửa khi chạy

1. **Astro thật là v7.1.6, không phải v5.** Nhãn phiên bản trong plan sai. API thì đúng — tài liệu tra cứu là bản live nên phản ánh v7: `src/content.config.ts`, `glob()` loader, `getViteConfig`, `astro add tailwind` đều hoạt động y như viết.

2. **Thiếu `@astrojs/check` + `typescript`.** `astro check` hỏi cài tương tác rồi treo. Đã `npm i -D @astrojs/check typescript`.

3. **Thiếu `/// <reference types="vitest/config" />` trong `vitest.config.ts`.** Không có nó thì `astro check` báo `'test' does not exist in type 'UserConfig'`.

4. **Thiếu `@types/node`.** `process.env` trong `astro.config.mjs` không có kiểu.

5. **Lỗi thật trong plan — chốt chặn dữ liệu giả bị vô hiệu.** Task 13 viết `"deploy": "npm run verify && wrangler pages deploy dist"`, mà Task 14 lại thêm cờ `ALLOW_PLACEHOLDER_CLINIC=1` vào `verify`. Kết quả: deploy production build với cờ bỏ qua rồi đẩy thẳng lên — đúng chỗ cần chặn nhất thì không chặn. Đã sửa `deploy` thành chuỗi lệnh riêng, build **không cờ**:
   ```
   "deploy": "astro check && vitest run && astro build && wrangler pages deploy dist"
   ```
   Đã xác minh: `astro build` không cờ trả exit code 1.

6. **Scaffolder ghi đè `.gitignore`,** xoá mất phần chặn secrets (`.dev.vars`, `*-service-account*.json`, `.wrangler/`). Đã khôi phục và gộp với bản của Astro.

### Chưa làm được

7. **Task 13 bước 4–5: `wrangler login` + deploy preview.** Cần đăng nhập trình duyệt tương tác và **tài khoản Cloudflare của phòng khám** (spec §18-A). Cấu hình `wrangler.toml` và script đã sẵn sàng; chỉ thiếu bước đăng nhập.

### Giá trị tôi tự đặt, chưa ai xác nhận

Những thứ dưới đây không có trong spec và không lấy từ site cũ — tôi tự chọn để có cái chạy được. **Cần rà lại ở Plan 2:**

8. **Danh sách 8 dịch vụ và slug của chúng** trong `src/i18n/routes.ts` — suy từ 16 trang liệt kê trong file tổng kết phiên trước, chưa đối chiếu site thật. GĐ 0 (crawl) sẽ xác nhận đúng/thiếu/thừa.

9. **Slug trang tĩnh** (`gioi-thieu`, `bang-gia`, `lien-he`, `kien-thuc-nha-khoa` và bản tiếng Anh) — tôi tự đặt.

10. **Toạ độ `geo` trong `clinic.ts`** = `16.047079, 108.20623`, đây là **trung tâm thành phố Đà Nẵng**, không phải vị trí phòng khám. Phải thay bằng toạ độ thật.

11. **Trường `licenceNumber`** (số giấy phép hoạt động) — tôi tự thêm vào schema vì thấy nhiều site y tế Việt Nam hiển thị ở footer. Nếu không muốn hiện thì bỏ khỏi schema.

12. **Bảng màu tạm trong `global.css`** — màu teal `#0f766e` là giá trị giữ chỗ để có cái nhìn được. Hệ màu thật do `/impeccable shape` quyết định ở Plan 2.

13. **`priceFrom: 15000000`** trong file markdown mẫu — số bịa. Nội dung mẫu chỉ tồn tại để chứng minh schema chạy.

---

## Sang Plan 2 cần gì

- Dữ liệu thật cho `clinic.ts` (spec §18-B) — **đặc biệt là bản giờ làm việc nào đúng**
- Kết quả GĐ 0: nội dung cũ đã crawl, danh sách URL hỏng, có/không có thông tin bác sĩ
- `npx impeccable install` để bắt đầu hệ ngôn ngữ thiết kế
