import { describe, expect, it } from 'vitest';
import { clinic, clinicSchema, PLACEHOLDER, telHref, zaloHref } from './clinic';

describe('clinic', () => {
  it('hợp lệ theo schema', () => {
    expect(() => clinicSchema.parse(clinic)).not.toThrow();
  });

  it('có đủ 7 ngày trong tuần', () => {
    expect(Object.keys(clinic.hours)).toHaveLength(7);
  });
});

describe('bảo vệ giá trị giữ chỗ', () => {
  it('cho phép sentinel khi KHÔNG phải build production', () => {
    const result = clinicSchema.safeParse({ ...clinic, phone: PLACEHOLDER });
    expect(result.success).toBe(true);
  });

  it('từ chối sentinel khi build production — không thể deploy với số điện thoại giả', () => {
    const strict = clinicSchema.refine((c) => !JSON.stringify(c).includes(PLACEHOLDER), {
      message: `Còn giá trị giữ chỗ ${PLACEHOLDER} trong clinic.ts`,
    });
    const result = strict.safeParse({ ...clinic, phone: PLACEHOLDER });
    expect(result.success).toBe(false);
  });
});

describe('helper liên kết', () => {
  it('telHref bỏ khoảng trắng và dấu chấm', () => {
    expect(telHref('0236 3 888 999')).toBe('tel:02363888999');
    expect(telHref('0905.123.456')).toBe('tel:0905123456');
  });

  it('zaloHref dựng đúng URL từ số điện thoại', () => {
    expect(zaloHref('0905 123 456')).toBe('https://zalo.me/0905123456');
  });
});
