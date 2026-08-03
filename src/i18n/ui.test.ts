import { describe, it, expect } from 'vitest';
import { UI, useTranslations } from './ui';
import { LOCALES } from './locales';

describe('UI', () => {
  it('mọi ngôn ngữ có đúng cùng bộ key', () => {
    const viKeys = Object.keys(UI.vi).sort();
    const enKeys = Object.keys(UI.en).sort();
    expect(enKeys).toEqual(viKeys);
  });

  it('không chuỗi nào để rỗng', () => {
    for (const locale of LOCALES) {
      for (const [key, value] of Object.entries(UI[locale])) {
        expect(value, `${locale}.${key} đang rỗng`).not.toBe('');
      }
    }
  });
});

describe('useTranslations', () => {
  it('trả chuỗi đúng ngôn ngữ', () => {
    expect(useTranslations('vi')('nav.services')).toBe('Dịch vụ');
    expect(useTranslations('en')('nav.services')).toBe('Services');
  });

  it('ném lỗi khi key không tồn tại — thiếu bản dịch phải fail lúc build, không im lặng', () => {
    // @ts-expect-error key không hợp lệ, kiểm hành vi lúc chạy
    expect(() => useTranslations('vi')('nav.khong-ton-tai')).toThrow(/nav.khong-ton-tai/);
  });
});
