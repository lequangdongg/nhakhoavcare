import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Footer from './Footer.astro';
import { clinic } from '../data/clinic';

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
