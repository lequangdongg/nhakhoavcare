# Kiểm kê site cũ (GĐ 0)

**Ngày crawl:** 2026-08-03
**Nguồn:** Blogger feed API (`/feeds/posts/default?alt=json`, `/feeds/pages/default?alt=json`) — lấy được toàn bộ, không bị `robots.txt` chặn như `web_fetch`.

## Kết luận chính

**Toàn site có 15 bài đăng + 2 trang = 17 URL. Hết.**

Điều này bác bỏ giả định trong file tổng kết phiên trước rằng "còn bài cũ ẩn sau pagination chưa đếm được". Không có. Cũng vì vậy **không cần Tavily** — feed API của Blogger đã trả về đầy đủ.

## Bảng bài đăng

| #   | Tiêu đề                            | URL cũ                                                 | Nhãn                          | Số ký tự | Phân loại mới                              |
| --- | ---------------------------------- | ------------------------------------------------------ | ----------------------------- | -------- | ------------------------------------------ |
| 1   | Giới thiệu nha khoa                | `/2020/11/blog-post.html`                              | —                             | **26**   | Trang Giới thiệu — **rỗng, phải viết mới** |
| 2   | Quy trình vô trùng dụng cụ         | `/2020/04/quy-trinh-vo-trung-dung-cu.html`             | —                             | 2775     | Trang Giới thiệu (mục con)                 |
| 3   | Sâu răng và phòng ngừa             | `/2020/04/sau-rang-va-phong-ngua-sau-rang.html`        | Kiến thức nha khoa            | 3419     | Blog                                       |
| 4   | Lấy cao răng                       | `/2020/04/lay-cao-rang_16.html`                        | —                             | 1180     | Dịch vụ · `scaling`                        |
| 5   | Phẫu thuật cắt nướu – cười hở lợi  | `/2020/04/1cuoi-ho-loi-la-gi-cuoi-ho-loi-la-tinh.html` | DV thẩm mỹ                    | 2284     | Dịch vụ · `gummySmile`                     |
| 6   | Chữa tủy răng                      | `/2020/04/chua-tuy-rang.html`                          | —                             | 4675     | Dịch vụ · `rootCanal`                      |
| 7   | Các thiết bị nha khoa              | `/2020/04/cac-thiet-bi-nha-khoa.html`                  | —                             | 898      | Trang Giới thiệu (mục con)                 |
| 8   | Vai trò X-quang răng               | `/2020/04/vai-tro-x-quang-rang.html`                   | Kiến thức nha khoa            | 1515     | Blog                                       |
| 9   | Cấy ghép Implant                   | `/2020/03/cay-ghep-implant.html`                       | Implant                       | 1325     | Dịch vụ · `implant`                        |
| 10  | Cầu răng                           | `/2020/03/cau-rang.html`                               | Phục hình cố định             | 1523     | Dịch vụ · `bridge`                         |
| 11  | Mão răng                           | `/2020/03/phuc-hinh-co-inh.html`                       | DV thẩm mỹ, Phục hình cố định | 4954     | Dịch vụ · `crown`                          |
| 12  | Dán sứ Veneer                      | `/2020/03/dan-su-veneer.html`                          | DV thẩm mỹ, Phục hình cố định | 3646     | Dịch vụ · `veneer`                         |
| 13  | Bảng giá                           | `/2020/03/bang-gia.html`                               | —                             | 3734     | Trang Bảng giá                             |
| 14  | Hàm giả tháo lắp                   | `/2020/03/loai-truong-hop-su-dung-rang-gia-thao.html`  | Phục hình tháo lắp            | 3068     | Dịch vụ · `denture`                        |
| 15  | Vecni Flour phòng sâu răng cho trẻ | `/2020/03/vecni-flour.html`                            | DV trẻ em                     | 1503     | Dịch vụ · `fluoride`                       |

## Trang tĩnh

| Tiêu đề            | URL                          | Ghi chú                  |
| ------------------ | ---------------------------- | ------------------------ |
| Kiến thức nha khoa | `/p/kien-thuc-nha-khoa.html` | Trang danh mục blog      |
| _(không tiêu đề)_  | `/p/blog-page.html`          | **Trang hỏng — loại bỏ** |

## Phát hiện đáng chú ý

1. **Trang Giới thiệu chỉ có 26 ký tự.** Đây là trang quan trọng nhất cho mục tiêu uy tín mà thực tế đang rỗng. Không có gì để port — phải viết mới hoàn toàn ở Plan 2.

2. **Không có bài nào về bác sĩ / đội ngũ.** Xác nhận câu hỏi để ngỏ số 2 trong spec §17: site cũ không có thông tin bác sĩ. Quyết định "bỏ tạm" không làm mất gì đang có.

3. **Toàn bộ nội dung đăng năm 2020, không cập nhật từ đó.** Bảng giá 2020 gần như chắc chắn đã lỗi thời — cần phòng khám xác nhận lại (spec §18-C).

4. **Nội dung ngắn.** Bài dài nhất 4954 ký tự, phần lớn dưới 2000. Để cạnh tranh trên Google và được AI trích dẫn, các trang trụ cột cần dài và sâu hơn đáng kể — đây là công việc viết mới, không phải dọn dẹp.

5. **Hai dịch vụ ưu tiên KHÔNG có nội dung nào:** Tẩy trắng răng và Niềng răng/Chỉnh nha. Cả hai đều nằm trong nhóm ưu tiên đã chọn (spec §3) nhưng trên site cũ chỉ là menu chết. Phải viết mới 100%, cả vi lẫn en.

## Ánh xạ redirect (dùng ở Plan 4)

Vì đã có URL cũ chính xác, dòng 301 viết được ngay:

```
/2020/03/cay-ghep-implant.html                       /dich-vu/cay-ghep-implant/        301
/2020/03/dan-su-veneer.html                          /dich-vu/dan-su-veneer/           301
/2020/03/phuc-hinh-co-inh.html                       /dich-vu/boc-rang-su/             301
/2020/03/cau-rang.html                               /dich-vu/cau-rang/                301
/2020/03/loai-truong-hop-su-dung-rang-gia-thao.html  /dich-vu/phuc-hinh-thao-lap/      301
/2020/03/vecni-flour.html                            /dich-vu/vecni-flour-tre-em/      301
/2020/03/bang-gia.html                               /bang-gia/                        301
/2020/04/lay-cao-rang_16.html                        /dich-vu/lay-cao-rang/            301
/2020/04/chua-tuy-rang.html                          /dich-vu/chua-tuy-rang/           301
/2020/04/1cuoi-ho-loi-la-gi-cuoi-ho-loi-la-tinh.html /dich-vu/cuoi-ho-loi/             301
/2020/04/quy-trinh-vo-trung-dung-cu.html             /gioi-thieu/quy-trinh-vo-trung/   301
/2020/04/cac-thiet-bi-nha-khoa.html                  /gioi-thieu/thiet-bi/             301
/2020/04/sau-rang-va-phong-ngua-sau-rang.html        /kien-thuc-nha-khoa/sau-rang/     301
/2020/04/vai-tro-x-quang-rang.html                   /kien-thuc-nha-khoa/x-quang-rang/ 301
/2020/11/blog-post.html                              /gioi-thieu/                      301
/p/kien-thuc-nha-khoa.html                           /kien-thuc-nha-khoa/              301
/*.html                                              /dich-vu/                         301
```

Dòng cuối bắt `/p/blog-page.html` (trang hỏng) và mọi URL lạ.
