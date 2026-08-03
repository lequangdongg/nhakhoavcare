# Thiết kế: Rebuild website Nha Khoa Vcare

**Ngày:** 2026-08-03
**Trạng thái:** Đã duyệt, sẵn sàng lập kế hoạch thi công

---

## 1. Bối cảnh

`nhakhoavcare.com` là website của một phòng khám nha khoa tại Đà Nẵng, hiện chạy trên nền tảng Blogger với theme dựng sẵn. Site đang có các vấn đề:

- Menu có ~10 mục trỏ tới `#`, không có nội dung (Tẩy trắng răng, Chỉnh nha, Dịch vụ trẻ em...)
- Hero slider 6 ảnh không có tiêu đề, không có lời kêu gọi hành động
- Icon "Sửa bài đăng" của Blogger lộ ra trang công khai
- Giờ làm việc hiện ở 2 nơi (khối chính và footer) với **số liệu khác nhau**
- Nội dung dán từ Facebook: đầy emoji, định dạng lộn xộn
- Toàn bộ giao diện là widget Blogger, không kiểm soát được

### Mục tiêu số 1

**Site phải trông chuyên nghiệp và tạo được cảm giác uy tín.** Đây là tiêu chí quyết định thành bại. Các mục tiêu khác (SEO, chuyển đổi, dễ quản lý) là hệ quả mong muốn nhưng không phải thước đo chính.

### Nguyên tắc chi phối

Mọi đánh đổi trong tài liệu này đều được giải quyết theo hướng: **thứ gì làm giảm cảm giác đáng tin thì loại bỏ, kể cả khi nó ấn tượng về mặt kỹ thuật.** Cụ thể: hiệu năng kém trên điện thoại phá uy tín nhanh hơn thiết kế xấu; animation quá tay đọc ra là màu mè chứ không phải cao cấp; nội dung tiếng Anh dịch máy bị nhận ra trong hai câu.

---

## 2. Phạm vi

### Trong phạm vi

- Website tĩnh đa ngôn ngữ (tiếng Việt + tiếng Anh, nội dung ngang nhau 100%)
- **Toàn bộ trang đang tồn tại trên site cũ** đều được port sang; chỉ loại những trang có URL hỏng
- 4 nhóm dịch vụ, phân tầng theo thứ tự thi công (xem §3)
- Trang chủ, giới thiệu, bảng giá, liên hệ, blog kiến thức
- Tìm kiếm toàn site dạng command palette
- Chế độ sáng / tối / theo hệ thống
- Lớp tối ưu cho công cụ tìm kiếm truyền thống và cho trợ lý AI
- Chuyển domain từ Blogger sang hạ tầng mới

Ở bản launch đầu tiên, kênh liên hệ là **nút gọi điện, nút Zalo và nút chỉ đường** — nổi bật trên mọi trang. Không có form. Với phòng khám Việt Nam đây vẫn là kênh chuyển đổi mạnh nhất, và nó không phụ thuộc backend nào.

- **Hồ sơ bác sĩ chi tiết** — chứng chỉ, bằng cấp, thành tựu (xem §8.1)

### Hoãn sang sau khi launch

- **Hệ thống nhận yêu cầu đặt lịch** (§11) — thiết kế đã hoàn chỉnh và giữ nguyên trong spec, nhưng không thi công ở bản đầu. Xây khi site đã chạy ổn định.

### Ngoài phạm vi (YAGNI)

- **CMS** — chủ dự án tự sửa file trong repo. Không dựng Sanity/Payload/Decap.
- **Đặt lịch xác nhận tức thì theo khung giờ trống** — kể cả khi làm §11 về sau, cũng chỉ nhận _yêu cầu_ rồi gọi lại xác nhận. Không hiển thị lịch trống thật, không có huỷ/đổi lịch tự động.
- **Tài khoản người dùng, hồ sơ bệnh nhân, thanh toán online**
- **Bảng ánh xạ URL đầy đủ cho SEO** — chủ dự án đã quyết định bỏ. Xem §11.
- **Refactor không liên quan** — không có codebase cũ để refactor; đây là dự án mới hoàn toàn.

---

## 3. Phân tầng nội dung dịch vụ

Cả 4 nhóm đều được làm, nhưng độ sâu và thứ tự khác nhau. Dàn đều là cách chắc chắn để không nhóm nào đủ mạnh.

| Đợt | Nhóm                                                                       | Độ sâu                                                                                                   |
| --- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1   | **Implant / trồng răng**                                                   | Trang trụ cột đầy đủ: giá chi tiết, quy trình từng bước, FAQ dài, gallery trước/sau, chính sách bảo hành |
| 1   | **Thẩm mỹ** (Veneer, bọc sứ, tẩy trắng)                                    | Như trên, trọng tâm là gallery trước/sau                                                                 |
| 2   | **Chỉnh nha / niềng răng**                                                 | Cùng khuôn mẫu, làm ngay sau đợt 1. Hiện là menu chết trên site cũ nên viết mới hoàn toàn                |
| 3   | **Nha khoa tổng quát** (lấy cao răng, trám, chữa tủy, nhổ răng, phục hình) | Gộp thành nhóm trang gọn, đủ chuẩn SEO nhưng không viết dài                                              |

---

## 4. Stack & hạ tầng

