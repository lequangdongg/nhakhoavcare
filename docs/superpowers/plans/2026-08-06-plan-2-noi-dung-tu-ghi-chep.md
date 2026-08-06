# Plan 2 — Đưa kịch bản nội dung lên site

**Nguồn nội dung:** `docs/superpowers/specs/2026-08-06-kich-ban-noi-dung-phong-kham.md`
**Brief chụp ảnh:** `docs/superpowers/specs/2026-08-06-brief-chup-anh.md`
**Nền tảng:** Plan 1 đã xong (Astro 7, i18n vi/en, 24 bố cục, 3 bảng màu, tìm kiếm, JSON-LD).

**Mục tiêu:** site có bộ khung tốt nhưng gần như rỗng nội dung — mục Kiến thức
nha khoa là vỏ 31 dòng, không có trang nào nói về quy trình hay thiết bị, 4/5 hồ
sơ bác sĩ chưa có. Plan này lấp đúng khoảng trống đó bằng nội dung từ 5 trang ghi
chép.

---

## Bốn quyết định đã chốt

| | |
|---|---|
| **Đối tượng** | Cả hai — vừa kéo người mới từ Google, vừa thuyết phục người đã vào site. Chia hai luồng chạy song song, xem §Thứ tự |
| **Tiếng Anh** | Tôi dịch cả hai bản; bác sĩ duyệt thuật ngữ **trước khi đăng**, không phải sau |
| **Ảnh** | Thuê thợ, chụp gọn một buổi. Phải có shot list trước buổi chụp |
| **Trang trẻ em** | Mô hình **trang mẹ + hai trang con**. Xem §Phân vai |
| **Unit test** | Không viết. Ràng buộc dữ liệu chuyển sang chốt chặn lúc build |

---

## Quyết định kiến trúc

### 1. Nội dung đi vào đâu

| Chương kịch bản | Đích | Vì sao |
|---|---|---|
| 1. Vô trùng | Trang riêng `.astro` | Nặng ảnh và sơ đồ 4 bước, không phải văn xuôi. Quy trình không đổi hàng tháng nên chủ phòng khám hiếm khi sửa |
| 2. Chẩn đoán hình ảnh | Trang riêng `.astro` (gộp với ch.4) | Như trên |
| 3. Nha khoa trẻ em | Trang mẹ `.astro` + 3 bài blog | Trang mẹ là cửa ngõ, bài blog ăn tìm kiếm dài |
| 4. Nha khoa số | Gộp vào trang Thiết bị | Cùng một luận điểm: "nhìn thấy trước khi làm" |
| 5. Implant / laser / cười hở lợi | Bổ sung vào 3 trang dịch vụ **đã có** | Không tạo trang mới, tránh trùng nội dung |
| 6. Con người, giờ giấc | Trang Giới thiệu + Liên hệ **đã có** | |

**Đánh đổi đã chọn:** ba trang tin cậy viết bằng `.astro` chứ không phải markdown,
dù ràng buộc ban đầu là "chủ phòng khám sửa markdown trong repo". Lý do: nội dung
này là ảnh + sơ đồ + bảng, ép vào markdown thì phải nhúng HTML — còn khó sửa hơn.
Bù lại, **toàn bộ bề mặt sửa thường xuyên (bài viết) là markdown thật.**

### 2. Phân vai ba trang về trẻ em

Site sẽ có ba trang cùng nói về trẻ em. Nếu không phân vai, Google tự chọn một
trang để xếp hạng và thường chọn không phải trang mình muốn.

```
/nha-khoa-tre-em/                    ← TRANG MẸ, truy vấn rộng
   │   Toàn cảnh: giữ răng sữa, mốc khám, thói quen xấu, khi nào cần can thiệp
   │   Không đi sâu vào bất kỳ kỹ thuật nào
   ├── /dich-vu/vecni-flour-tre-em/  ← đã có, truy vấn hẹp, giữ nguyên
   └── /dich-vu/nieng-rang-chinh-nha/ ← đã có, bổ sung nhánh chỉnh nha sớm
```

Luật để không giẫm chân nhau:

