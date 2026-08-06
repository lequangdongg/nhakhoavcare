import { type CollectionEntry, getCollection } from 'astro:content';
import { LOCALES, type Locale } from '../i18n/locales';

/**
 * Nạp bài viết của một ngôn ngữ, và chặn build khi dữ liệu sai.
 *
 * Ba lỗi dưới đây không lộ ra lúc chạy — trang vẫn dựng xong, chỉ là bộ chọn
 * ngôn ngữ dẫn tới 404, một bài lặng lẽ đè lên bài khác, hoặc khối "duyệt bởi"
 * trỏ vào một bác sĩ không tồn tại. Ném lỗi ở đây là lúc duy nhất bắt được.
 *
 * Mọi nơi cần danh sách bài đều gọi qua hàm này, không gọi thẳng
 * getCollection('posts') — gọi thẳng là đi vòng qua hết ba lớp kiểm tra.
 */
export async function getPosts(locale: Locale): Promise<CollectionEntry<'posts'>[]> {
  const all = await getCollection('posts');

  const langsByKey = new Map<string, Set<string>>();
  for (const p of all) {
    const set = langsByKey.get(p.data.key) ?? new Set<string>();
    set.add(p.data.lang);
    langsByKey.set(p.data.key, set);
  }
  for (const [key, langs] of langsByKey) {
    const missing = LOCALES.filter((l) => !langs.has(l));
    if (missing.length) {
      throw new Error(`Bài viết "${key}" thiếu bản dịch: ${missing.join(', ')}`);
    }
  }

  const doctorKeys = new Set((await getCollection('doctors')).map((d) => d.data.key));
  for (const p of all) {
    if (!doctorKeys.has(p.data.reviewedBy)) {
      throw new Error(
        `Bài viết "${p.data.key}" khai reviewedBy: "${p.data.reviewedBy}" ` +
          'nhưng không có bác sĩ nào mang key đó.',
      );
    }
  }

  const mine = all.filter((p) => p.data.lang === locale);
  const slugs = mine.map((p) => p.data.slug);
  const dup = slugs.find((s, i) => slugs.indexOf(s) !== i);
  if (dup) throw new Error(`Trùng slug "${dup}" giữa các bài tiếng ${locale}`);

  return mine.sort((a, b) => +b.data.publishedAt - +a.data.publishedAt);
}
