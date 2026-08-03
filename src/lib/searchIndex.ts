import { getCollection } from 'astro:content';
import { pathFor, type ServiceKey } from '../i18n/routes';
import { useTranslations } from '../i18n/ui';
import type { Locale } from '../i18n/locales';

export interface IndexEntry {
  title: string;
  description: string;
  /** Cách gọi khác, chỉ dùng để so khớp, không hiển thị. */
  keywords: string;
  href: string;
  group: string;
}

/**
 * Chỉ mục sinh lúc build, một file cho mỗi ngôn ngữ.
 *
 * Vì sao không dùng Pagefind như spec ban đầu: site có 35 trang và phần tìm được
 * là tiêu đề cùng mô tả, nên chỉ mục JSON chỉ vài KB. Riêng bộ chạy WASM của
 * Pagefind đã nặng hơn toàn bộ chỉ mục này. Tự sinh cũng cho toàn quyền kiểm soát
 * việc bỏ dấu, vốn là rủi ro số một của tính năng. Khi blog phình lên vài trăm
 * bài thì đổi sang Pagefind là hợp lý.
 */
export async function buildIndex(locale: Locale): Promise<IndexEntry[]> {
  const t = useTranslations(locale);

  const services = (await getCollection('services', (e) => e.data.lang === locale))
    .sort((a, b) => a.data.order - b.data.order)
    .map((s) => ({
      title: s.data.title,
      description: s.data.description,
      keywords: s.data.keywords.join(' '),
      href: pathFor(`service:${s.data.key as ServiceKey}`, locale),
      group: t('nav.services'),
    }));

  const pages: IndexEntry[] = (['about', 'pricing', 'blog', 'contact'] as const).map((key) => ({
    title: t(`nav.${key}` as Parameters<typeof t>[0]),
    description: '',
    keywords: '',
    href: pathFor(key, locale),
    group: t('search.pages'),
  }));

  return [...services, ...pages];
}
