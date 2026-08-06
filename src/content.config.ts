import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { doctorSchema } from './content/doctors-schema';
import { LOCALES } from './i18n/locales';
import { SERVICE_KEYS } from './i18n/routes';

const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
  schema: z.object({
    /** Nối bản dịch giữa các ngôn ngữ. Phải khớp một key trong SERVICE_SLUGS. */
    key: z.enum(SERVICE_KEYS as [string, ...string[]]),
    lang: z.enum(LOCALES as unknown as [string, ...string[]]),
    title: z.string().min(1),
    /** 120–160 ký tự: ngắn hơn thì phí chỗ, dài hơn thì Google cắt cụt giữa câu. */
    description: z.string().min(120).max(160),
    /**
     * Giá khởi điểm, đồng. Để trống cho tới khi phòng khám xác nhận bảng giá thật.
     * Trang hiển thị "Liên hệ để biết giá" khi thiếu, không bịa số.
     */
    priceFrom: z.number().int().positive().optional(),
    order: z.number().int(),
    /**
     * Từ khoá phụ cho tìm kiếm. Dùng cho những cách gọi khác mà tiêu đề không
     * chứa: "trồng răng" cho Implant, "trẻ em" cho Vecni Flour, "răng giả" cho
     * hàm tháo lắp. Không hiển thị ra trang, chỉ vào chỉ mục tìm kiếm.
     */
    keywords: z.array(z.string().min(1)).default([]),
    faq: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).default([]),
  }),
});

/**
 * Hồ sơ bác sĩ. Chứng chỉ và thành tựu là thứ Google soi kỹ nhất với nội dung
 * y tế (E-E-A-T) và cũng là thứ bệnh nhân tin nhất — nên schema ép phải đầy đủ,
 * không cho ghi qua loa. Xem src/content/doctors-schema.ts.
 */
const doctors = defineCollection({
  loader: glob({ base: './src/content/doctors', pattern: '**/*.md' }),
  schema: doctorSchema,
});

/**
 * Bài viết cho mục Kiến thức nha khoa.
 *
 * Cùng mô hình `key` + `lang` như services để hai bản dịch ghép cặp được. Ràng
 * buộc "mỗi bài phải có đủ hai ngôn ngữ" không diễn đạt được bằng schema — nó
 * là ràng buộc giữa các entry, không phải trong một entry — nên nó nằm ở
 * src/lib/posts.ts và ném lỗi lúc build.
 */
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    key: z.string().min(1),
    lang: z.enum(LOCALES as unknown as [string, ...string[]]),
    title: z.string().min(1),
    /** 120–160 ký tự, cùng lý do như services: ngắn thì phí chỗ, dài thì bị cắt. */
    description: z.string().min(120).max(160),
    /** Slug dịch theo ngôn ngữ, không suy ra từ tên file để URL tiếng Việt đọc được. */
    slug: z.string().min(1),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    /**
     * Bác sĩ chịu trách nhiệm chuyên môn, khớp `key` trong collection doctors.
     * Bắt buộc: nội dung y tế không có người đứng tên thì không nên đăng.
     */
    reviewedBy: z.string().min(1),
    keywords: z.array(z.string().min(1)).default([]),
  }),
});

export const collections = { services, doctors, posts };
