# Nha Khoa Vcare — website

Astro 7 · Tailwind 4 · TypeScript · Cloudflare Pages

Quản lý gói bằng **pnpm**. Format bằng Prettier (có plugin Astro và sắp lớp Tailwind), lint bằng Biome.
Biome tắt phần format để không đánh nhau với Prettier, vì Biome chưa format được file `.astro`.

## Lệnh

| Lệnh                  | Việc                                                         |
| --------------------- | ------------------------------------------------------------ |
| `npm run dev`         | Chạy dev server tại `localhost:4321`                         |
| `npm test`            | Chạy unit test                                               |
| `npm run verify`      | Kiểm type + test + build (chạy trước mọi commit lớn)         |
| `pnpm deploy:preview` | Deploy bản xem trước                                         |
| `npm run deploy`      | Deploy production — **fail nếu `clinic.ts` còn dữ liệu giả** |

## Sửa nội dung

| Muốn đổi                       | Sửa file                                                                |
| ------------------------------ | ----------------------------------------------------------------------- |
| SĐT, địa chỉ, giờ làm việc     | `src/data/clinic.ts` — **nguồn duy nhất**, đổi ở đây là đổi cả site     |
| Chữ trên giao diện (menu, nút) | `src/i18n/ui.ts`                                                        |
| Đường dẫn URL                  | `src/i18n/routes.ts` — **nguồn duy nhất**, đừng viết URL tay ở nơi khác |
| Nội dung trang dịch vụ         | `src/content/services/{vi,en}/*.md`                                     |
| Màu sắc                        | `src/styles/global.css`                                                 |

## Trước khi launch

`pnpm deploy` **fail** nếu `src/data/clinic.ts` còn giá trị `CHUA_CO`.
Đây là chủ ý — xem spec §18-B để biết cần điền những gì.

`pnpm verify` và `pnpm deploy:preview` có cờ `ALLOW_PLACEHOLDER_CLINIC=1` để
vẫn làm việc được khi chưa có dữ liệu. Khi đã điền dữ liệu thật, **xoá cờ khỏi cả hai**.

## Kiến trúc

- Xuất HTML tĩnh, **0 KB JavaScript** trừ đoạn script chống lóe sáng khi đổi theme
- Logic thuần nằm trong `.ts` có unit test; file `.astro` chỉ lắp ráp
- Slug URL dịch riêng theo ngôn ngữ (`/dich-vu/...` ↔ `/en/services/...`), quản lý tập trung ở `routes.ts`
- Vùng ảnh lâm sàng giữ nền sáng ở cả chế độ tối — xem ghi chú trong `global.css`

## Tài liệu

- Thiết kế: `docs/superpowers/specs/2026-08-03-nhakhoavcare-rebuild-design.md`
- Kế hoạch: `docs/superpowers/plans/`
