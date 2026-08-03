/**
 * MỘT NƠI DUY NHẤT khai mọi ảnh của site.
 *
 * Cách thay ảnh thật:
 *   1. Bỏ file ảnh vào thư mục public/images/
 *   2. Sửa `src` ở đây thành '/images/ten-file.jpg'
 *   3. Đổi `placeholder` thành false
 *   4. Viết `alt` mô tả đúng nội dung ảnh
 *
 * Không phải sửa component nào cả.
 *
 * ⚠️ Ảnh đang dùng là ẢNH TẠM lấy từ picsum.photos, KHÔNG phải ảnh nha khoa và
 * KHÔNG phải ảnh của phòng khám. Chúng tồn tại để đánh giá bố cục khi chưa có
 * ảnh thật. Mọi khung có `placeholder: true` đều hiện nhãn "ảnh tạm" chồng lên,
 * nên không thể lỡ tay đưa lên production mà tưởng là ảnh thật.
 */

export interface SiteImage {
  src: string;
  alt: string;
  /** Tỷ lệ khung, dùng cho aspect-ratio và để giữ chỗ tránh giật layout */
  ratio: string;
  /** Ảnh tạm hay ảnh thật. Ảnh tạm sẽ hiện nhãn cảnh báo. */
  placeholder: boolean;
  /** Mô tả cảnh cần chụp, hiện trên nhãn để người chụp biết cần gì */
  brief: string;
  /** Ảnh lâm sàng giữ nền sáng ở cả chế độ tối. Xem spec §8. */
  clinical?: boolean;
}

/** Ảnh tạm ổn định theo hạt giống, nên mỗi lần build vẫn ra đúng ảnh đó. */
const temp = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const images = {
  hero: {
    src: temp('vcare-clinic-room', 1200, 800),
    alt: 'Không gian phòng khám Nha Khoa Vcare',
    ratio: '3/2',
    placeholder: true,
    brief: 'Không gian phòng khám, ánh sáng tự nhiên, có bác sĩ đang làm việc trong khung hình',
    clinical: false,
  },

  facade: {
    src: temp('vcare-facade', 1200, 800),
    alt: 'Mặt tiền phòng khám tại 190 Kinh Dương Vương',
    ratio: '3/2',
    placeholder: true,
    brief: 'Mặt tiền phòng khám, chụp ban ngày, thấy rõ biển hiệu và số nhà',
    clinical: false,
  },

  facilityChair: {
    src: temp('vcare-chair', 900, 600),
    alt: 'Ghế điều trị',
    ratio: '3/2',
    placeholder: true,
    brief: 'Ghế nha khoa, góc rộng, thấy được thiết bị xung quanh',
    clinical: false,
  },
  facilitySterile: {
    src: temp('vcare-sterile', 900, 600),
    alt: 'Khu vực tiệt trùng dụng cụ',
    ratio: '3/2',
    placeholder: true,
    brief: 'Khu tiệt trùng, thấy máy hấp và khay dụng cụ đã đóng gói',
    clinical: false,
  },
  facilityWaiting: {
    src: temp('vcare-waiting', 900, 600),
    alt: 'Khu chờ',
    ratio: '3/2',
    placeholder: true,
    brief: 'Khu chờ, ánh sáng tự nhiên, gọn gàng',
    clinical: false,
  },

  caseBefore: {
    src: temp('vcare-case-before', 800, 800),
    alt: 'Tình trạng răng trước điều trị',
    ratio: '1/1',
    placeholder: true,
    brief: 'Trước điều trị. Ghi lại thông số máy ảnh để chụp ảnh sau giống hệt.',
    clinical: true,
  },
  caseAfter: {
    src: temp('vcare-case-after', 800, 800),
    alt: 'Kết quả sau điều trị',
    ratio: '1/1',
    placeholder: true,
    brief: 'Sau điều trị. Cùng góc, cùng ánh sáng, cùng khoảng cách.',
    clinical: true,
  },
} as const satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;

/** Đếm số ảnh còn là ảnh tạm. Dùng để cảnh báo lúc build. */
export function placeholderCount(): number {
  return Object.values(images).filter((i) => i.placeholder).length;
}