- **Trang mẹ không mô tả kỹ thuật.** Nói *khi nào* và *vì sao*, không nói *làm
  thế nào*. Chỗ nào chạm tới kỹ thuật thì dừng lại và dẫn link xuống.
- **Trang con không nhắc lại bối cảnh.** Không lặp lại đoạn "răng sữa quan trọng
  vì…" — dẫn link ngược lên trang mẹ.
- **Liên kết hai chiều bắt buộc.** Mẹ → con ở cuối mỗi mục; con → mẹ ở đầu bài.
- **Không trang nào được đặt cùng một `title` hay `description`.** Đây là chỗ
  trùng lặp lộ ra sớm nhất.

### 3. Collection `posts` — cái duy nhất phải thêm

`src/content.config.ts` hiện có `services` và `doctors`. Thêm `posts`, cùng mô
hình `key` + `lang` như `services` để bài viết ghép cặp được giữa hai ngôn ngữ.

### 4. Checklist thêm một route mới

Bốn trang mới. Mỗi trang phải đi hết 7 bước, **thiếu bước nào cũng không có gì
báo lỗi ngoài bước 4**:

1. `src/i18n/routes.ts` → thêm key vào `STATIC_PAGES` (vi + en slug)
2. `src/pages/<slug-vi>.astro`
3. `src/pages/en/<slug-en>.astro`
4. `src/i18n/ui.ts` → khoá vi **và** en (`ui.test.ts` có sẵn chặn nếu lệch số lượng)
5. `src/components/Header.astro` → `aboutItems` hoặc `serviceItems`, và `mobileNav`
6. `src/components/Footer.astro` → cột điều hướng
7. `src/lib/searchIndex.ts` → mảng `pages` (đang hardcode `['about','pricing','blog','contact']`)

Sitemap tự sinh, không cần đụng.

### 5. Ràng buộc bố cục

Site có 24 bố cục đổi được lúc chạy, vài bố cục sắp lại thứ tự section trang chủ
bằng `order`. Section mới trên **trang chủ** phải mang `data-part` và không được
giả định vị trí của nó trong luồng. Trang con không bị ảnh hưởng.

### 6. Từ khoá mục tiêu

⚠ Đây là **phán đoán, không phải số liệu**. Chưa tra công cụ từ khoá. Dùng để
định hướng tiêu đề và slug; nếu sau này có số liệu thật thì sửa lại.

| Trang / bài | Truy vấn nhắm tới |
|---|---|
| `/nha-khoa-tre-em/` | nha khoa trẻ em đà nẵng · khám răng cho bé |
| Bài `nho-rang-sua` | có nên nhổ răng sữa cho bé · nhổ răng sữa sớm có sao không |
| Bài `chup-phim-6-7-tuoi` | chụp phim răng cho trẻ mấy tuổi · phim panorama trẻ em |
| Bài `thoi-quen-xau-lech-ham` | mút tay lệch hàm · thở miệng ảnh hưởng răng |
| Bài `chinh-nha-som` | niềng răng cho trẻ mấy tuổi · chỉnh nha sớm cho bé |
| Bài `an-toan-tia-x` | chụp x quang răng có hại không |
| `/quy-trinh-vo-trung/` | phòng khám nha khoa vô trùng đà nẵng |
| `/thiet-bi/` | máy chụp ct conebeam đà nẵng · itero đà nẵng |

Mỗi trang **một** truy vấn chính, và truy vấn đó phải nằm trong `title`. Không
nhồi từ khoá vào thân bài.

---

## Thứ tự: hai luồng song song

Luồng chữ và luồng ảnh chặn bởi hai thứ khác nhau, nên chạy độc lập.