| Hạng mục         | Lựa chọn                             | Lý do                                                                                                                                               |
| ---------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework        | **Astro 7** (`output: 'static'`)     | Mặc định xuất HTML tĩnh, 0 KB JavaScript. Content Collections khớp với mô hình "sửa file markdown trong repo". i18n routing gốc. Tối ưu ảnh sẵn có. |
| Kiểu render      | **SSG — dựng sẵn toàn bộ lúc build** | Xem §4.1                                                                                                                                            |
| Sitemap          | **`@astrojs/sitemap`** có khai i18n  | Xem §4.2                                                                                                                                            |
| CSS              | **Tailwind 4**                       | Mobile-first theo mặc định (class không tiền tố = mobile).                                                                                          |
| Ngôn ngữ         | **TypeScript**, strict mode          |                                                                                                                                                     |
| Hosting          | **Cloudflare Pages**                 | Có PoP tại Việt Nam; Vercel free tier gần nhất là Singapore. Với khách Đà Nẵng, chênh lệch này đo được.                                             |
| Deploy           | **Wrangler CLI**                     | Deploy từ terminal, không phụ thuộc giao diện web.                                                                                                  |
| Tìm kiếm         | **Pagefind**                         | Sinh chỉ mục lúc build, chia mảnh, tải lười. Đa ngôn ngữ sẵn.                                                                                       |
| Animation        | **CSS thuần + `motion` (~5 KB)**     | Xem §8.                                                                                                                                             |
| Font             | **`@fontsource`, tự host**           | Không gọi Google Fonts (thêm một vòng kết nối ngoài = chậm).                                                                                        |
| Backend đặt lịch | **Cloudflare Pages Functions**       | Một endpoint duy nhất, nằm trong repo, deploy cùng một lệnh `wrangler`. Site vẫn tĩnh.                                                              |
| Lưu lịch hẹn     | **Google Sheets API**                | Nhân viên xem/lọc/ghi chú bằng công cụ đã dùng hàng ngày. Không phải xây trang quản trị.                                                            |
| Thông báo        | **Google Calendar API + email**      | Calendar hiện ngay trên điện thoại nhân viên, không cần cài gì.                                                                                     |
| Chống bot        | **Cloudflare Turnstile**             | Miễn phí, chạy sẵn trên Cloudflare, không dùng CAPTCHA gây khó chịu.                                                                                |

### 4.1 SSG — dựng sẵn tĩnh

`output: 'static'`. Mọi trang được dựng thành file HTML **lúc build**, không có máy chủ nào chạy lúc khách truy cập.

Vì sao chọn kiểu này chứ không phải SSR:

- **Tốc độ chỉ phụ thuộc CDN.** Không có thời gian máy chủ nghĩ, không có truy vấn cơ sở dữ liệu. Trên 4G ở Đà Nẵng, đây là khác biệt đo được.
- **Không có gì để hỏng lúc chạy.** Không có máy chủ sập, không có tràn kết nối. Site nha khoa không cần dữ liệu thay đổi theo từng khách.
- **Rẻ.** Cloudflare Pages phục vụ file tĩnh miễn phí, không giới hạn băng thông.
- **Bảo mật.** Không có mã chạy phía máy chủ trên đường tải thông thường ⇒ gần như không có bề mặt tấn công.

Ngoại lệ duy nhất là endpoint đặt lịch `/api/booking` (§11, hoãn sau launch) — nó là Cloudflare Pages Function riêng, không đổi bản chất tĩnh của phần còn lại.

Hệ quả cần nhớ: **đổi nội dung phải build lại.** Với site này là chấp nhận được vì chủ dự án sửa file trong repo rồi deploy, không có ai đăng bài lúc nửa đêm.

### 4.2 Sitemap

`@astrojs/sitemap` sinh `sitemap-index.xml` + `sitemap-0.xml` tự động lúc build.

Cấu hình quan trọng: khai `i18n` để mỗi URL mang đầy đủ thẻ `xhtml:link rel="alternate"` trỏ sang bản dịch. Không có phần này, Google dễ coi hai bản ngôn ngữ là **nội dung trùng lặp** thay vì bản dịch của nhau.

```xml
<url>
  <loc>https://www.nhakhoavcare.com/</loc>
  <xhtml:link rel="alternate" hreflang="vi-VN" href="https://www.nhakhoavcare.com/"/>
  <xhtml:link rel="alternate" hreflang="en-US" href="https://www.nhakhoavcare.com/en/"/>
</url>
```

Kèm theo: `filter` loại trang 404 và trang kỹ thuật khỏi sitemap; `robots.txt` trỏ tới `sitemap-index.xml`.

Lưu ý phối hợp: sitemap dùng mã đầy đủ (`vi-VN`, `en-US`) còn thẻ `hreflang` trong `<head>` dùng mã ngắn (`vi`, `en`). Cả hai đều hợp lệ với Google.

### Wrangler

```
wrangler.toml            cấu hình project, thư mục build
npm run deploy           → wrangler pages deploy dist
npm run deploy:preview   → wrangler pages deploy --branch preview
npx wrangler tail        xem log thật khi có sự cố
npx wrangler secret put  nạp khóa service account, không bao giờ vào git
```

Khóa service account Google, Sheet ID, Calendar ID và khóa dịch vụ mail đều lưu bằng `wrangler secret`. **Không có bí mật nào nằm trong repo hay lộ ra front-end.**

### Chuyển domain

`nhakhoavcare.com` chỉ trỏ sang site mới **sau khi** kiểm tra xong toàn bộ. Blogger giữ chạy song song tới phút cuối. Đổi DNS là bước cuối cùng của dự án, không phải bước đầu.

---

## 5. Kiến trúc thư mục

```
src/
  data/
    clinic.ts              ← NGUỒN DUY NHẤT: SĐT, Zalo, địa chỉ, giờ làm việc, tọa độ, sameAs
  content/
    config.ts              ← Zod schema cho mọi collection
    services/
      vi/cay-ghep-implant.md
      en/dental-implant.md         (cùng key: "implant")
    posts/
      vi/... en/...
    pages/
      vi/... en/...
  i18n/
    vi.json  en.json       ← chuỗi giao diện
    utils.ts               ← helper lấy chuỗi, đổi locale, sinh hreflang
  assets/                  ← ảnh gốc, Astro tự nén
  components/
  layouts/
  pages/
    index.astro            (vi, gốc)
    en/index.astro
  styles/
    tokens.css             ← CSS custom properties theo vai trò
functions/
  api/
    booking.ts             ← Cloudflare Pages Function, endpoint DUY NHẤT có server
  lib/
    google-auth.ts         ← ký JWT service account, đổi lấy access token
    sheets.ts  calendar.ts  mail.ts
public/
  robots.txt  llms.txt  _redirects
docs/superpowers/specs/
```

---

## 6. Nguồn dữ liệu duy nhất

`src/data/clinic.ts` chứa toàn bộ thông tin phòng khám: tên, địa chỉ, số điện thoại, Zalo, email, giờ làm việc từng ngày, tọa độ bản đồ, link Facebook và Google Business Profile.

Header, footer, trang liên hệ, JSON-LD schema, modal tìm kiếm — **tất cả đọc từ đúng file này**.

Đây là biện pháp cấu trúc để chặn lỗi "giờ làm việc hiện 2 nơi với số liệu khác nhau" của site cũ. Không phải quy ước cần nhớ; về mặt kỹ thuật lỗi đó không thể tái diễn.

