import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import { clinic } from '../data/clinic';
import Footer from './Footer.astro';

describe('Footer', () => {
  it('hiện số điện thoại lấy từ clinic.ts, không viết cứng', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer, { props: { locale: 'vi' } });
    expect(html).toContain(clinic.phone);
  });

  it('hiện tên phòng khám lấy từ clinic.ts', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer, { props: { locale: 'vi' } });
    expect(html).toContain(clinic.name);
  });

  it('render được ở tiếng Anh', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer, { props: { locale: 'en' } });
    expect(html).toContain('Opening hours');
  });
});