```
LUỒNG A — chữ (bắt đầu ngay)
  Task 1 hạ tầng posts
    → Task 2 trang danh sách + chi tiết
      → Task 3 bảng thuật ngữ vi→en
        → Bài 1, 2, 3  (răng sữa · đính chính mọc lệch · chụp phim 6–7 tuổi)

LUỒNG B — ảnh (bắt đầu ngay bằng Task 4, phần còn lại chờ buổi chụp)
  Task 4 brief chụp ảnh + đặt lịch thợ
    → [buổi chụp]
      → Task 5–7 trang Vô trùng
        → Task 8–10 trang Thiết bị
          → Task 11–14 trang Nha khoa trẻ em

LUỒNG C — chờ bác sĩ trả lời §4 kịch bản
  Task 15 biểu đồ tăng trưởng
  Task 16–18 ba trang dịch vụ
  Task 19–20 hồ sơ bác sĩ, Giới thiệu, Liên hệ
  Bài 4, 5, 6
```

**Điểm gặp:** luồng A và B gặp nhau ở trang Nha khoa trẻ em — trang mẹ cần link
xuống ba bài viết đã có. Nên viết bài trước, trang mẹ sau.

---

## LUỒNG A — hạ tầng và ba bài đầu

### Task 1: Collection `posts`

**Files:**
- Sửa: `src/content.config.ts`
- Tạo: `src/content/posts/vi/.gitkeep`, `src/content/posts/en/.gitkeep`
- Tạo: `src/lib/posts.ts`

- [x] **Bước 1 — schema.** Thêm vào `src/content.config.ts`, đặt cạnh `services`:

```ts
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    /** Nối bản dịch giữa hai ngôn ngữ. Hai file cùng key phải là cùng một bài. */
    key: z.string().min(1),
    lang: z.enum(LOCALES as unknown as [string, ...string[]]),
    title: z.string().min(1),
    /** 120–160 ký tự, cùng lý do như services: ngắn phí chỗ, dài bị Google cắt. */
    description: z.string().min(120).max(160),
    /** Ngày đăng. Google dùng cho nội dung y tế, và bệnh nhân cũng nhìn. */
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    /** Slug dịch theo ngôn ngữ. Không suy ra từ tên file để URL vi đọc được. */
    slug: z.string().min(1),
    /**
     * Bác sĩ chịu trách nhiệm chuyên môn, trỏ tới id trong collection doctors.
     * Bắt buộc: nội dung y tế không có người đứng tên thì không nên đăng.
     */
    reviewedBy: z.string().min(1),
    keywords: z.array(z.string().min(1)).default([]),
  }),
});

export const collections = { services, doctors, posts };
```

- [x] **Bước 2 — chốt chặn lúc build.** Không viết test; ném lỗi ngay trong lúc
      dựng trang. Tạo `src/lib/posts.ts`, và mọi nơi cần danh sách bài đều gọi
      qua hàm này chứ không gọi thẳng `getCollection('posts')`:

```ts
import { getCollection } from 'astro:content';
import { LOCALES, type Locale } from '../i18n/locales';

/**
 * Nạp bài viết của một ngôn ngữ, và chặn build nếu dữ liệu sai.
 *
 * Hai lỗi dưới đây không lộ ra lúc chạy — trang vẫn dựng xong, chỉ là bộ chọn
 * ngôn ngữ dẫn tới 404, hoặc một bài lặng lẽ đè lên bài khác. Ném lỗi ở đây là
 * lúc duy nhất bắt được chúng.
 */
export async function getPosts(locale: Locale) {
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
      throw new Error(`Bài "${key}" thiếu bản dịch: ${missing.join(', ')}`);
    }
  }

  const mine = all.filter((p) => p.data.lang === locale);
  const slugs = mine.map((p) => p.data.slug);
  const dup = slugs.find((s, i) => slugs.indexOf(s) !== i);
  if (dup) throw new Error(`Trùng slug "${dup}" trong bài tiếng ${locale}`);

  return mine.sort((a, b) => +b.data.publishedAt - +a.data.publishedAt);
}
```

- [x] **Bước 3 — commit.** `feat: thêm collection posts cho mục kiến thức nha khoa`

### Task 2: Trang danh sách + trang chi tiết bài viết

**Files:**
- Sửa: `src/layouts/BlogIndex.astro` (đang là vỏ rỗng 31 dòng)
- Tạo: `src/layouts/PostDetail.astro`
- Tạo: `src/pages/kien-thuc-nha-khoa/[slug].astro`
- Tạo: `src/pages/en/dental-knowledge/[slug].astro`
- Sửa: `src/i18n/routes.ts`, `src/lib/searchIndex.ts`, `src/components/StructuredData.astro`

