import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { clinic } from '../data/clinic';
import { KIDS } from '../data/copy/kids';
import { STERILE } from '../data/copy/sterile';
import { TECH } from '../data/copy/technology';
import { LOCALES, type Locale } from '../i18n/locales';
import { pathFor, postPath, type ServiceKey } from '../i18n/routes';
import { getPosts } from '../lib/posts';

/**
 * llms-full.txt: toàn văn nội dung site, cả hai ngôn ngữ.
 *
 * Body markdown lấy nguyên từ `entry.body`, không qua HTML, nên mô hình đọc
 * được cấu trúc heading và đoạn đúng như tác giả viết.
 *
 * Ba trang tin cậy không phải markdown mà là module TypeScript song ngữ, nên ở
 * đây phải dựng lại dạng markdown từ chính module đó. Đọc từ nguồn thay vì chép
 * tay: sửa nội dung trang thì file này tự đúng theo, không trôi mất.
 */

/** Dựng markdown cho một trang tin cậy từ module copy của nó. */
function trustPages(locale: Locale, base: string): string[] {
  const s = STERILE[locale];
  const tech = TECH[locale];
  const k = KIDS[locale];

  return [
    `## ${s.openingTitle}`,
    '',
    `URL: ${base}${pathFor('sterile', locale)}`,
    '',
    ...s.opening,
    '',
    `### ${s.routesTitle}`,
    '',
    ...s.routes.map((r) => `- ${r}`),
    '',
    `### ${s.instrumentsTitle}`,
    '',
    s.instrumentsLede,
    '',
    ...s.steps.flatMap((step, i) => [`${i + 1}. **${step.name}** — ${step.body}`]),
    '',
    s.stepWarning,
    '',
    `### ${s.boxTitle}`,
    '',
    ...s.box,
    '',
    s.uv,
    '',
    `### ${s.surfacesTitle}`,
    '',
    ...s.surfaces,
    '',
    `### ${s.closingTitle}`,
    '',
    ...s.closing,
    '',
    `### ${s.surgeryTitle}`,
    '',
    ...s.surgery,
    '',

    `## ${tech.imagingTitle}`,
    '',
    `URL: ${base}${pathFor('technology', locale)}`,
    '',
    ...tech.imaging,
    '',
    `### ${tech.modesTitle}`,
    '',
    tech.modesLede,
    '',
    ...tech.modes.map((m) => `- **${m.name}**: ${m.question}`),
    '',
    tech.onSite,
    '',
    `### ${tech.radiationTitle}`,
    '',
    tech.radiationLede,
    '',
    ...tech.radiation.map((r) => `- ${r}`),
    '',
    tech.radiationAsk,
    '',
    `### ${tech.impactedTitle}`,
    '',
    ...tech.impacted,
    '',
    `### ${tech.scanTitle}`,
    '',
    tech.scanLede,
    '',
    ...tech.benefits.map((b) => `- **${b.name}**: ${b.body}`),
    '',
    `### ${tech.recordsTitle}`,
    '',
    ...tech.records,
    '',

    `## ${k.keepTitle}`,
    '',
    `URL: ${base}${pathFor('kids', locale)}`,
    '',
    ...k.keep,
    '',
    `### ${k.whenTitle}`,
    '',
    ...k.when.map((w) => `- **${w.name}**: ${w.body}`),
    '',
    `### ${k.mythTitle}`,
    '',
    ...k.myth,
    '',
    `### ${k.filmTitle}`,
    '',
    ...k.film,
    '',
    `### ${k.habitsTitle}`,
    '',
    ...k.habits,
    '',
    `### ${k.earlyTitle}`,
    '',
    ...k.early,
    '',
    `### ${k.windowTitle}`,
    '',
    ...k.window,
    '',
  ];
}

export const GET: APIRoute = async ({ site }) => {
  const base = site!.origin;
  const out: string[] = [
    `# ${clinic.name}`,
    '',
    `Phòng khám nha khoa tại ${clinic.address.city}, chuyên sâu cấy ghép Implant.`,
    `Địa chỉ: ${clinic.address.street}, ${clinic.address.ward}, ${clinic.address.city}. Điện thoại và Zalo: ${clinic.phone}.`,
    '',
    'Nội dung dưới đây là toàn văn các trang dịch vụ, trang quy trình và bài viết,',
    'giữ nguyên cấu trúc markdown gốc.',
    '',
  ];

  for (const locale of LOCALES) {
    const services = (await getCollection('services', (e) => e.data.lang === locale)).sort(
      (a, b) => a.data.order - b.data.order,
    );
    const posts = await getPosts(locale);

    out.push('', '---', '', `# ${locale === 'vi' ? 'Tiếng Việt' : 'English'}`, '');

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

    out.push(...trustPages(locale, base));

    for (const p of posts) {
      out.push(
        `## ${p.data.title}`,
        '',
        `URL: ${base}${postPath(p.data.slug, locale)}`,
        `Đăng ngày: ${p.data.publishedAt.toISOString().slice(0, 10)}`,
        '',
        p.data.description,
        '',
        (p.body ?? '').trim(),
        '',
      );
    }
  }

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
