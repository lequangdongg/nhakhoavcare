import { describe, expect, it } from 'vitest';
import { isThemePreference, resolveTheme, THEME_STORAGE_KEY } from './theme';

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
