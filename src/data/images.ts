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

  // Bốn cặp ảnh trước/sau. Mỗi cặp PHẢI chụp cùng góc, cùng ánh sáng, cùng
  // khoảng cách. Ảnh trước và sau khác điều kiện chụp là hình thức phóng đại
  // kết quả, và trên nội dung y tế đó là chuyện đạo đức chứ không phải thẩm mỹ.
  caseImplantBefore: {
    src: temp('vcare-case-implant-a', 800, 800),
    alt: 'Vùng răng mất trước khi cấy ghép Implant',
    ratio: '1/1',
    placeholder: true,
    brief: 'Implant, trước điều trị. Ghi lại thông số máy để chụp ảnh sau giống hệt.',
    clinical: true,
  },
  caseImplantAfter: {
    src: temp('vcare-case-implant-b', 800, 800),
    alt: 'Vùng răng sau khi cấy ghép Implant và gắn mão sứ',
    ratio: '1/1',
    placeholder: true,
    brief: 'Implant, sau điều trị. Cùng góc, cùng ánh sáng, cùng khoảng cách.',
    clinical: true,
  },

  caseVeneerBefore: {
    src: temp('vcare-case-veneer-a', 800, 800),
    alt: 'Răng cửa trước khi dán sứ Veneer',
    ratio: '1/1',
    placeholder: true,
    brief: 'Veneer, trước điều trị.',
    clinical: true,
  },
  caseVeneerAfter: {
    src: temp('vcare-case-veneer-b', 800, 800),
    alt: 'Răng cửa sau khi dán sứ Veneer',
    ratio: '1/1',
    placeholder: true,
    brief: 'Veneer, sau điều trị. Cùng điều kiện chụp với ảnh trước.',
    clinical: true,
  },

  caseBracesBefore: {
    src: temp('vcare-case-braces-a', 800, 800),
    alt: 'Hàm răng lệch trước khi niềng',
    ratio: '1/1',
    placeholder: true,
    brief: 'Chỉnh nha, trước điều trị.',
    clinical: true,
  },
  caseBracesAfter: {
    src: temp('vcare-case-braces-b', 800, 800),
    alt: 'Hàm răng sau khi hoàn tất chỉnh nha',
    ratio: '1/1',
    placeholder: true,
    brief: 'Chỉnh nha, sau điều trị. Cùng điều kiện chụp với ảnh trước.',
    clinical: true,
  },

  caseWhiteningBefore: {
    src: temp('vcare-case-white-a', 800, 800),
    alt: 'Màu răng trước khi tẩy trắng',
    ratio: '1/1',
    placeholder: true,
    brief: 'Tẩy trắng, trước điều trị. Ảnh màu răng phải chụp dưới cùng nguồn sáng.',
    clinical: true,
  },
  caseWhiteningAfter: {
    src: temp('vcare-case-white-b', 800, 800),
    alt: 'Màu răng sau khi tẩy trắng',
    ratio: '1/1',
    placeholder: true,
    brief: 'Tẩy trắng, sau điều trị. BẮT BUỘC cùng nguồn sáng với ảnh trước.',
    clinical: true,
  },
} as const satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;

/** Đếm số ảnh còn là ảnh tạm. Dùng để cảnh báo lúc build. */
export function placeholderCount(): number {
  return Object.values(images).filter((i) => i.placeholder).length;
}
