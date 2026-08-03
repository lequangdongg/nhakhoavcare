import { z } from 'astro/zod';

/**
 * NGUỒN SỰ THẬT DUY NHẤT cho dữ liệu phòng khám.
 * Header, footer, trang liên hệ, JSON-LD đều đọc từ đây, không ai được viết cứng lại.
 *
 * ⚠️ TOÀN BỘ GIÁ TRỊ DƯỚI ĐÂY LÀ DỮ LIỆU DỰNG TẠM, KHÔNG PHẢI THÔNG TIN THẬT.
 *
 * Chúng tồn tại để đánh giá được thiết kế khi phòng khám chưa cung cấp dữ liệu.
 * Cờ `isDemoData` bên dưới chặn build production cho tới khi thay hết bằng số
 * liệu thật rồi đặt về `false`. Một phòng khám để lộ số điện thoại giả lên
 * production sẽ mất khách thật mà không ai biết, nên chốt chặn này không được gỡ.
 */
const daySchema = z.union([z.object({ open: z.string(), close: z.string() }), z.literal('closed')]);

export const clinicSchema = z.object({
  isDemoData: z.boolean(),
  name: z.string().min(1),
  legalName: z.string().min(1),
  licenceNumber: z.string().min(1),
  tagline: z.string().min(1),
  foundedYear: z.number().int(),
  phone: z.string().min(1),
  zalo: z.string().min(1),
  email: z.string(),
  address: z.object({
    street: z.string().min(1),
    ward: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
  }),
  geo: z.object({ lat: z.number(), lng: z.number() }),
  mapsUrl: z.string().min(1),
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

export const clinic: Clinic = {
  /** Đặt về false SAU KHI đã thay hết số liệu thật. Xem spec §18-B. */
  isDemoData: true,

  name: 'Nha Khoa Vcare',
  legalName: 'Công ty TNHH Nha Khoa Vcare',
  licenceNumber: '0048/ĐNA-GPHĐ',
  tagline: 'Chuyên sâu cấy ghép Implant',
  foundedYear: 2014,

  phone: '0236 3 897 686',
  zalo: '0905 417 268',
  email: 'lienhe@nhakhoavcare.com',

  // Địa chỉ và toạ độ THẬT, lấy từ trang Google Maps của phòng khám.
  address: {
    street: '190 Kinh Dương Vương',
    ward: 'Quận Liên Chiểu',
    city: 'Đà Nẵng',
    country: 'VN',
  },

  geo: { lat: 16.0748384, lng: 108.1693839 },

  hours: {
    monday: { open: '07:30', close: '20:00' },
    tuesday: { open: '07:30', close: '20:00' },
    wednesday: { open: '07:30', close: '20:00' },
    thursday: { open: '07:30', close: '20:00' },
    friday: { open: '07:30', close: '20:00' },
    saturday: { open: '07:30', close: '17:30' },
    sunday: { open: '08:00', close: '12:00' },
  },

  /** Link chỉ đường. Dùng URL trang phòng khám để mở đúng hồ sơ có tên, ảnh và
      đánh giá, thay vì một điểm ghim vô danh theo toạ độ. */
  mapsUrl:
    'https://www.google.com/maps/place/Nha+Khoa+Vcare/@16.0748435,108.1671952,17z/data=!3m1!4b1!4m5!3m4!1s0x3142192f0778c899:0xcd85626021f5f21e!8m2!3d16.0748384!4d108.1693839',

  sameAs: {
    facebook: 'https://www.facebook.com/nhakhoavcaredanang',
    googleBusiness: 'https://maps.google.com/?cid=14808150936133423134',
  },
};

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

/** Số năm hoạt động, tính lúc build. */
export function yearsInOperation(): number {
  return new Date().getFullYear() - clinic.foundedYear;
}

/**
 * Gọi lúc build production. Chặn deploy khi dữ liệu vẫn là bản dựng tạm.
 * Build preview và dev bỏ qua bằng cờ ALLOW_PLACEHOLDER_CLINIC=1.
 */
export function assertNoPlaceholders(): void {
  if (clinic.isDemoData) {
    throw new Error(
      'clinic.ts đang dùng DỮ LIỆU DỰNG TẠM (isDemoData: true). ' +
        'Thay bằng số liệu thật của phòng khám rồi đặt isDemoData: false. Xem spec §18-B.',
    );
  }
}
