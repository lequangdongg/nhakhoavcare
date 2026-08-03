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
