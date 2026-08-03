import { describe, it, expect } from 'vitest';
import { fold, matches, score } from './search';

describe('fold: bỏ dấu tiếng Việt', () => {
  it('bỏ dấu thanh và dấu mũ', () => {
    expect(fold('Cấy ghép Implant')).toBe('cay ghep implant');
    expect(fold('Bọc răng sứ')).toBe('boc rang su');
    expect(fold('Niềng răng chỉnh nha')).toBe('nieng rang chinh nha');
  });

  it('xử lý đúng chữ đ hoa và thường', () => {
    expect(fold('Đà Nẵng')).toBe('da nang');
    expect(fold('điều trị')).toBe('dieu tri');
  });

  it('giữ nguyên chữ không dấu', () => {
    expect(fold('Implant')).toBe('implant');
    expect(fold('Veneer')).toBe('veneer');
  });

  it('gộp khoảng trắng thừa', () => {
    expect(fold('  Lấy   cao  răng ')).toBe('lay cao rang');
  });
});

describe('matches: đây là lý do tính năng tìm kiếm sống hay chết', () => {
  const doc = { title: 'Cấy ghép Implant', description: 'Trụ titanium thay chân răng đã mất.' };

  it('gõ KHÔNG DẤU vẫn ra kết quả có dấu', () => {
    expect(matches(doc, 'cay ghep')).toBe(true);
    expect(matches(doc, 'cay ghep implant')).toBe(true);
    expect(matches(doc, 'trong rang')).toBe(false);
  });

  it('gõ CÓ DẤU vẫn ra', () => {
    expect(matches(doc, 'cấy ghép')).toBe(true);
  });

  it('không phân biệt hoa thường', () => {
    expect(matches(doc, 'IMPLANT')).toBe(true);
  });

  it('tìm được trong phần mô tả, không chỉ tiêu đề', () => {
    expect(matches(doc, 'titanium')).toBe(true);
    expect(matches(doc, 'chan rang')).toBe(true);
  });

  it('mọi từ trong truy vấn đều phải khớp, không phải chỉ một từ', () => {
    expect(matches(doc, 'implant titanium')).toBe(true);
    expect(matches(doc, 'implant xyz')).toBe(false);
  });

  it('truy vấn rỗng không khớp gì', () => {
    expect(matches(doc, '')).toBe(false);
    expect(matches(doc, '   ')).toBe(false);
  });
});

describe('score: khớp tiêu đề phải xếp trên khớp mô tả', () => {
  const titleHit = { title: 'Lấy cao răng', description: 'Làm sạch mảng bám vôi hóa.' };
  const descHit = { title: 'Chữa tủy răng', description: 'Sau khi lấy cao răng vẫn cần khám.' };

  it('khớp tiêu đề được điểm cao hơn', () => {
    expect(score(titleHit, 'lay cao rang')).toBeGreaterThan(score(descHit, 'lay cao rang'));
  });

  it('khớp từ đầu tiêu đề được điểm cao nhất', () => {
    const a = { title: 'Implant', description: '' };
    const b = { title: 'Cấy ghép Implant', description: '' };
    expect(score(a, 'implant')).toBeGreaterThan(score(b, 'implant'));
  });
});
