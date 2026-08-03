import { describe, it, expect } from 'vitest';
import { LOCALES, DEFAULT_LOCALE, isLocale } from './locales';

describe('locales', () => {
  it('hỗ trợ đúng hai ngôn ngữ', () => {
    expect(LOCALES).toEqual(['vi', 'en']);
  });

  it('mặc định là tiếng Việt', () => {
    expect(DEFAULT_LOCALE).toBe('vi');
  });

  it('nhận diện locale hợp lệ', () => {
    expect(isLocale('vi')).toBe(true);
    expect(isLocale('en')).toBe(true);
  });

  it('từ chối chuỗi không phải locale', () => {
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('')).toBe(false);
    expect(isLocale('VI')).toBe(false);
  });
});