Ràng buộc kèm theo: thông tin Tên–Địa chỉ–SĐT (NAP) trong file này phải **trùng khớp tuyệt đối từng ký tự** với Google Business Profile và Facebook. Sai lệch làm công cụ tìm kiếm và trợ lý AI mất tự tin về thực thể.

---

## 7. Mô hình nội dung & i18n

### Routing

Tiếng Việt ở gốc, không tiền tố — để không phá cấu trúc URL đang có thứ hạng:

```
/dich-vu/cay-ghep-implant          vi (mặc định)
/en/services/dental-implant        en
```

Slug được dịch theo từng ngôn ngữ, không dùng chung.

**Đã cân nhắc và bác bỏ phương án dùng một cấu trúc tiếng Anh cho cả hai ngôn ngữ.** Lý do: từ khóa trong URL hiện ra ngay trên kết quả Google, và phần áp đảo lưu lượng của phòng khám là người Việt tìm bằng tiếng Việt. `dich-vu/cay-ghep-implant` đọc hiểu tức thì; `services/dental-implant` bắt người đọc dịch trong đầu. Chi phí kỹ thuật của hai phương án là như nhau (vẫn nối bằng `key`, vẫn sinh `hreflang`), nên đây thuần túy là đánh đổi SEO lấy sự đối xứng hình thức — không đáng. Đây cũng là chuẩn mực chung: Booking.com, IKEA, Apple đều dịch cả đường dẫn theo thị trường.

### Liên kết bản dịch

Mỗi file markdown có trường `key` chung giữa các ngôn ngữ (`key: "implant"`). Từ đó tự sinh:

- Thẻ `hreflang` đối xứng giữa hai bản
- Nút chuyển ngôn ngữ trỏ **đúng trang tương ứng**, không đá về trang chủ

### Zod schema

`src/content/config.ts` khai báo mọi trường bắt buộc. Astro đối chiếu toàn bộ file markdown lúc build; sai là **build fail**, không lọt lên production.

Ví dụ cho collection `services`:

| Trường        | Ràng buộc                            |
| ------------- | ------------------------------------ |
| `title`       | bắt buộc                             |
| `key`         | bắt buộc, dùng để nối bản dịch       |
| `lang`        | `"vi"` hoặc `"en"`                   |
| `description` | 120–160 ký tự (tránh Google cắt cụt) |
| `heroImage`   | file ảnh phải tồn tại thật           |
| `priceFrom`   | số                                   |
| `faq`         | mảng câu hỏi/trả lời                 |

Ba lỗi cụ thể mà nó chặn được:

1. Viết trang tiếng Việt mà quên bản tiếng Anh
2. Đẩy site lên khi ô ảnh vẫn còn là placeholder
3. Thẻ description sai độ dài chuẩn SEO

### Chất lượng bản tiếng Anh

Nội dung tiếng Anh **không được dịch máy**. Google xếp nội dung y tế vào nhóm YMYL và soi rất kỹ; khách nước ngoài nhận ra dịch máy trong hai câu. Hiệu đính bởi người bản ngữ là hạng mục công việc và ngân sách riêng trong kế hoạch, không được bỏ qua.

---

## 8. Hệ thống thiết kế

### Typography

**Ràng buộc cứng: font phải có bộ dấu tiếng Việt đầy đủ.** Ràng buộc này tự động loại phần lớn font mặc định mà công cụ AI hay chọn — bao gồm Inter, vốn cũng nằm trong danh sách đen của Impeccable.

Font tự host qua `@fontsource`. Không gọi Google Fonts.

### Màu & chế độ sáng/tối

Ba chế độ: **theo hệ thống (mặc định), sáng, tối.** Lưu lựa chọn vào `localStorage`.

Toàn bộ màu khai bằng CSS custom properties theo **vai trò** (`--surface`, `--text-primary`, `--border`, `--accent`), không theo tên màu. Đổi theme là đổi một tầng biến.

**Chống lóe sáng:** một đoạn script ~10 dòng chạy **chặn trong `<head>`** trước khi trang vẽ, đọc `localStorage` và gắn class theme. Không có nó, trang lóe trắng một nhịp rồi mới chuyển tối — lỗi này nhìn rất rẻ tiền. Đây là ngoại lệ JavaScript duy nhất được chấp nhận trên đường tải chính.

#### Quy tắc riêng cho ảnh lâm sàng

**Vùng chứa ảnh lâm sàng — đặc biệt là gallery trước/sau và ảnh cận cảnh răng — giữ nền sáng trung tính ở CẢ HAI chế độ.** Chỉ giao diện xung quanh đổi màu.

Lý do không phải thẩm mỹ mà là đạo đức nghề nghiệp: mắt người đánh giá độ trắng của răng theo nền xung quanh. Cùng một tấm ảnh đặt trên nền tối sẽ trông trắng hơn thực tế, khiến kết quả điều trị trông **phóng đại**. Điều này đi ngược trực tiếp mục tiêu uy tín.

Hệ quả: ảnh trước/sau luôn được nhìn trên cùng một nền, ở mọi thiết bị, mọi thời điểm trong ngày.

Cả hai chế độ đều phải đạt tương phản WCAG 2.2 AA — kiểm tự động, không đánh giá bằng mắt.

### 8.1 Hồ sơ bác sĩ

Mỗi bác sĩ là một mục có cấu trúc, không phải đoạn văn tự do. Đây là phần **có sức nặng nhất** đối với mục tiêu uy tín, vì hai lý do cộng dồn:

- **Bệnh nhân tin người, không tin phòng khám.** Ai sẽ cầm mũi khoan là câu hỏi thật.
- **Google xếp nội dung y tế vào nhóm YMYL** và đánh giá theo E-E-A-T (Kinh nghiệm – Chuyên môn – Thẩm quyền – Đáng tin). Hồ sơ bác sĩ có chứng chỉ ghi rõ nguồn chính là tín hiệu mạnh nhất trong nhóm này. Trợ lý AI cũng trích phần này khi được hỏi "nha khoa nào uy tín ở Đà Nẵng".

#### Cấu trúc mỗi hồ sơ

