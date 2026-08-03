/**
 * Tìm kiếm phía trình duyệt cho một site nhỏ.
 *
 * Ràng buộc quan trọng nhất: NGƯỜI VIỆT GÕ KHÔNG DẤU.
 * Khách sẽ gõ "cay ghep implant", "boc rang su", "nieng rang". Không ai gõ dấu
 * trên điện thoại. Nếu chỉ mục chỉ lưu chuỗi có dấu thì tìm kiếm trả rỗng và
 * tính năng này coi như vứt đi. Mọi so khớp vì vậy chạy trên chuỗi đã bỏ dấu.
 */

export interface SearchDoc {
  title: string;
  description: string;
}

/** Bỏ dấu, hạ chữ thường, gộp khoảng trắng. */
export function fold(input: string): string {
  return (
    input
      .normalize('NFD')
      // Bỏ toàn bộ dấu thanh và dấu phụ
      .replace(/[̀-ͯ]/g, '')
      // đ và Đ không tách được bằng NFD, phải xử lý riêng
      .replace(/[đĐ]/g, 'd')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function terms(query: string): string[] {
  return fold(query).split(' ').filter(Boolean);
}

/** Mọi từ trong truy vấn phải xuất hiện ở tiêu đề hoặc mô tả. */
export function matches(doc: SearchDoc, query: string): boolean {
  const t = terms(query);
  if (t.length === 0) return false;
  const haystack = `${fold(doc.title)} ${fold(doc.description)}`;
  return t.every((term) => haystack.includes(term));
}

/**
 * Điểm xếp hạng. Khớp tiêu đề nặng hơn khớp mô tả; khớp từ đầu tiêu đề nặng nhất.
 * Tiêu đề ngắn hơn được ưu tiên khi cùng mức khớp.
 */
export function score(doc: SearchDoc, query: string): number {
  const t = terms(query);
  if (t.length === 0) return 0;

  const title = fold(doc.title);
  const desc = fold(doc.description);
  let total = 0;

  for (const term of t) {
    if (title.startsWith(term)) total += 100;
    else if (title.includes(term)) total += 50;
    if (desc.includes(term)) total += 10;
  }

  // Tiêu đề ngắn khớp sát hơn tiêu đề dài chứa cùng từ
  return total - title.length * 0.1;
}
