export const THEME_STORAGE_KEY = 'vcare-theme';

export const THEME_PREFERENCES = ['system', 'light', 'dark'] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export type ResolvedTheme = 'light' | 'dark';

export function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && (THEME_PREFERENCES as readonly string[]).includes(value);
}

/** Giá trị lưu trữ + cài đặt hệ điều hành → theme thật sự áp dụng. */
export function resolveTheme(stored: unknown, systemPrefersDark: boolean): ResolvedTheme {
  if (stored === 'dark' || stored === 'light') return stored;
  return systemPrefersDark ? 'dark' : 'light';
}
