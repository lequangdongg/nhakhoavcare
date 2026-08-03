import { z } from 'astro/zod';

/**
 * Sentinel cho dữ liệu chưa có. Build production sẽ fail nếu còn sót —
 * xem hàm assertNoPlaceholders() ở cuối file.
 */
export const PLACEHOLDER = 'CHUA_CO';

const daySchema = z.union([z.object({ open: z.string(), close: z.string() }), z.literal('closed')]);

export const clinicSchema = z.object({
  name: z.string().min(1),
  legalName: z.string().min(1),
  licenceNumber: z.string().min(1),
  phone: z.string().min(1),
  zalo: z.string().min(1),
  email: z.string(),
  address: z.object({
    street: z.string().min(1),
    ward: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
  }),
  geo: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  hours: z.object({
    monday: daySchema,
    tuesday: daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema,
    saturday: daySchema,
    sunday: daySchema,
  }),
  sameAs: z.object({
    facebook: z.string(),
    googleBusiness: z.string(),
  }),
});

export type Clinic = z.infer<typeof clinicSchema>;

/**
 * NGUỒN SỰ THẬT DUY NHẤT cho dữ liệu phòng khám.
 * Header, footer, trang liên hệ, JSON-LD đều đọc từ đây — không ai được viết cứng lại.
 *
 * ⚠️ Mọi giá trị PLACEHOLDER phải thay bằng dữ liệu thật trước khi launch (spec §18-B).
 * Riêng giờ làm việc: site cũ hiện HAI phiên bản mâu thuẫn, cần phòng khám xác nhận bản đúng.
 */
export const clinic = {
  name: 'Nha Khoa Vcare',
  legalName: PLACEHOLDER,
  licenceNumber: PLACEHOLDER,
  phone: PLACEHOLDER,
  zalo: PLACEHOLDER,
  email: PLACEHOLDER,
  address: {
    street: PLACEHOLDER,
    ward: PLACEHOLDER,
    city: 'Đà Nẵng',
    country: 'VN',
  },
  geo: { lat: 16.047079, lng: 108.20623 },
  hours: {
    monday: { open: PLACEHOLDER, close: PLACEHOLDER },
    tuesday: { open: PLACEHOLDER, close: PLACEHOLDER },
    wednesday: { open: PLACEHOLDER, close: PLACEHOLDER },
    thursday: { open: PLACEHOLDER, close: PLACEHOLDER },
    friday: { open: PLACEHOLDER, close: PLACEHOLDER },
    saturday: { open: PLACEHOLDER, close: PLACEHOLDER },
    sunday: 'closed',
  },
  sameAs: {
    facebook: PLACEHOLDER,
    googleBusiness: PLACEHOLDER,
  },
} as const satisfies Clinic;

/** Bỏ mọi ký tự không phải số để dùng trong tel: và zalo.me */
function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function telHref(phone: string): string {
  return `tel:${digitsOnly(phone)}`;
}

export function zaloHref(phone: string): string {
  return `https://zalo.me/${digitsOnly(phone)}`;
}

/**
 * Gọi lúc build. Chặn deploy khi còn dữ liệu giả.
 * Chỉ chạy khi build production để dev vẫn làm việc được với dữ liệu chưa có.
 */
export function assertNoPlaceholders(): void {
  if (JSON.stringify(clinic).includes(PLACEHOLDER)) {
    throw new Error(
      `clinic.ts còn giá trị giữ chỗ "${PLACEHOLDER}". ` +
        'Điền dữ liệu thật trước khi build production — xem spec §18-B.',
    );
  }
}
