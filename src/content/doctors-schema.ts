import { z } from 'astro/zod';
import { SERVICE_KEYS } from '../i18n/routes';
import { LOCALES } from '../i18n/locales';

/**
 * Năm hiện tại tính lúc build. Dùng để chặn năm cấp chứng chỉ ở tương lai —
 * lỗi gõ nhầm kiểu "2099" trên hồ sơ y tế trông rất tệ.
 */
const CURRENT_YEAR = new Date().getFullYear();

const yearSchema = z
  .number()
  .int()
  .min(1950)
  .max(CURRENT_YEAR, { message: `Năm không được ở tương lai (tối đa ${CURRENT_YEAR})` });

/**
 * Chứng chỉ phải TRUY NGUYÊN ĐƯỢC: có tên, có nơi cấp, có năm.
 * Một dòng "Chứng chỉ Implant" trống trơn không chứng minh được gì và
 * làm giảm uy tín thay vì tăng — xem spec §8.1.
 */
const certificateSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1, { message: 'Chứng chỉ phải ghi rõ nơi cấp' }),
  year: yearSchema,
  /** Link tới bản scan hoặc trang xác minh, nếu có. */
  verifyUrl: z.string().url().optional(),
});

const educationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  year: yearSchema,
});

export const doctorSchema = z.object({
  /** Nối bản dịch giữa các ngôn ngữ. */
  key: z.string().min(1),
  lang: z.enum(LOCALES as unknown as [string, ...string[]]),

  name: z.string().min(1),
  /** Chức danh: "Bác sĩ Răng Hàm Mặt", "Thạc sĩ – Bác sĩ", ... */
  title: z.string().min(1),
  order: z.number().int(),

  yearsOfExperience: z.number().int().min(0).max(60),

  portrait: z.string().min(1),

  /** Đoạn giới thiệu ngắn, 100–300 ký tự. */
  summary: z.string().min(100).max(300),

  /** Bắt buộc ít nhất một mục — hồ sơ y tế không được để trống phần đào tạo. */
  education: z.array(educationSchema).min(1),

  /** Bắt buộc ít nhất một mục. */
  certificates: z.array(certificateSchema).min(1),

  /** Thành tựu: số ca đã thực hiện, giải thưởng, báo cáo hội nghị... */
  achievements: z.array(z.string().min(1)).default([]),

  /**
   * Chuyên môn, nối sang trang dịch vụ. Phải khớp key trong SERVICE_SLUGS
   * để không sinh liên kết chết.
   */
  specialties: z.array(z.enum(SERVICE_KEYS as [string, ...string[]])).default([]),

  /** Thành viên hiệp hội nghề nghiệp. */
  memberships: z.array(z.string().min(1)).default([]),

  languages: z.array(z.string().min(1)).default([]),
});

export type Doctor = z.infer<typeof doctorSchema>;
