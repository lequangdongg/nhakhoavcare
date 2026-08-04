/**
 * Ba trục giao diện, hoàn toàn độc lập nhau.
 *
 *   sáng / tối   →  class .dark trên <html>        (đã có từ trước)
 *   theme        →  data-theme trên <html>          màu, bo góc, độ đậm chữ
 *   layout       →  data-layout trên <html>         lưới, thứ tự, tỉ lệ khối
 *
 * Độc lập nghĩa là 3 theme × 3 layout × 2 nền = 18 tổ hợp, và mỗi trục thêm giá
 * trị mới không đụng tới hai trục kia.
 *
 * Vì sao đổi cấu trúc bằng CSS chứ không phải bằng ba bản markup:
 * đổi lúc chạy thì mọi biến thể phải nằm sẵn trong HTML. Nhân ba markup hero là
 * nhân ba thẻ <h1> trên cùng một trang, tức là hỏng đúng thứ site này được dựng
 * để làm tốt. Một DOM, một <h1>, CSS lo phần nhìn.
 */

export const THEME_STORAGE_KEY = 'vcare-theme';
export const SKIN_STORAGE_KEY = 'vcare-skin';
export const LAYOUT_STORAGE_KEY = 'vcare-layout';

/* ── Trục sáng / tối ──────────────────────────────────────────────────── */

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

/* ── Trục theme màu ───────────────────────────────────────────────────── */

export const SKINS = ['clinical', 'care', 'sharp'] as const;
export type Skin = (typeof SKINS)[number];
export const DEFAULT_SKIN: Skin = 'clinical';

export function isSkin(value: unknown): value is Skin {
  return typeof value === 'string' && (SKINS as readonly string[]).includes(value);
}

/* ── Trục bố cục ──────────────────────────────────────────────────────── */

export const LAYOUTS = ['split', 'stage', 'list'] as const;
export type Layout = (typeof LAYOUTS)[number];
export const DEFAULT_LAYOUT: Layout = 'split';

export function isLayout(value: unknown): value is Layout {
  return typeof value === 'string' && (LAYOUTS as readonly string[]).includes(value);
}

/* ── Mô tả cho bộ chọn ────────────────────────────────────────────────── */

/**
 * Màu xem trước lấy đúng giá trị thật trong appearance.css. Hai chỗ này phải
 * khớp nhau; test appearance.test.ts giữ cho chúng không trôi khỏi nhau.
 */
export const SKIN_SWATCH: Record<Skin, { accent: string; secondary: string; surface: string }> = {
  clinical: { accent: '#2563eb', secondary: '#14b8a6', surface: '#f8fafc' },
  care: { accent: '#0f766e', secondary: '#b45309', surface: '#faf8f4' },
  sharp: { accent: '#1e3a8a', secondary: '#475569', surface: '#f4f4f5' },
};

/**
 * Khoá dịch cho tên mỗi lựa chọn.
 * as const chứ không phải Record<Skin, string>: t() chỉ nhận khoá có thật trong
 * bảng dịch, kiểu string rộng quá nên sẽ bị từ chối.
 */
export const SKIN_LABEL = {
  clinical: 'skin.clinical',
  care: 'skin.care',
  sharp: 'skin.sharp',
} as const satisfies Record<Skin, string>;

export const LAYOUT_LABEL = {
  split: 'layout.split',
  stage: 'layout.stage',
  list: 'layout.list',
} as const satisfies Record<Layout, string>;
