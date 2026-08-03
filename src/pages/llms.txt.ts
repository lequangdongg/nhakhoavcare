import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { clinic } from '../data/clinic';
import { pathFor, type ServiceKey } from '../i18n/routes';

/**
 * llms.txt: bản tóm tắt site dạng markdown cho mô hình ngôn ngữ đọc.
 *
 * Nói thẳng về giá trị: OpenAI, Anthropic và Google CHƯA xác nhận dùng file này
 * làm tín hiệu. Nó rẻ nên vẫn làm, nhưng không phải át chủ bài. Thứ thật sự có
 * tác dụng là JSON-LD, robots.txt mở cổng cho crawler, và nội dung trả lời
 * thẳng câu hỏi. Xem spec §12.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site!.origin;
  const services = (await getCollection('services', (e) => e.data.lang === 'vi')).sort(
    (a, b) => a.data.order - b.data.order,
  );

  const lines = [
    `# ${clinic.name}`,
    '',
    `> Phòng khám nha khoa tại ${clinic.address.city}, chuyên sâu cấy ghép Implant. Nội dung song ngữ Việt và Anh.`,
    '',
    '## Dịch vụ',
    '',
    ...services.map(
      (s) =>
        `- [${s.data.title}](${base}${pathFor(`service:${s.data.key as ServiceKey}`, 'vi')}): ${s.data.description}`,
    ),
    '',
    '## Trang khác',
    '',
    `- [Bảng giá](${base}${pathFor('pricing', 'vi')}): chi phí từng dịch vụ và cam kết không phát sinh.`,
    `- [Giới thiệu](${base}${pathFor('about', 'vi')}): đội ngũ bác sĩ, bằng cấp, chứng chỉ và cơ sở vật chất.`,
    `- [Liên hệ](${base}${pathFor('contact', 'vi')}): địa chỉ, giờ làm việc, số điện thoại và Zalo.`,
    `- [Kiến thức nha khoa](${base}${pathFor('blog', 'vi')}): bài viết giải thích vấn đề răng miệng thường gặp.`,
    '',
    '## Tiếng Anh',
    '',
    `Toàn bộ nội dung có bản tiếng Anh dưới tiền tố \`/en/\`. Ví dụ: ${base}${pathFor('service:implant', 'en')}`,
    '',
    '## Toàn văn',
    '',
    `- [llms-full.txt](${base}/llms-full.txt): toàn bộ nội dung trang dịch vụ dưới dạng markdown.`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
