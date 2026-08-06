import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { clinic } from '../data/clinic';
import { KIDS } from '../data/copy/kids';
import { STERILE } from '../data/copy/sterile';
import { TECH } from '../data/copy/technology';
import { pathFor, postPath, type ServiceKey } from '../i18n/routes';
import { getPosts } from '../lib/posts';

/**
 * llms.txt: bản tóm tắt site dạng markdown cho mô hình ngôn ngữ đọc.
 *
 * Nói thẳng về giá trị: OpenAI, Anthropic và Google CHƯA xác nhận dùng file này
 * làm tín hiệu. Nó rẻ nên vẫn làm, nhưng không phải át chủ bài. Thứ thật sự có
 * tác dụng là JSON-LD, robots.txt mở cổng cho crawler, và nội dung trả lời
 * thẳng câu hỏi. Xem spec §12.
 *
 * File này là MỤC LỤC, không phải nội dung. Toàn văn nằm ở llms-full.txt. Mô
 * hình đọc mục lục trước để biết có gì rồi mới quyết định tải bản đầy đủ.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site!.origin;
  const services = (await getCollection('services', (e) => e.data.lang === 'vi')).sort(
    (a, b) => a.data.order - b.data.order,
  );
  const posts = await getPosts('vi');

  const lines = [
    `# ${clinic.name}`,
    '',
    `> Phòng khám nha khoa tại ${clinic.address.city}, chuyên sâu cấy ghép Implant. Nội dung song ngữ Việt và Anh.`,
    '',
    `Địa chỉ: ${clinic.address.street}, ${clinic.address.ward}, ${clinic.address.city}.`,
    `Điện thoại và Zalo: ${clinic.phone}. Mở cửa 8:00–20:00 tất cả các ngày; ngoài giờ vẫn nhận tư vấn qua điện thoại và Zalo.`,
    '',
    '## Dịch vụ',
    '',
    ...services.map(
      (s) =>
        `- [${s.data.title}](${base}${pathFor(`service:${s.data.key as ServiceKey}`, 'vi')}): ${s.data.description}`,
    ),
    '',
    '## Quy trình và thiết bị',
    '',
    `- [${STERILE.vi.openingTitle}](${base}${pathFor('sterile', 'vi')}): ${STERILE.vi.lede}`,
    `- [Thiết bị và chẩn đoán hình ảnh](${base}${pathFor('technology', 'vi')}): ${TECH.vi.lede}`,
    `- [Nha khoa trẻ em](${base}${pathFor('kids', 'vi')}): ${KIDS.vi.lede}`,
    '',
    '## Kiến thức nha khoa',
    '',
    ...posts.map(
      (p) => `- [${p.data.title}](${base}${postPath(p.data.slug, 'vi')}): ${p.data.description}`,
    ),
    '',
    '## Trang khác',
    '',
    `- [Bảng giá](${base}${pathFor('pricing', 'vi')}): chi phí từng dịch vụ và cam kết không phát sinh.`,
    `- [Giới thiệu](${base}${pathFor('about', 'vi')}): đội ngũ bác sĩ, bằng cấp, chứng chỉ và cơ sở vật chất.`,
    `- [Liên hệ](${base}${pathFor('contact', 'vi')}): địa chỉ, giờ làm việc, số điện thoại và Zalo.`,
    `- [Kiến thức nha khoa](${base}${pathFor('blog', 'vi')}): danh sách toàn bộ bài viết.`,
    '',
    '## Tiếng Anh',
    '',
    `Toàn bộ nội dung có bản tiếng Anh dưới tiền tố \`/en/\`. Ví dụ: ${base}${pathFor('service:implant', 'en')}`,
    '',
    '## Toàn văn',
    '',
    `- [llms-full.txt](${base}/llms-full.txt): toàn văn trang dịch vụ, trang quy trình và bài viết, cả hai ngôn ngữ.`,
    `- [search-index.json](${base}/search-index.json): chỉ mục tìm kiếm tiếng Việt, dạng JSON.`,
    `- [/en/search-index.json](${base}/en/search-index.json): chỉ mục tiếng Anh.`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
