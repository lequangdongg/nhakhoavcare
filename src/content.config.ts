import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { SERVICE_KEYS } from './i18n/routes';
import { LOCALES } from './i18n/locales';
import { doctorSchema } from './content/doctors-schema';

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
    faq: z
      .array(z.object({ question: z.string().min(1), answer: z.string().min(1) }))
      .default([]),
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

export const collections = { services, doctors };