| Trường              | Bắt buộc    | Ghi chú                                               |
| ------------------- | ----------- | ----------------------------------------------------- |
| `name`, `title`     | có          | "BS. Nguyễn Văn A", "Bác sĩ Răng Hàm Mặt"             |
| `yearsOfExperience` | có          | 0–60, chặn con số phi lý                              |
| `portrait`          | có          | Tỷ lệ 4:5, nền sạch                                   |
| `summary`           | có          | 100–300 ký tự                                         |
| `education[]`       | **≥ 1 mục** | Bằng cấp + trường + năm                               |
| `certificates[]`    | **≥ 1 mục** | Tên + **nơi cấp** + **năm**, kèm link xác minh nếu có |
| `achievements[]`    | không       | Số ca đã thực hiện, giải thưởng, báo cáo hội nghị     |
| `specialties[]`     | không       | Khớp key dịch vụ, tự sinh liên kết sang trang dịch vụ |
| `memberships[]`     | không       | Hội Răng Hàm Mặt Việt Nam...                          |
| `languages[]`       | không       | Quan trọng với khách nước ngoài                       |

#### Ràng buộc do Zod cưỡng chế

1. **Chứng chỉ phải truy nguyên được** — bắt buộc có nơi cấp và năm. Một dòng "Chứng chỉ Implant" trống trơn không chứng minh được gì; nó **làm giảm uy tín thay vì tăng**, vì người đọc kỹ sẽ nhận ra nó rỗng.
2. **Không được để trống phần đào tạo** — hồ sơ y tế thiếu mục học vấn là dấu hiệu xấu.
3. **Năm cấp không được ở tương lai** — chặn lỗi gõ nhầm kiểu `2099` trên hồ sơ y tế.
4. **`specialties` phải khớp key dịch vụ có thật** — chặn liên kết chết sang trang dịch vụ.

#### Cần lưu ý về pháp lý

Chứng chỉ và thành tựu công bố trên site phải **có thật và chứng minh được**. Quảng cáo dịch vụ khám chữa bệnh tại Việt Nam chịu điều chỉnh của Luật Quảng cáo (§18-F), và thông tin chuyên môn sai lệch là rủi ro nặng hơn nhiều so với một trang thiết kế xấu. Trường `verifyUrl` có sẵn để trỏ tới bản scan hoặc trang xác minh khi có.

#### Đánh dấu ngữ nghĩa

Mỗi hồ sơ xuất JSON-LD `Person` với `jobTitle`, `alumniOf`, `hasCredential`, `memberOf`, và `worksFor` trỏ về `Dentist` của phòng khám (§12).

### Khung ảnh & shot-list

Chủ dự án chưa có ảnh chụp chuyên nghiệp nhưng sẽ chụp. Thiết kế phải có sẵn khung ảnh định tỷ lệ với placeholder có nhãn, để thả ảnh thật vào sau.

| Slot                         | Tỷ lệ | Cần chụp                                                               |
| ---------------------------- | ----- | ---------------------------------------------------------------------- |
| `hero`                       | 3:2   | Không gian phòng khám, ánh sáng tự nhiên, có người                     |
| `doctor-portrait`            | 4:5   | Chân dung từng bác sĩ, nền sạch, ánh sáng đều — **bắt buộc, xem §8.1** |
| `facility-*`                 | 3:2   | Ghế nha, phòng vô trùng, khu chờ                                       |
| `case-before` / `case-after` | 1:1   | **Cùng góc, cùng ánh sáng, cùng khoảng cách**                          |

Ảnh gốc từ máy chụp bỏ vào `src/assets/`; Astro tự nén và xuất AVIF/WebP nhiều kích thước. Không phải resize tay.

Ràng buộc `case-before`/`case-after` phải chụp cùng điều kiện là bắt buộc — ảnh trước/sau khác ánh sáng là hình thức phóng đại kết quả.

---

## 9. Animation

Mức đã chốt: **vừa đủ, tinh tế.** Lý do loại bỏ phương án mạnh (GSAP + ScrollTrigger, ~40 KB): trên điện thoại Android tầm trung, animation nặng gây giật khi cuộn — mà site giật phá uy tín nhanh hơn bất kỳ thiết kế xấu nào. Animation quá tay cũng nằm trong danh mục "AI slop" mà Impeccable được sinh ra để bắt.

| Kỹ thuật                         | Dùng ở đâu                                 | Chi phí        |
| -------------------------------- | ------------------------------------------ | -------------- |
| CSS `animation-timeline: view()` | Fade/slide khi cuộn                        | 0 KB           |
| Astro View Transitions           | Chuyển trang mượt                          | 0 KB           |
| CSS transition                   | Hover, focus                               | 0 KB           |
| `motion` (~5 KB)                 | Menu mobile, accordion FAQ, modal tìm kiếm | 5 KB, tải lười |

- `@supports` fallback cho trình duyệt chưa hỗ trợ scroll-driven animation
- **`prefers-reduced-motion` tôn trọng toàn cục** — bắt buộc, không phải tùy chọn

---

## 10. Tìm kiếm toàn site

### Kỹ thuật

**Pagefind.** Sinh chỉ mục lúc build, chia nhỏ thành từng mảnh, chỉ tải mảnh cần dùng. **0 KB cho tới khi khách chủ động mở ô tìm kiếm.** Mỗi ngôn ngữ một chỉ mục riêng — đang xem tiếng Anh thì chỉ tìm trong nội dung tiếng Anh.

### Bắt buộc: hỗ trợ gõ không dấu

Khách sẽ gõ `cay ghep implant`, `boc rang su`, `nieng rang`. Không ai gõ dấu trên điện thoại.

Nếu chỉ mục chỉ lưu `cấy ghép implant`, tìm kiếm trả về rỗng và tính năng này vô dụng.

**Giải pháp:** mỗi trang được đánh chỉ mục hai lần — bản có dấu và bản đã bỏ dấu. Đây là hạng mục có test riêng, không phải chi tiết phụ.

### Cách mở

Icon kính lúp trên header, hoặc `Cmd/Ctrl + K`, hoặc phím `/`.

### Nội dung modal

Kiểu tương tác command palette. Các nhóm, theo thứ tự:

