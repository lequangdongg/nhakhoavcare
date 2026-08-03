import { describe, expect, it } from 'vitest';
import { alternateLinks, keyFromPath, pathFor, SERVICE_KEYS } from './routes';

describe('pathFor', () => {
  it('trang chủ tiếng Việt ở gốc, không tiền tố', () => {
    expect(pathFor('home', 'vi')).toBe('/');
  });

  it('trang chủ tiếng Anh có tiền tố /en/', () => {
    expect(pathFor('home', 'en')).toBe('/en/');
  });

  it('dịch cả segment lẫn slug cho trang dịch vụ', () => {
    expect(pathFor('service:implant', 'vi')).toBe('/dich-vu/cay-ghep-implant/');
    expect(pathFor('service:implant', 'en')).toBe('/en/services/dental-implant/');
  });

  it('dịch trang tĩnh', () => {
    expect(pathFor('pricing', 'vi')).toBe('/bang-gia/');
    expect(pathFor('pricing', 'en')).toBe('/en/pricing/');
  });

  it('ném lỗi với key không tồn tại', () => {
    // @ts-expect-error key không hợp lệ, kiểm hành vi lúc chạy
    expect(() => pathFor('khong-ton-tai', 'vi')).toThrow(/khong-ton-tai/);
  });
});

describe('keyFromPath', () => {
  it('nhận ra trang chủ ở cả hai ngôn ngữ', () => {
    expect(keyFromPath('/')).toEqual({ key: 'home', locale: 'vi' });
    expect(keyFromPath('/en/')).toEqual({ key: 'home', locale: 'en' });
  });

  it('nhận ra trang dịch vụ ở cả hai ngôn ngữ', () => {
    expect(keyFromPath('/dich-vu/cay-ghep-implant/')).toEqual({
      key: 'service:implant',
      locale: 'vi',
    });
    expect(keyFromPath('/en/services/dental-implant/')).toEqual({
      key: 'service:implant',
      locale: 'en',
    });
  });

  it('bỏ qua dấu gạch chéo cuối', () => {
    expect(keyFromPath('/bang-gia')).toEqual({ key: 'pricing', locale: 'vi' });
    expect(keyFromPath('/bang-gia/')).toEqual({ key: 'pricing', locale: 'vi' });
  });

  it('trả null với đường dẫn không nhận ra', () => {
    expect(keyFromPath('/khong-co-trang-nay/')).toBeNull();
  });
});

describe('alternateLinks — đây là thứ chặn lỗi nút đổi ngôn ngữ đá về trang chủ', () => {
  it('trang dịch vụ tiếng Việt trỏ sang đúng trang dịch vụ tiếng Anh', () => {
    expect(alternateLinks('/dich-vu/cay-ghep-implant/')).toEqual([
      { locale: 'vi', path: '/dich-vu/cay-ghep-implant/' },
      { locale: 'en', path: '/en/services/dental-implant/' },
    ]);
  });

  it('hoạt động theo chiều ngược lại', () => {
    expect(alternateLinks('/en/services/dental-implant/')).toEqual([
      { locale: 'vi', path: '/dich-vu/cay-ghep-implant/' },
      { locale: 'en', path: '/en/services/dental-implant/' },
    ]);
  });

  it('đường dẫn lạ thì lùi về trang chủ từng ngôn ngữ', () => {
    expect(alternateLinks('/khong-co-trang-nay/')).toEqual([
      { locale: 'vi', path: '/' },
      { locale: 'en', path: '/en/' },
    ]);
  });
});

describe('mọi key đều có đường dẫn ở cả hai ngôn ngữ', () => {
  it('không dịch vụ nào thiếu slug', () => {
    for (const key of SERVICE_KEYS) {
      expect(pathFor(`service:${key}`, 'vi')).toMatch(/^\/dich-vu\//);
      expect(pathFor(`service:${key}`, 'en')).toMatch(/^\/en\/services\//);
    }
  });

  it('đường dẫn sinh ra luôn quay ngược lại đúng key', () => {
    for (const key of SERVICE_KEYS) {
      const routeKey = `service:${key}` as const;
      expect(keyFromPath(pathFor(routeKey, 'vi'))).toEqual({ key: routeKey, locale: 'vi' });
      expect(keyFromPath(pathFor(routeKey, 'en'))).toEqual({ key: routeKey, locale: 'en' });
    }
  });
});
