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