```
┌─────────────────────────────────────────────┐
│ 🔍  Tìm dịch vụ, bảng giá, câu hỏi...    ✕ │
├─────────────────────────────────────────────┤
│ HÀNH ĐỘNG NHANH                             │
│   📞  Gọi ngay 0xxx xxx xxx                 │
│   💬  Nhắn Zalo                             │
│   📍  Chỉ đường tới phòng khám              │
│                                             │
│ DỊCH VỤ                                     │
│ BẢNG GIÁ                                    │
│ CÂU HỎI THƯỜNG GẶP                          │
│ BÀI VIẾT                                    │
│                                             │
│ GIAO DIỆN                                   │
│   🖥 Theo hệ thống   ☀️ Sáng   🌙 Tối        │
│                                             │
│ NGÔN NGỮ                                    │
│   Tiếng Việt   English                      │
└─────────────────────────────────────────────┘
```

**Nhóm "Hành động nhanh" đứng đầu là chủ ý:** nó biến ô tìm kiếm từ tiện ích tra cứu thành công cụ chuyển đổi. Khách mở lên định tìm thông tin, nhìn thấy nút gọi trước tiên.

Số điện thoại và link Zalo đọc từ `clinic.ts`.

### Trạng thái rỗng

Khi chưa gõ gì, **không để trống**: hiện sẵn hành động nhanh + 4 dịch vụ trụ cột. Ô rỗng là cơ hội bị bỏ phí.

### Mobile

Không phải hộp nổi giữa màn hình mà là **sheet toàn màn hình**, bàn phím bật lên ngay, vùng bấm tối thiểu 44px.

### Bàn phím & trợ năng

- `↑` `↓` di chuyển, `Enter` mở, `Esc` đóng
- Đóng modal **trả con trỏ về đúng nút đã bấm**
- Focus bị nhốt trong modal (`role="dialog"`, `aria-modal="true"`)
- Số kết quả được thông báo cho trình đọc màn hình
- Đây là thành phần dễ làm hỏng trợ năng nhất trên site → có test riêng

---

## 11. Hệ thống nhận yêu cầu đặt lịch — HOÃN SAU LAUNCH

> **Trạng thái: thiết kế xong, chưa thi công.** Bản launch đầu chỉ có nút gọi / Zalo / chỉ đường (§2). Toàn bộ mục này giữ nguyên để xây ở đợt sau mà không phải thiết kế lại.
>
> Hai thứ cần chuẩn bị **ngay từ bản đầu** để sau này thêm vào không phải sửa: thư mục `functions/` có sẵn trong cấu trúc (§5), và nút "Đặt lịch hẹn" trong modal tìm kiếm tạm trỏ tới `tel:` — đổi sang form là đổi một liên kết.

### Quyết định nền tảng: nhận _yêu cầu_, không xác nhận tức thì

Khách chọn **ngày và buổi mong muốn** (sáng/chiều), không phải khung giờ chính xác. Phòng khám gọi lại xác nhận.

Đây không phải phiên bản rút gọn của tính năng "thật" — nó là lựa chọn đúng, vì ba lý do:

1. **Đúng cách phòng khám vận hành thực tế** — thế nào cũng có cuộc gọi xác nhận, kể cả khi đã chốt giờ trên web.
2. **Ma sát thấp hơn nên nhiều người điền hơn** — bắt khách chọn khung giờ chính xác làm rơi một lượng lớn.
3. **Thời lượng điều trị chênh nhau quá xa** — khám 15 phút, implant 2 tiếng. Lưới khung giờ cố định sai về bản chất trừ khi khai thời lượng cho từng loại điều trị, việc này gấp 3–4 lần khối lượng.

Hệ quả kỹ thuật quan trọng: **không hiển thị lịch trống thật** ⇒ không có bài toán tranh chấp khi hai người đặt cùng lúc. Google Sheets không có transaction, không có ràng buộc trùng — và thiết kế này khiến giới hạn đó trở nên vô hại.

### Luồng dữ liệu

```
Trình duyệt  →  POST /api/booking  →  Cloudflare Pages Function
                                       ├─ kiểm Turnstile + honeypot + rate limit
                                       ├─ kiểm dữ liệu bằng Zod (dùng lại schema phía client)
                                       ├─ ghi 1 dòng vào Google Sheet
                                       ├─ tạo sự kiện Google Calendar (nháp, chờ xác nhận)
                                       └─ gửi email báo phòng khám
```

**Không bao giờ gọi Google API từ trình duyệt.** Khóa service account để lộ ra front-end thì bất kỳ ai cũng ghi được vào Sheet. Toàn bộ xác thực nằm trong Function.

### Trường dữ liệu — cố tình tối thiểu

| Trường                 | Bắt buộc                           |
| ---------------------- | ---------------------------------- |
| Họ tên                 | có                                 |
| Số điện thoại          | có                                 |
| Dịch vụ quan tâm       | có (chọn từ danh sách)             |
| Ngày mong muốn         | có                                 |
| Buổi                   | có (sáng / chiều)                  |
| Ghi chú ngắn           | không                              |
| Đồng ý xử lý thông tin | có, ô tick rõ ràng, không tick sẵn |

**Không hỏi triệu chứng. Không hỏi tiền sử bệnh. Không hỏi ngày sinh, địa chỉ, email.**

Lý do: dữ liệu đặt lịch là dữ liệu cá nhân và chạm tới lĩnh vực y tế, thuộc phạm vi **Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân**. Tên + số điện thoại + mô tả triệu chứng nằm trong một Google Sheet là dữ liệu nhạy cảm. Thu càng ít thì nghĩa vụ càng nhẹ và rủi ro càng thấp — những thông tin y tế cần thiết được hỏi qua điện thoại lúc xác nhận, không lưu trên web.

Kèm theo: Google Sheet **chỉ chia sẻ cho đúng người cần**, không đặt chế độ "ai có link cũng xem được".

### Chống lạm dụng

- **Cloudflare Turnstile** — miễn phí, chạy sẵn trên nền tảng đã chọn, không bắt khách giải câu đố
- **Honeypot** — trường ẩn, bot điền vào là loại
- **Rate limit** theo IP tại tầng Function
- Kiểm dữ liệu phía server, không tin gì từ client

### Khi lỗi — không được im lặng nuốt mất lịch hẹn

Nếu Google API hoặc mạng lỗi, form **phải** hiện thông báo rõ ràng kèm số điện thoại lấy từ `clinic.ts`:

> Không gửi được yêu cầu. Vui lòng gọi trực tiếp **0xxx xxx xxx**.