- [x] Danh sách: nhóm theo năm, mới nhất trước, mỗi mục tiêu đề + mô tả + ngày.
      Không thẻ đổ bóng — dùng `divide-y divide-steel`, đúng ngôn ngữ thị giác
      đang có ở `ServiceCards`.
- [x] Chi tiết: đo dòng `max-w-[68ch]`, mục lục nhảy neo nếu bài có >3 `h2`, cuối
      bài là khối "Bài này được duyệt bởi <bác sĩ>" đọc từ `reviewedBy`.
- [x] `pathFor('post:<key>', locale)` — cùng khuôn với `service:`. Nhớ nạp cả
      đường dẫn bài viết vào bảng `PATH_TO_KEY` ở cuối `routes.ts`, nếu không
      `keyFromPath` trả `undefined` và breadcrumb cùng bộ chọn ngôn ngữ hỏng
      lặng lẽ. Bảng đó hiện chỉ duyệt `STATIC_PAGES` và `SERVICE_KEYS`.
- [x] Chuyển ngôn ngữ: đứng ở bài tiếng Việt bấm EN phải sang **đúng bài đó**,
      không rơi về trang danh sách. Đây là chỗ dễ hỏng nhất của cả task.
- [x] JSON-LD `Article` với `author` và `reviewedBy` trỏ tới `Person` của bác sĩ.
- [x] Commit: `feat: trang danh sách và chi tiết bài viết`

### Task 3: Bảng thuật ngữ vi→en

**Files:** `docs/superpowers/specs/2026-08-06-thuat-ngu.md`

Làm **trước** khi dịch bất kỳ câu nào. 9 trang mà dịch tuỳ hứng thì "vô trùng"
thành *sterile* ở trang này và *aseptic* ở trang kia, và không ai phát hiện ra.

- [x] Bảng khởi điểm, bác sĩ duyệt trước khi dùng:

| Tiếng Việt | Tiếng Anh | Ghi chú |
|---|---|---|
| vô trùng | aseptic / sterile field | phụ thuộc câu trả lời ⚠7 ở kịch bản |
| tiệt trùng | sterilisation | quá trình trong nồi hấp |
| khử trùng | disinfection | mức thấp hơn tiệt trùng |
| nồi hấp | autoclave | |
| bể rửa siêu âm | ultrasonic bath | ghi chép ghi là "rung" |
| màng bọc dùng một lần | barrier film | |
| răng sữa | primary teeth | *baby teeth* ở văn nói, không dùng trong bài |
| răng vĩnh viễn | permanent teeth | |
| giai đoạn răng hỗn hợp | mixed dentition | |
| khí cụ tháo lắp | removable appliance | |
| răng ngầm | impacted tooth | |
| cười hở lợi | gummy smile | |
| phim toàn cảnh | panoramic radiograph | ghi chép gọi là "pano" |
| chỉnh nha | orthodontics | |
| cấy ghép Implant | dental implant | giữ chữ "Implant" hoa ở bản vi |

- [x] Dùng chính tả Anh-Anh (*sterilisation*, không *sterilization*) cho nhất
      quán với thị trường khách quốc tế ở Đà Nẵng — phần lớn là châu Âu và Úc.
- [x] Commit: `docs: bảng thuật ngữ vi-en cho nội dung y khoa`

### Task 4 (LUỒNG B, bắt đầu song song): Brief chụp ảnh

**Files:** `docs/superpowers/specs/2026-08-06-brief-chup-anh.md` — đã viết sẵn.

- [ ] Chủ phòng khám đọc và bổ sung chỗ nào chụp được / không chụp được
- [ ] Đặt lịch thợ. **Không chụp trước khi chốt shot list** — thiếu shot list là
      phải chụp lại buổi thứ hai.
- [ ] Thu văn bản đồng ý sử dụng hình ảnh cho toàn bộ nhân sự có mặt trong khung

### Task 4b: Ảnh tạm, để dựng đủ bộ khung ngay

