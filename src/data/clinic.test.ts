import { describe, expect, it } from 'vitest';
import { assertNoPlaceholders, clinic, clinicSchema, telHref, zaloHref } from './clinic';

describe('clinic', () => {
  it('hợp lệ theo schema', () => {
    expect(() => clinicSchema.parse(clinic)).not.toThrow();
  });

  it('có đủ 7 ngày trong tuần', () => {
    expect(Object.keys(clinic.hours)).toHaveLength(7);
  });
});

describe('chốt chặn dữ liệu dựng tạm', () => {
  it('chặn build production khi isDemoData còn bật', () => {
    expect(clinic.isDemoData).toBe(true);
    expect(() => assertNoPlaceholders()).toThrow(/DỰNG TẠM/);
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