Lỗi được ghi log để xem bằng `wrangler tail`. Một lịch hẹn mất đi trong im lặng là một khách hàng mất đi mà không ai biết.

Ngoài ra, ghi Sheet là bước **quan trọng nhất**: nếu ghi Sheet thành công nhưng tạo Calendar hoặc gửi mail thất bại, vẫn báo thành công cho khách và ghi log riêng phần lỗi. Yêu cầu đã được lưu; thông báo hỏng là việc nội bộ.

### Vị trí trên site

- Trang `/dat-lich` (và `/en/book-appointment`) riêng
- Nút mở form ở header và cuối mỗi trang dịch vụ, có sẵn dịch vụ tương ứng
- Modal tìm kiếm có mục "Đặt lịch hẹn" trong nhóm Hành động nhanh

---

## 12. SEO & tối ưu cho trợ lý AI

### HTML ngữ nghĩa

Heading đúng cấp bậc, `<article>` / `<section>` / `<nav>` / `<address>` dùng đúng vai trò. Đây là nền cho cả SEO truyền thống lẫn khả năng được AI trích dẫn.

### JSON-LD

| Schema                      | Áp dụng                                         |
| --------------------------- | ----------------------------------------------- |
| `Dentist` + `LocalBusiness` | Toàn site — địa chỉ, giờ mở cửa, tọa độ Đà Nẵng |
| `MedicalProcedure`          | Từng trang dịch vụ                              |
| `FAQPage`                   | Khối câu hỏi trên trang dịch vụ                 |
| `Offer`                     | Bảng giá                                        |
| `BreadcrumbList`            | Mọi trang con                                   |
| `sameAs`                    | Trỏ tới Facebook + Google Business Profile      |

Tất cả sinh từ `clinic.ts` và frontmatter, không viết tay.

### Crawler AI

