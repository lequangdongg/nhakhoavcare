import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { clinic } from '../data/clinic';
import { LOCALES } from '../i18n/locales';
import { pathFor, type ServiceKey } from '../i18n/routes';

/**
 * llms-full.txt: toàn văn nội dung trang dịch vụ, cả hai ngôn ngữ.
 *
 * Body markdown lấy nguyên từ `entry.body`, không qua HTML, nên mô hình đọc
 * được cấu trúc heading và đoạn đúng như tác giả viết.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site!.origin;
  const out: string[] = [
    `# ${clinic.name}`,
    '',
    `Phòng khám nha khoa tại ${clinic.address.city}, chuyên sâu cấy ghép Implant.`,
    '',
    'Nội dung dưới đây là toàn văn các trang dịch vụ, giữ nguyên cấu trúc markdown gốc.',
    '',
  ];

  for (const locale of LOCALES) {
    const services = (await getCollection('services', (e) => e.data.lang === locale)).sort(
      (a, b) => a.data.order - b.data.order,
    );

    out.push('', `---`, '', `# ${locale === 'vi' ? 'Tiếng Việt' : 'English'}`, '');

    for (const s of services) {
      out.push(
        `## ${s.data.title}`,
        '',
        `URL: ${base}${pathFor(`service:${s.data.key as ServiceKey}`, locale)}`,
        '',
        s.data.description,
        '',
        (s.body ?? '').trim(),
        '',
      );

      for (const f of s.data.faq) {
        out.push(`### ${f.question}`, '', f.answer, '');
      }
    }
  }

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
