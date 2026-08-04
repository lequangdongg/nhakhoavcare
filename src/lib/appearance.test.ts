import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LAYOUT,
  DEFAULT_SKIN,
  isLayout,
  isSkin,
  isThemePreference,
  LAYOUTS,
  resolveTheme,
  SKINS,
  THEME_STORAGE_KEY,
} from './appearance';

describe('resolveTheme', () => {
  it('lựa chọn rõ ràng thắng cài đặt hệ thống', () => {
    expect(resolveTheme('dark', true)).toBe('dark');
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('chế độ system đi theo cài đặt hệ điều hành', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });

  it('giá trị hỏng trong localStorage lùi về system', () => {
    expect(resolveTheme('rac', true)).toBe('dark');
    expect(resolveTheme(null, false)).toBe('light');
  });
});

describe('isThemePreference', () => {
  it('nhận đúng ba giá trị hợp lệ', () => {
    expect(isThemePreference('system')).toBe(true);
    expect(isThemePreference('light')).toBe(true);
    expect(isThemePreference('dark')).toBe(true);
  });

  it('từ chối giá trị khác', () => {
    expect(isThemePreference('auto')).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });
});

describe('THEME_STORAGE_KEY', () => {
  it('khoá lưu trữ ổn định — đổi là mất lựa chọn của mọi khách cũ', () => {
    expect(THEME_STORAGE_KEY).toBe('vcare-theme');
  });
});

describe('lọc giá trị theme và bố cục', () => {
  // Giá trị trong localStorage là dữ liệu người dùng sửa được. Không lọc thì
  // bất kỳ ai cũng đặt được thuộc tính tuỳ ý lên thẻ <html>.
  it('chỉ nhận tên có thật', () => {
    expect(isSkin('care')).toBe(true);
    expect(isLayout('stage')).toBe(true);
    expect(isSkin('<script>')).toBe(false);
    expect(isLayout('__proto__')).toBe(false);
    expect(isSkin(null)).toBe(false);
    expect(isLayout(42)).toBe(false);
  });

  it('mặc định nằm trong danh sách hợp lệ', () => {
    expect(SKINS).toContain(DEFAULT_SKIN);
    expect(LAYOUTS).toContain(DEFAULT_LAYOUT);
  });
});