**Files:** `src/data/images.ts`, `src/components/DoctorAvatar.astro`

Không chờ buổi chụp mới dựng được trang. Cơ chế ảnh tạm đã có sẵn và đủ dùng.

- [x] Khai 14 khoá ảnh mới trong `images.ts`, tất cả `placeholder: true`, và
      **`brief` chép đúng từ brief chụp ảnh** — trường đó chính là thứ hiện lên
      nhãn, nên nó vừa là chú thích cho mình vừa là ghi chú cho thợ chụp
- [x] Ảnh phòng ốc và thiết bị: dùng picsum như các khoá đang có, cùng cách đặt
      hạt giống `vcare-*` để mỗi lần build ra đúng ảnh đó
- [x] Chân dung bác sĩ: ảnh tạm từ `i.pravatar.cc`, hạt giống cố định theo `key`
      của bác sĩ để mỗi lần build ra đúng mặt đó. Cộng `DoctorAvatar.astro` vẽ
      khối màu có chữ cái đầu, dùng khi `portrait` để trống — trang không bao
      giờ hiện ảnh vỡ.
- [x] Không gỡ hai chốt chặn: nhãn "ảnh tạm", và `clinic.isDemoData`. Bộ hồ sơ
      bác sĩ ghép mặt người với tên và số chứng chỉ, nên **`isDemoData` chỉ được
      đặt về `false` khi đã thay đủ cả bốn: ảnh, tên, chứng chỉ, số giấy phép.**
      Thay ảnh thật mà quên tên mẫu thì ra hồ sơ nửa thật nửa giả, tệ hơn để
      nguyên bộ giả.
- [x] Commit: `feat: khai ảnh tạm cho ba trang tin cậy và hồ sơ bác sĩ`

### Task 5–7: Ba bài viết đầu tiên

| # | key | Nguồn kịch bản | Ảnh cần |
|---|---|---|---|
| 1 | `nho-rang-sua` | ch.3.1 + 3.2 | không |
| 2 | `chup-phim-6-7-tuoi` | ch.3.3 | không |
| 3 | `thoi-quen-xau-lech-ham` | ch.3.4 | không — chờ BS bổ sung hậu quả từng thói quen |

- [x] Viết bài 1 và 2 **trước tiên** trong cả plan, để thử toàn bộ đường ống bằng
      nội dung thật trước khi viết bảy trang còn lại
- [x] Mỗi bài viết cả vi và en cùng lúc, dùng bảng thuật ngữ Task 3
- [x] `reviewedBy` trỏ đúng bác sĩ — đừng để trỏ hết vào một người
- [ ] **Cổng duyệt:** bác sĩ đọc bản EN trước khi đăng
- [ ] Commit từng bài một

---

## LUỒNG B — ba trang tin cậy

### Task 8: Route `/quy-trinh-vo-trung/` · `/en/sterilisation/`
- [x] Checklist 7 bước. Vào `aboutItems` trong `Header.astro`, icon `ph:shield-check`
- [ ] Commit

### Task 9: Sơ đồ bốn bước

**Files:** `src/components/SterileSteps.astro`

- [x] Ngâm → Rửa → Rung → Đóng gói và hấp, dạng `<ol>` ngang trên desktop, dọc
      trên mobile. Mượn khuôn `implantSteps` ở `src/pages/index.astro` (lưới
      `gap-px bg-steel`, không thẻ nổi) để hai trang cùng một giọng.
- [x] Mỗi bước một ảnh, khai trong `images.ts` với `placeholder: true` cho tới
      sau buổi chụp. Nhãn "ảnh tạm" của cơ chế sẵn có lo phần cảnh báo, nên bộ
      khung dựng đủ được ngay mà không có rủi ro đăng nhầm.
- [x] Commit

### Task 10: Nội dung trang Vô trùng, vi + en
- [x] §2 chương 1 của kịch bản, gồm khối hộp vô trùng và câu "túi dụng cụ có
      được bóc trước mặt bạn không"
- [x] Câu mở phụ thuộc ⚠7 — chờ bác sĩ
- [x] Câu chốt làm `h2` cuối: *"Mọi vị trí bác sĩ chạm vào trong lúc điều trị đều
      là vị trí vô trùng."*
