import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { LAYOUTS, SKIN_SWATCH, SKINS } from './appearance';

/**
 * Ô màu xem trước trong bộ chọn giao diện được ghi tay trong appearance.ts, còn
 * màu thật nằm trong appearance.css. Hai chỗ này rất dễ trôi khỏi nhau: sửa màu
 * theme mà quên sửa ô xem trước thì bộ chọn nói dối, và không có gì báo lỗi.
 *
 * Test đọc thẳng file CSS để bắt đúng tình huống đó.
 */
const SRC = fileURLToPath(new URL('..', import.meta.url));

const css = readFileSync(
  fileURLToPath(new URL('../styles/appearance.css', import.meta.url)),
  'utf8',
);

/** Đọc giá trị một biến trong khối bộ chọn cho trước. */
function tokenIn(selector: string, name: string): string | undefined {
  const start = css.indexOf(selector);
  if (start === -1) return undefined;
  const block = css.slice(start, css.indexOf('}', start));
  return block.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();
}

describe('ô màu xem trước khớp với appearance.css', () => {
  // clinical là theme mặc định, màu của nó nằm ở :root trong global.css
  for (const skin of SKINS.filter((s) => s !== 'clinical')) {
    it(`${skin}: accent, secondary và surface đúng như CSS`, () => {
      const sel = `:root[data-theme='${skin}']`;
      expect(tokenIn(sel, 'accent')).toBe(SKIN_SWATCH[skin].accent);
      expect(tokenIn(sel, 'secondary')).toBe(SKIN_SWATCH[skin].secondary);
      expect(tokenIn(sel, 'surface')).toBe(SKIN_SWATCH[skin].surface);
    });

    it(`${skin}: có khai riêng cho nền tối`, () => {
      // Thiếu khối này thì bật chế độ tối sẽ rơi về màu của clinical,
      // ra một tổ hợp không ai thiết kế.
      expect(css).toContain(`:root[data-theme='${skin}'].dark`);
    });
  }

  it('mọi bố cục khác mặc định đều có luật riêng trong mã nguồn', () => {
    // Luật bố cục viết bằng utility Tailwind rải trên các component, không nằm
    // trong appearance.css. Test quét cả cây nguồn để bắt đúng tình huống thêm
    // tên bố cục vào LAYOUTS mà quên viết luật cho nó: bố cục đó sẽ hiện trong
    // bộ chọn, bấm vào không đổi gì, và không có gì báo lỗi.
    const src = readdirSync(SRC, { recursive: true, encoding: 'utf8' })
      .filter((f) => /\.(astro|css|ts)$/.test(f) && !f.endsWith('.test.ts'))
      .map((f) => readFileSync(join(SRC, f), 'utf8'))
      .join('');

    for (const layout of LAYOUTS.filter((l) => l !== 'split')) {
      // Hai dạng biến thể đều hợp lệ:
      //   [[data-layout=x]_&]  luật bám vào tổ tiên, dùng cho hầu hết bố cục
      //   data-[layout=x]      luật bám vào chính thẻ mang thuộc tính, tức là
      //                        <html>, dùng cho bigtype và compact vì chúng đổi
      //                        cỡ chữ gốc
      const found =
        src.includes(`[data-layout=${layout}]`) || src.includes(`data-[layout=${layout}]`);
      expect(found, `bố cục ${layout} chưa có luật nào`).toBe(true);
    }
  });
});
