import type { Locale } from './locales';

export const UI = {
  vi: {
    'nav.home': 'Trang chủ',
    'nav.primary': 'Điều hướng chính',
    'nav.about': 'Giới thiệu',
    'nav.services': 'Dịch vụ',
    'nav.pricing': 'Bảng giá',
    'nav.blog': 'Kiến thức nha khoa',
    'nav.contact': 'Liên hệ',
    'nav.skipToContent': 'Bỏ qua, tới nội dung chính',
    'nav.openMenu': 'Mở menu',
    'nav.closeMenu': 'Đóng menu',
    'cta.call': 'Gọi ngay',
    'cta.zalo': 'Nhắn Zalo',
    'cta.directions': 'Chỉ đường',
    'footer.hours': 'Giờ làm việc',
    'footer.contact': 'Liên hệ',
    'footer.address': 'Địa chỉ',
    'footer.closed': 'Nghỉ',
    'lang.switchTo': 'Chuyển sang tiếng Anh',
    'lang.current': 'Tiếng Việt',
    'theme.label': 'Giao diện',
    'theme.system': 'Theo hệ thống',
    'theme.light': 'Sáng',
    'theme.dark': 'Tối',
  },
  en: {
    'nav.home': 'Home',
    'nav.primary': 'Main navigation',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.pricing': 'Pricing',
    'nav.blog': 'Dental Knowledge',
    'nav.contact': 'Contact',
    'nav.skipToContent': 'Skip to main content',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'cta.call': 'Call now',
    'cta.zalo': 'Chat on Zalo',
    'cta.directions': 'Get directions',
    'footer.hours': 'Opening hours',
    'footer.contact': 'Contact',
    'footer.address': 'Address',
    'footer.closed': 'Closed',
    'lang.switchTo': 'Chuyển sang tiếng Việt',
    'lang.current': 'English',
    'theme.label': 'Theme',
    'theme.system': 'System',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UIKey = keyof (typeof UI)['vi'];

export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    const value = UI[locale][key];
    if (value === undefined) {
      throw new Error(`Thiếu bản dịch cho key "${key}" ở ngôn ngữ "${locale}"`);
    }
    return value;
  };
}
