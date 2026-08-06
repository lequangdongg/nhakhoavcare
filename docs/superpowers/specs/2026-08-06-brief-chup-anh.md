# Brief chụp ảnh — một buổi

**Dùng cho:** thợ chụp thuê ngoài, chụp gọn trong một buổi tại phòng khám.
**Nguồn nội dung:** `2026-08-06-kich-ban-noi-dung-phong-kham.md` §3.
**Đích:** `src/data/images.ts` — mỗi tấm dưới đây ứng với một khoá trong file đó.

---

## Trước buổi chụp

- [ ] Chủ phòng khám đọc hết danh sách, đánh dấu tấm nào **không** chụp được
      (khu vực riêng tư, thiết bị đang bảo trì, nhân sự vắng)
- [ ] Thu **văn bản đồng ý sử dụng hình ảnh** của toàn bộ nhân sự có mặt trong
      khung hình — kể cả người chỉ đi ngang phía sau
- [ ] Không có bệnh nhân thật trong khung, trừ khi có văn bản đồng ý riêng
- [ ] Dọn bàn: tem nhãn có tên bệnh nhân, màn hình đang mở hồ sơ, giấy tờ — tất
      cả phải ra khỏi khung. Đây là lỗi hay gặp nhất và phát hiện ra sau buổi
      chụp thì đã muộn.

## Ràng buộc kỹ thuật chung

| | |
|---|---|
| Định dạng | RAW + JPEG chất lượng cao. Web cần bản gốc để tự nén |
| Cân bằng trắng | **Cố định một giá trị cho cả buổi**, không auto. Đèn nha khoa rất lạnh, auto sẽ nhảy giữa các tấm và bộ ảnh trông chắp vá |
| Độ sâu trường ảnh | Đủ sâu để thấy rõ chi tiết dụng cụ. Đây là ảnh làm bằng chứng, không phải ảnh nghệ thuật xoá phông |
| Hướng | Ghi rõ ở từng tấm. Tấm nào dùng làm nền có chữ đè lên thì phải **chừa khoảng trống** |

---

## Nhóm 1 — Vô trùng (7 tấm, ưu tiên cao nhất)

Đây là nhóm quan trọng nhất. Trang Vô trùng là chương mạnh nhất của cả site và
nó không đăng được nếu thiếu nhóm này.

| # | Tấm | Hướng | Yêu cầu |
|---|---|---|---|
| 1 | **Ngâm** — khay dụng cụ trong dung dịch | ngang | Thấy mặt dung dịch và dụng cụ ngập trong đó |
| 2 | **Rửa** — máy rửa dụng cụ chuyên dụng | ngang | Chụp lúc cửa máy mở, thấy giá đựng bên trong |
| 3 | **Rung** — bể rửa siêu âm | ngang | Thấy rõ đây là máy, không phải chậu nước |
| 4 | **Đóng gói** — máy hàn túi đang hàn | ngang | Bắt được khoảnh khắc túi đi qua thanh hàn |
| 5 | **Hấp** — nồi hấp, cửa mở, thấy túi bên trong | ngang | |
| 6 | **Cặp chỉ thị nhiệt** — hai túi cạnh nhau: một chưa hấp, một đã hấp | ngang, cận | Phải thấy rõ **chỉ thị đổi màu**. Một tấm thì không nói lên gì, hai tấm mới là bằng chứng |
| 7 | **Hộp vô trùng** đang đóng, và một tấm đang mở | ngang | Hai tấm cùng góc |

**Thêm, nếu còn thời gian:** một tấm ghế đã bọc màng, chụp sao cho **thấy rõ chỗ
nào được bọc** — tay cầm đèn, nút điều khiển, tay khoan.

## Nhóm 2 — Thiết bị (4 tấm)

| # | Tấm | Hướng | Yêu cầu |
|---|---|---|---|
| 8 | Máy CT ConeBeam, chụp cả phòng | ngang, rộng | Lấy được **vách che chắn** vào khung — đó là thứ trả lời nỗi sợ nhiễm tia |
| 9 | Áo chì treo sẵn cạnh máy | dọc | |
| 10 | Máy quét iTero đang quét | ngang | Không cần người thật, có thể quét trên mẫu hàm |
| 11 | Màn hình iTero đang dựng mô hình 3D | ngang | **Che hoặc xoá mọi thông tin bệnh nhân trên màn hình** |

## Nhóm 3 — Không gian (3 tấm)

| # | Tấm | Hướng | Yêu cầu |
|---|---|---|---|
| 12 | Phòng phẫu thuật tầng 2 | ngang, rộng | Chừa khoảng trống bên trái hoặc phải để đè chữ |
| 13 | Phòng tiền phẫu | ngang | |
| 14 | Góc check-in | dọc | Ghi chép trang 3 có nhắc set up góc này |

## Nhóm 4 — Chân dung 5 bác sĩ

**Ràng buộc quan trọng nhất của cả buổi chụp:** năm chân dung phải **cùng phông,
cùng hướng sáng, cùng khoảng cách, cùng chiều cao máy**. Chụp rời rạc mỗi người
một kiểu thì trang Giới thiệu trông như ghép từ năm nguồn khác nhau, và đó là
đúng cảm giác mình không muốn tạo ra trên một trang nói về chuyên môn.

- Dọc, tỷ lệ 3/4
- Ngang vai, mắt nhìn máy
- Cùng một phông — tường trơn hoặc một góc phòng khám, chọn một và giữ nguyên
- Áo blouse, không đeo khẩu trang
- Chụp liền một mạch, không tách ra nhiều thời điểm trong buổi

---

## Ảnh tạm trong lúc chờ

Toàn bộ khung ảnh dùng cơ chế đã có ở `src/data/images.ts`: `placeholder: true`
làm hiện nhãn **"ảnh tạm"** đè lên ảnh, và trường `brief` ghi cần chụp gì. Nhờ
vậy dựng đủ bộ khung được ngay mà không thể lỡ tay coi ảnh tạm là ảnh thật.

Hai chốt chặn đang có sẵn, không được gỡ:

1. Nhãn "ảnh tạm" hiện trên mọi khung có `placeholder: true`
2. `clinic.isDemoData` chặn build production

Chân dung bác sĩ cũng dùng ảnh tạm, lấy từ dịch vụ ảnh đại diện miễn phí
(`i.pravatar.cc`), ghép với hồ sơ mẫu theo đúng khuôn `bac-si-mau.md` đang có —
tên "BS. Nguyễn Văn A", và thân bài mở đầu bằng dòng "ĐÂY LÀ HỒ SƠ MẪU, TOÀN BỘ
SỐ LIỆU LÀ GIẢ".

Vì bộ này ghép một khuôn mặt với một cái tên và một số chứng chỉ hành nghề, hai
chốt chặn ở trên là thứ giữ cho nó không ra ngoài — **không gỡ, và không đặt
`isDemoData: false` trước khi thay hết cả bốn thứ: ảnh, tên, chứng chỉ, số giấy
phép.** Thay ảnh thật mà quên tên mẫu, hay ngược lại, đều ra một hồ sơ nửa thật
nửa giả, tệ hơn là để nguyên bộ giả.