- [x] Khối phòng phẫu thuật tầng 2, liên kết chéo sang trang Implant
- [x] Commit

### Task 11: Route `/thiet-bi/` · `/en/technology/`
- [x] Checklist 7 bước
- [x] Commit

### Task 12: Khối CT ConeBeam
- [x] Bảng ba chế độ (thường / chỉnh nha / 3 chiều), mỗi dòng nói rõ **trả lời
      câu hỏi gì**, không liệt kê thông số máy
- [x] Khối FAQ "Chụp nhiều vậy có nhiễm tia không" — dùng lại cơ chế `faq` đã có
      ở `ServiceDetail.astro` để ăn rich result, đừng viết mới
- [ ] **Chặn bởi ⚠3** (tên cơ quan kiểm định) cho phần trả lời chính
- [x] Commit

### Task 13: Khối iTero
- [x] Bốn lợi ích ở §2 chương 4, viết ở ngôi bệnh nhân ("bạn nhận được"), không
      phải ngôi phòng khám ("chúng tôi trang bị")
- [x] Liên kết chéo sang trang Chỉnh nha (Invisalign)
- [x] Commit

### Task 14: Route `/nha-khoa-tre-em/` · `/en/childrens-dentistry/`
- [x] Checklist 7 bước. Trang này vào **`serviceItems`**, không vào `aboutItems` —
      nó là cửa vào dịch vụ, không phải trang giới thiệu.
- [ ] Commit

### Task 15: Sơ đồ nong rộng cung hàm

**Files:** `src/components/ArchDiagram.astro`

- [x] SVG viết tay theo đúng hình vẽ ở trang 2 ghi chép: cung hàm nhìn từ trên,
      mũi tên hướng ra hai bên, có khung viền
- [x] **Dùng `currentColor` và biến token**, không mã màu cứng — site có 3 bảng
      màu và 2 nền, sơ đồ phải đi theo. Đây là lý do vẽ SVG chứ không chèn ảnh.
- [x] `role="img"` + `<title>` mô tả bằng lời: hình này mang thông tin y khoa,
      không phải trang trí
- [x] Commit

### Task 16: Nội dung trang mẹ Nha khoa trẻ em, vi + en
- [x] §2 chương 3.1 → 3.4 và 3.7. Ba mục 3.1–3.3 làm được ngay.
- [x] **Giữ đúng vai trang mẹ:** không mô tả kỹ thuật. Mỗi mục kết bằng một link
      xuống bài viết hoặc trang dịch vụ tương ứng.
- [x] Mục 3.7 (bác sĩ chuyên sâu) chỉ đăng khi ⚠4 xác nhận đúng 100%
- [x] Link xuống 3 bài đã viết ở Task 5–7, và xuống hai trang dịch vụ con
- [ ] Commit

---

## LUỒNG C — chờ bác sĩ trả lời §4 kịch bản

### Task 17: Biểu đồ tăng trưởng

**Files:** `src/components/GrowthChart.astro`

- [ ] **Chặn cứng bởi ⚠2.** Không dựng biểu đồ bằng số đoán. Số sai trên biểu đồ
      trông đáng tin hơn số sai trong câu văn — nên nguy hiểm hơn, không phải ít
      hơn.
- [ ] Khi có số: SVG, hai đường trai/gái, tô nền vùng "cửa sổ can thiệp"
- [ ] Kèm bảng số liệu cho screen reader, đừng để biểu đồ là kênh duy nhất
- [ ] Đặt vào trang mẹ trẻ em và bài `chinh-nha-som`
- [ ] Commit

### Task 18: Trang dịch vụ Implant
**Files:** `src/content/services/vi/cay-ghep-implant.md` + `en`
- [ ] **Chặn bởi §5.1 kịch bản.** Chờ bác sĩ duyệt bản viết lại.
- [ ] Thêm FAQ "Mất răng lâu năm còn cấy được không" vào frontmatter `faq`
- [ ] Liên kết sang Vô trùng (phòng phẫu thuật tầng 2) và Thiết bị (phim 3D)
- [ ] Commit

