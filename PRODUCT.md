# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Chính:** người dân Đà Nẵng và vùng lân cận đang cân nhắc một can thiệp nha khoa có giá trị lớn — chủ yếu cấy ghép Implant, kế đến là bọc răng sứ, dán sứ Veneer, chỉnh nha. Họ tra cứu trên **điện thoại, qua mạng 4G**, thường vào buổi tối. Trước khi gọi điện, họ đã đọc vài phòng khám và đang tìm lý do để loại bớt.

Câu hỏi thật họ mang theo: *giá bao nhiêu, mất bao lâu, có đau không, bảo hành thế nào, ai là người làm.*

**Phụ:** người nước ngoài sinh sống tại Đà Nẵng và khách du lịch nha khoa. Nhóm này đọc tiếng Anh, so sánh giá với nước họ, và đánh giá độ tin cậy khắt khe hơn vì không có mạng lưới quen biết để hỏi.

## Product Purpose

Website của một phòng khám nha khoa tại Đà Nẵng. Mục đích: khiến người đang cân nhắc **tin đủ để nhấc máy gọi**.

Thành công đo bằng lượt gọi điện và nhắn Zalo, không phải lượt xem trang.

Tiêu chí quyết định thành bại do chủ dự án đặt ra: **site phải trông chuyên nghiệp và tạo được cảm giác uy tín.** Mọi đánh đổi giải quyết theo hướng đó — kể cả khi phải bỏ thứ ấn tượng về kỹ thuật.

## Positioning

**Chuyên sâu cấy ghép Implant.**

Đây là mảng có giá trị đơn hàng cao nhất, khách nghiên cứu kỹ nhất trước khi quyết, và cũng là mảng khách nước ngoài tìm nhiều nhất. Chiều sâu chuyên môn ở Implant là thứ một phòng khám tổng quát không thể tuyên bố thật về mình.

Hệ quả cho nội dung: trang Implant phải sâu hơn hẳn mọi trang khác — quy trình từng bước, loại trụ dùng, chỉ định và chống chỉ định, thời gian tích hợp xương, chi phí chi tiết, chính sách bảo hành, hồ sơ bác sĩ phụ trách. Các dịch vụ khác được làm đầy đủ nhưng không cạnh tranh sự chú ý với mảng này.

## Operating Context

- Nền tảng cũ là **Blogger**, đang chạy tại `nhakhoavcare.com`. Toàn bộ nội dung đăng năm **2020** và không cập nhật từ đó.
- Kiểm kê ngày 2026-08-03: **15 bài + 2 trang**, không có bài nào ẩn sau phân trang. Chi tiết: `docs/superpowers/specs/2026-08-03-kiem-ke-site-cu.md`
- Người vận hành sau bàn giao: **chủ dự án tự sửa file markdown trong repo**, không có CMS, không có nhân viên đăng bài.
- Kênh liên hệ thực tế của khách Việt: **gọi điện và Zalo**. Email gần như không dùng.

## Capabilities and Constraints

- Site tĩnh dựng sẵn (SSG), song ngữ **tiếng Việt + tiếng Anh, nội dung ngang nhau 100%**
- Slug URL dịch riêng theo từng ngôn ngữ; tiếng Việt ở gốc, tiếng Anh ở `/en/`
- **Mobile-first**, bắt đầu từ 375px
- Chế độ sáng / tối / theo hệ thống
- Tìm kiếm toàn site, **bắt buộc hoạt động khi khách gõ không dấu** (`cay ghep implant`)
- Bản đầu **không có form** — chỉ nút gọi, Zalo, chỉ đường. Hệ thống nhận yêu cầu đặt lịch đã thiết kế xong nhưng hoãn sang sau launch.
- Chưa quyết: bảng giá 2020 còn đúng hay không; số lượng bác sĩ

## Brand Commitments

- Tên: **Nha Khoa Vcare**
- **Anti-reference: chính site cũ.** Emoji dán từ Facebook, định dạng lộn xộn, menu chết, icon quản trị lộ ra trang công khai — không được lặp lại bất kỳ đặc điểm nào trong số đó.

## Evidence on Hand

Ba loại bằng chứng thật, đã được xác nhận là **có tồn tại** nhưng **giá trị cụ thể chưa được cung cấp**:

1. **Đánh giá Google thật** trên Google Business Profile — trích dẫn nguyên văn kèm tên người đánh giá.
2. **Ảnh ca điều trị trước/sau** — chụp được. Bắt buộc cùng góc, cùng ánh sáng, cùng khoảng cách; cần **văn bản đồng ý của bệnh nhân**.
3. **Số liệu thực tế** — số năm hoạt động, số ca đã điều trị. Phải kiểm chứng được.

**Chưa có và KHÔNG ĐƯỢC bịa:**

- Nội dung cụ thể của bất kỳ đánh giá nào, cho tới khi được cung cấp
- Con số thật nào về số ca, số năm, số bệnh nhân
- Giải thưởng, chứng nhận, xếp hạng
- **Hồ sơ bác sĩ** — site cũ không có bất kỳ thông tin nào về bác sĩ. Toàn bộ tên, bằng cấp, chứng chỉ phải do phòng khám cung cấp.
- Ảnh thật của phòng khám — chưa chụp; thiết kế dùng khung giữ chỗ định sẵn tỷ lệ.

Dữ liệu phòng khám (số điện thoại, địa chỉ, giờ làm việc) hiện là giá trị giữ chỗ `CHUA_CO` trong `src/data/clinic.ts`; build production bị chặn cho tới khi thay bằng dữ liệu thật.

⚠️ Site cũ hiện **giờ làm việc ở hai nơi với số liệu khác nhau**. Cần phòng khám xác nhận bản nào đúng.

## Product Principles

1. **Trả lời thẳng câu hỏi khách thật sự có.** Giá, thời gian, độ đau, bảo hành. Site cũ né những điều này; đó là lý do nó không thuyết phục được ai.
2. **Không tuyên bố thứ không chứng minh được.** Với nội dung y tế, một con số bịa gây hại nhiều hơn cả một trang trống.
3. **Nhanh trên điện thoại yếu là điều kiện của uy tín**, không phải hạng mục kỹ thuật riêng. Site giật khi cuộn phá niềm tin nhanh hơn bất kỳ thiết kế xấu nào.
4. **Implant dẫn dắt.** Mọi trang khác hỗ trợ, không tranh giành sự chú ý.
5. **Trung thực khi trình bày kết quả điều trị.** Ảnh trước/sau phải chụp cùng điều kiện; vùng ảnh lâm sàng giữ nền sáng ở cả hai chế độ màu để không làm răng trông trắng hơn thực tế.

## Accessibility & Inclusion

- Mục tiêu **WCAG 2.2 AA**, ở cả chế độ sáng lẫn tối
- Vùng bấm tối thiểu 44px — người dùng chính tra cứu trên điện thoại
- `prefers-reduced-motion` tôn trọng toàn cục
- Song ngữ đầy đủ; bản tiếng Anh **không được dịch máy** (nội dung y tế thuộc nhóm YMYL)