`robots.txt` mở cổng cho: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Claude-SearchBot`, `Google-Extended`.

**Đánh đổi được chấp nhận có ý thức:** AI trả lời thay site, khách không cần ghé. Nhưng với phòng khám, **được nhắc tên mới là thắng** — khách hỏi "nha khoa nào tốt ở Đà Nẵng", AI đọc ra tên và số điện thoại, họ gọi thẳng.

### Nội dung dạng trả lời trực tiếp

Heading là câu hỏi thật khách gõ; đoạn ngay dưới trả lời gọn trong 2–3 câu rồi mới diễn giải. Trợ lý AI trích được nguyên khối đó.

Điều này đòi nội dung phải nói thẳng vào **giá, thời gian, độ đau, bảo hành** — đúng những thứ site cũ đang né.

### Bộ từ khóa hai lớp

| Lớp                      | Ví dụ vi                                                  | Ví dụ en                                                   |
| ------------------------ | --------------------------------------------------------- | ---------------------------------------------------------- |
| Truyền thống (ngắn)      | `trồng răng implant Đà Nẵng`                              | `dentist Da Nang`                                          |
| Hội thoại / hỏi AI (dài) | `trồng răng implant ở Đà Nẵng giá bao nhiêu, mất bao lâu` | `is dental implant in Vietnam safe, how much does it cost` |

Lớp thứ hai quyết định việc có được AI nhắc tên hay không.

### `llms.txt` — ghi rõ là đặt cược

Sinh `llms.txt` + `llms-full.txt` (tóm tắt site dạng markdown cho LLM đọc).

**OpenAI, Anthropic và Google chưa xác nhận có dùng nó làm tín hiệu.** Tốn khoảng 30 phút nên vẫn làm, nhưng không được tính là hạng mục then chốt trong kế hoạch.

### Redirect từ URL Blogger cũ

Chủ dự án đã quyết định **không lập bảng ánh xạ như một hạng mục riêng**. Vì mọi trang đang tồn tại đều được port sang (§2), phần lớn URL cũ có đích đến rõ ràng và dòng 301 được viết ngay lúc dựng trang tương ứng — không phải ngồi lập bảng trước.

Hai loại dòng trong `public/_redirects`:

**Loại 1 — trang được port qua (phần lớn).** Viết cùng lúc với trang mới:

```
/2023/05/cay-ghep-implant.html   /dich-vu/cay-ghep-implant   301
```

Vì giữ hết trang, đây là loại chiếm gần như toàn bộ — và **thứ hạng cũ được chuyển sang trang mới đúng như mong muốn**.

**Loại 2 — URL hỏng và trang bị loại.** Một dòng bắt hết phần còn lại:

```
/*.html   /dich-vu   301
```

Với những URL này Google không chuyển thứ hạng (gom hết về một chỗ bị coi là chuyển hướng không liên quan), nhưng chúng vốn là trang hỏng nên không có thứ hạng để mất. Giá trị của dòng này là phần con người: khách bấm link cũ trên Facebook hoặc Zalo vẫn vào được site.

**Không có URL nào rơi vào 404.**

---

## 13. Trợ năng

- Mục tiêu **WCAG 2.2 AA**, cả chế độ sáng lẫn tối
- Skip link, focus nhìn thấy rõ, điều hướng bàn phím đầy đủ
- Vùng bấm tối thiểu 44px trên mobile
- `prefers-reduced-motion` tôn trọng toàn cục
- Modal tìm kiếm có yêu cầu trợ năng riêng (xem §10)

---

## 14. Ngưỡng chất lượng

Build **fail** nếu không đạt:

| Kiểm tra                         | Ngưỡng                                                       |
| -------------------------------- | ------------------------------------------------------------ |
| `astro check`                    | Sạch, không lỗi type                                         |
| Zod schema                       | Mọi file markdown hợp lệ (thiếu bản dịch / thiếu ảnh = fail) |
| Lighthouse mobile — Performance  | ≥ 90                                                         |
| Lighthouse — Accessibility       | 100                                                          |
| Lighthouse — SEO                 | 100                                                          |
| `axe`                            | Không có lỗi nghiêm trọng                                    |
| `npx impeccable detect --json .` | Sạch                                                         |

### Test tự động

- Mỗi dòng redirect trả về đúng **301** tới đúng đích
- Nút chuyển ngôn ngữ giữ đúng trang tương ứng (không đá về trang chủ)
- Tìm kiếm không dấu: gõ `cay ghep` phải ra `Cấy ghép Implant`
- JSON-LD hợp lệ theo schema.org
- Modal tìm kiếm: focus trap, Esc trả con trỏ về nút gốc
- Chuyển theme không gây lóe sáng
- Nút gọi / Zalo / chỉ đường trỏ đúng giá trị trong `clinic.ts` trên mọi trang, cả hai ngôn ngữ

Khi làm §11 ở v1.2, bổ sung: dữ liệu sai bị chặn phía server; ghi Sheet thành công nhưng Calendar/mail lỗi vẫn báo thành công cho khách; Google API lỗi hoàn toàn thì hiện số điện thoại thay vì im lặng; không có bí mật nào lọt ra bundle front-end (kiểm tự động trên `dist/`).

### Kiểm thủ công bắt buộc

**Trên điện thoại Android tầm trung, qua mạng 4G thật.** Không phải chỉ throttle trong DevTools. Đây là thiết bị khách thật sự dùng.

---

## 15. Giai đoạn thi công

| GĐ    | Việc                                                                                                                   | Kết quả cụ thể                                                                                 |
| ----- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **0** | ✅ **XONG 2026-08-03** — crawl qua Blogger feed API, không cần Tavily                                                  | `docs/superpowers/specs/2026-08-03-kiem-ke-site-cu.md`: 15 bài + 2 trang, bảng redirect đầy đủ |
| 1     | Nền tảng — Astro/Tailwind/TS, i18n routing, `clinic.ts`, Zod schema, wrangler, deploy preview                          | Site trắng nhưng deploy được, CI chạy                                                          |
| 2     | Ngôn ngữ thiết kế — `npx impeccable install` → `/impeccable init` → `/impeccable shape`                                | `PRODUCT.md` + `DESIGN.md`, bảng màu 2 chế độ, thang font tiếng Việt                           |
| 3     | Nội dung — viết lại vi sạch (bỏ emoji Facebook), dịch en + hiệu đính bản ngữ, bộ từ khóa 2 lớp, FAQ                    | Markdown đầy đủ, qua được Zod                                                                  |
| 4     | Xây — layout → header/footer → trang chủ → template dịch vụ → 4 trụ cột → bảng giá → liên hệ → blog                    | Site chạy đầy đủ trên preview                                                                  |
| 5     | Tìm kiếm + theme — Pagefind, chỉ mục không dấu, modal command palette, sáng/tối                                        | Hoàn chỉnh, có test trợ năng                                                                   |
| 6     | Lớp SEO + AI — JSON-LD, sitemap, hreflang, robots.txt, llms.txt, `_redirects`, đồng bộ NAP với Google Business Profile | Máy đọc được đúng                                                                              |
| 7     | Hoàn thiện — `impeccable harden` / `audit` / `critique` / `polish` + `detect`, Lighthouse, axe, test máy thật          | Qua hết ngưỡng §14                                                                             |
| 8     | Chuyển domain — kiểm redirect, đổi DNS, theo dõi                                                                       | **Live**                                                                                       |

**Phụ thuộc:** GĐ 0 phải xong trước GĐ 3. GĐ 1 và 2 chạy song song với GĐ 0 được — không phải chờ.

### Sau khi launch

| Đợt  | Việc                                                                                                                                 |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------ |
| v1.1 | **Khối bác sĩ** trên trang Giới thiệu — ưu tiên cao nhất vì ảnh hưởng trực tiếp mục tiêu uy tín (§17)                                |
| v1.2 | **Hệ thống đặt lịch** (§11) — Google Cloud project, service account, Sheet + Calendar, Function `/api/booking`, Turnstile, xử lý lỗi |

---

## 16. Rủi ro

| Rủi ro                                                     | Mức        | Xử lý                                                                                                            |
| ---------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| Bản tiếng Anh dịch máy làm mất uy tín                      | Cao        | Hiệu đính bản ngữ là hạng mục ngân sách riêng, không gộp vào việc dịch                                           |
| Chưa có ảnh chụp thật khi tới hạn                          | Cao        | Shot-list và tỷ lệ khung định sẵn từ GĐ 2; Zod chặn build nếu còn placeholder                                    |
| Tìm kiếm không xử lý được gõ không dấu → tính năng vô dụng | Cao        | Chỉ mục hai lớp; có test riêng từ GĐ 5                                                                           |
| Trang Giới thiệu không có bác sĩ làm giảm cảm giác tin cậy | Trung bình | **Hy sinh có ý thức** (§17) — đã xếp v1.1, đợt cập nhật đầu tiên sau launch                                      |
| Không có form ở bản đầu → mất khách ngại gọi điện          | Trung bình | Nút Zalo bù được phần lớn (nhắn tin, không phải gọi). Theo dõi sau launch; nếu rõ ràng thiếu thì đẩy §11 lên sớm |
| Mất thứ hạng của các URL hỏng bị loại                      | Thấp       | Vốn không có thứ hạng để mất; catch-all 301 chỉ để cứu link cũ trên Facebook/Zalo                                |
| Nội dung EN gấp đôi khối lượng, kéo dài dự án              | Trung bình | Phân tầng dịch vụ (§3) để làm theo đợt, không dàn đều                                                            |
| Chế độ tối làm ảnh lâm sàng sai lệch                       | Trung bình | Vùng ảnh lâm sàng giữ nền sáng ở cả hai chế độ (§8)                                                              |
| Animation gây giật trên máy yếu                            | Thấp       | Đã chọn mức nhẹ, 0 KB cho phần lớn hiệu ứng                                                                      |

---

## 17. Quyết định về ba câu từng để ngỏ

**1. Phạm vi nội dung — giữ hết trang đang tồn tại.**
Mọi trang cũ truy cập được đều được port sang. Chỉ bỏ những trang có URL hỏng/không hợp lệ. GĐ 0 vì vậy không còn nhiệm vụ "chốt phạm vi" mà chỉ còn hai việc: tải nội dung cũ về làm nguyên liệu viết lại, và lọc ra danh sách URL hỏng để loại.

**2. Hồ sơ bác sĩ — ĐÃ ĐẢO QUYẾT ĐỊNH, đưa vào bản launch.**
Quyết định ban đầu là "bỏ tạm". Sau đó đổi thành: **có, và phải chi tiết** — chứng chỉ, bằng cấp, thành tựu nêu rõ từng mục. Xem §8.1 để biết cấu trúc và ràng buộc.

GĐ 0 (đã chạy) xác nhận **site cũ không có bất kỳ thông tin bác sĩ nào**, nên toàn bộ phần này viết mới 100% và cần phòng khám cung cấp dữ liệu thật.

**3. Google Business Profile — không bỏ qua.**
Đồng bộ NAP với Google Business Profile nằm trong GĐ 6. Cần quyền truy cập GBP trước khi tới giai đoạn đó (§18-A).

---

## 18. Chuẩn bị trước khi implement

Đây là những thứ **chỉ phía phòng khám cung cấp được** — không code thay được, và thiếu thì giai đoạn tương ứng bị chặn.

### A. Quyền truy cập

| Cần                                                                  | Dùng để                                          | Chặn GĐ |
| -------------------------------------------------------------------- | ------------------------------------------------ | ------- |
| Tài khoản **Cloudflare**                                             | Tạo Pages project, deploy                        | 1       |
| Quyền quản trị **DNS** của `nhakhoavcare.com` (ở nhà đăng ký domain) | Trỏ domain sang site mới ở bước cuối             | 8       |
| Quyền vào **Blogger** hiện tại                                       | Lấy nội dung gốc; giữ site cũ chạy tới phút cuối | 0       |
| **Google Business Profile**                                          | Đồng bộ NAP, lấy link cho `sameAs`               | 6       |
| **Google Search Console**                                            | Theo dõi thứ hạng sau khi đổi domain             | 8       |
| Link **Facebook Page** chính thức                                    | `sameAs` trong JSON-LD, footer                   | 4       |
| Tài khoản **Tavily** (gói miễn phí)                                  | Crawl nội dung cũ                                | 0       |

Lưu ý bàn giao: mọi tài khoản nên đứng tên **phòng khám**, không phải tài khoản cá nhân của người thi công.

### B. Thông tin cho `clinic.ts` — cần trước GĐ 1

- Tên phòng khám **chính thức đầy đủ**, đúng như đăng ký
- Địa chỉ đầy đủ, **trùng từng ký tự** với Google Business Profile
- Số điện thoại chính, số Zalo, email
- Tọa độ Google Maps
- **Giờ làm việc từng ngày trong tuần** — chốt **một** phiên bản duy nhất

  ⚠️ Site cũ đang hiện giờ làm việc ở hai nơi với **số liệu khác nhau**. Phải xác định bản nào đúng trước khi bắt đầu, vì mọi nơi trên site mới đều đọc từ một nguồn.

- Số giấy phép hoạt động khám chữa bệnh (nhiều site y tế hiển thị ở footer, tăng độ tin cậy)

### C. Nội dung — cần trước GĐ 3

- **Bảng giá chính xác, đang áp dụng** cho từng dịch vụ (site cũ có trang giá nhưng cần xác nhận còn đúng)
- **Chính sách bảo hành** từng loại điều trị — đây là thứ khách hỏi AI nhiều nhất và site cũ đang né
- Thời gian điều trị trung bình từng dịch vụ
- Danh sách thiết bị, máy móc (site cũ có trang này, cần xác nhận còn đúng)
- Quy trình vô trùng (site cũ đã có, cần viết lại sạch)
- **Người hiệu đính tiếng Anh bản ngữ** — xác định ai làm và ngân sách, trước khi bắt đầu dịch

### C-bis. Hồ sơ bác sĩ — cần trước GĐ 4

Site cũ **không có gì** về bác sĩ, nên toàn bộ phần này cần phòng khám cung cấp. Với **mỗi** bác sĩ:

- Họ tên đầy đủ + chức danh chính xác
- Số năm kinh nghiệm
- **Bằng cấp**: tên bằng, trường, năm tốt nghiệp — ít nhất một mục
- **Chứng chỉ**: tên, **nơi cấp**, **năm cấp** — ít nhất một mục. Thiếu nơi cấp hoặc năm thì **build sẽ fail**
- Thành tựu: số ca đã thực hiện, giải thưởng, báo cáo hội nghị
- Chuyên môn (khớp danh sách dịch vụ)
- Hội nghề nghiệp, ngoại ngữ
- Chân dung 4:5

⚠️ Mọi chứng chỉ và thành tựu công bố phải **có thật và chứng minh được** — xem §8.1 và §18-F.

### D. Hình ảnh — cần trước GĐ 4

Theo shot-list §8, **bao gồm chân dung từng bác sĩ** (4:5).

Ảnh `case-before` / `case-after` phải chụp **cùng góc, cùng ánh sáng, cùng khoảng cách**. Ảnh trước/sau khác điều kiện chụp là hình thức phóng đại kết quả.

### E. Công cụ dev

| Công cụ    | Trạng thái                                                              |
| ---------- | ----------------------------------------------------------------------- |
| Node.js    | ✅ v24.16.0 đã có                                                       |
| Tavily CLI | ❌ `curl -fsSL https://cli.tavily.com/install.sh \| bash && tvly login` |
| Wrangler   | ❌ cài qua `npm i -D wrangler` ở GĐ 1                                   |
| Impeccable | ❌ `npx impeccable install` ở GĐ 2                                      |
| Git repo   | ❌ thư mục hiện chưa `git init`                                         |

### F. Cần kiểm tra về mặt pháp lý

Không phải tư vấn pháp lý, nhưng cần phía phòng khám xác nhận trước khi launch:

- Quảng cáo dịch vụ khám chữa bệnh tại Việt Nam thuộc phạm vi điều chỉnh của **Luật Quảng cáo** và cần **xác nhận nội dung quảng cáo từ cơ quan y tế có thẩm quyền**. Site mới có bảng giá chi tiết và ảnh trước/sau — nhiều hơn site cũ, nên nội dung cần được rà lại.
- **Ảnh trước/sau của bệnh nhân** cần có **văn bản đồng ý** của chính bệnh nhân đó.
- Nếu về sau làm §11, form thu dữ liệu cá nhân thuộc phạm vi **Nghị định 13/2023/NĐ-CP**.

### G. Việc còn phải chốt

- Bản nào của **giờ làm việc** là đúng (mục B)
- Ai **hiệu đính tiếng Anh** (mục C)
- Khi làm §11 ở v1.2: chọn **Resend hay MailChannels** để gửi mail