### Task 19: Cười hở lợi
**Files:** `src/content/services/vi/cuoi-ho-loi.md` + `en`
- [x] Hai nguyên nhân / hai mức can thiệp ở §2 chương 5. Phần này hiện thiếu
      hoàn toàn và nó là phần quyết định của cả dịch vụ.
- [ ] Commit

### Task 20: Chỉnh nha
**Files:** `src/content/services/vi/nieng-rang-chinh-nha.md` + `en`
- [x] Thêm nhánh chỉnh nha sớm, **link ngược lên trang mẹ trẻ em**, không nhắc
      lại bối cảnh
- [x] Thêm Invisalign, link sang trang Thiết bị
- [ ] Commit

### Task 21: Bốn hồ sơ bác sĩ còn thiếu
**Files:** `src/content/doctors/vi/*.md` ×4 + `en`, `src/content/doctors-schema.ts`

- [x] **Dựng khung ngay bằng hồ sơ mẫu.** Repo đã có sẵn khuôn: `bac-si-mau.md`
      dùng tên "BS. Nguyễn Văn A" và mở đầu thân bài bằng dòng cảnh báo
      "ĐÂY LÀ HỒ SƠ MẪU, TOÀN BỘ SỐ LIỆU LÀ GIẢ". Thêm 4 hồ sơ theo đúng khuôn
      đó, giữ nguyên dòng cảnh báo. Số liệu thật thay sau, khi ⚠6 và ⚠10 có câu
      trả lời — schema `doctors-schema.ts` ép đủ trường chứng chỉ nên không lách
      được bằng cách để trống.
- [x] **Sửa một lỗi đang có.** `bac-si-mau.md` khai `portrait: ./bac-si-mau.jpg`
      nhưng file đó không tồn tại trong thư mục. Schema khai `portrait` là
      `z.string()` chứ không phải `image()`, nên Astro không kiểm và lỗi này đi
      lọt hoàn toàn im lặng. Hai cách sửa, chọn cách thứ hai:
      - đổi sang `image()` — bắt lỗi ngay lúc build, nhưng bắt buộc phải có file
        ảnh mới thêm được hồ sơ, tức là chặn luôn việc dựng khung
      - **đổi `portrait` thành optional**, và khi thiếu thì component đổ về
        `DoctorAvatar` ở Task 4b. Dựng khung được ngay, và trang không bao giờ
        hiện ảnh vỡ.
- [ ] Commit

### Task 22: Giới thiệu và Liên hệ
**Files:** `src/layouts/AboutPage.astro`, `src/layouts/ContactPage.astro`
- [x] Bảng ê-kíp 5 BS / 4 ĐD / 1 lễ tân / hộ lý
- [x] Dòng "ngoài giờ vẫn nhận tư vấn cả ngày" vào `ContactPage` **và**
      `UtilityBar.astro` cạnh giờ mở cửa — đây là thứ người ta cần lúc 21h
- [ ] Dòng bệnh nhân nước ngoài: **chỉ vào bản `en`, và chỉ khi ⚠8 xác nhận**
- [ ] Commit

### Task 23–25: Ba bài viết còn lại

| # | key | Nguồn | Chặn |
|---|---|---|---|
| 4 | `chinh-nha-som` | ch.3.5 + 3.6 | ⚠1, ⚠2 |
| 5 | `an-toan-tia-x` | ch.2 | ⚠3 |
| 6 | `vo-trung-khong-phai-la-sach` | ch.1 | ⚠7 |

---

## Việc còn treo từ Plan 1

Không thuộc plan này nhưng vẫn đang chặn deploy thật:

- `src/data/clinic.ts` vẫn `isDemoData: true` → `assertNoPlaceholders()` chặn
  build production. Cần: bảng giá chính thức, số giấy phép, năm thành lập, URL
  Facebook thật, xác nhận phường.
- `src/data/images.ts` vẫn trỏ picsum. Buổi chụp ở Task 4 giải quyết phần lớn.
- Cloudflare: kiểm `_redirects` sau lần deploy thành công đầu tiên.
