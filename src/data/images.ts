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

  // ── Quy trình vô trùng ───────────────────────────────────────────────────
  // Bảy ảnh cho trang /quy-trinh-vo-trung/. Xem brief chụp ảnh nhóm 1.
  // `brief` bên dưới chính là dòng hiện trên nhãn ảnh tạm, nên nó vừa là ghi
  // chú cho mình vừa là yêu cầu cho thợ chụp — viết một lần, dùng cả hai chỗ.
  sterileSoak: {
    src: temp('vcare-sterile-soak', 900, 600),
    alt: 'Khay dụng cụ đang ngâm dung dịch làm sạch',
    ratio: '3/2',
    placeholder: true,
    brief: 'Bước 1 Ngâm. Thấy mặt dung dịch và dụng cụ ngập trong đó.',
    clinical: false,
  },
  sterileWash: {
    src: temp('vcare-sterile-wash', 900, 600),
    alt: 'Máy rửa dụng cụ chuyên dụng',
    ratio: '3/2',
    placeholder: true,
    brief: 'Bước 2 Rửa. Chụp lúc cửa máy mở, thấy giá đựng bên trong.',
    clinical: false,
  },
  sterileUltrasonic: {
    src: temp('vcare-sterile-ultra', 900, 600),
    alt: 'Bể rửa siêu âm',
    ratio: '3/2',
    placeholder: true,
    brief: 'Bước 3 Rung. Phải thấy rõ đây là máy, không phải chậu nước.',
    clinical: false,
  },
  sterileSeal: {
    src: temp('vcare-sterile-seal', 900, 600),
    alt: 'Máy hàn túi đang hàn kín túi dụng cụ',
    ratio: '3/2',
    placeholder: true,
    brief: 'Bước 4a Đóng gói. Bắt khoảnh khắc túi đi qua thanh hàn.',
    clinical: false,
  },
  sterileAutoclave: {
    src: temp('vcare-sterile-autoclave', 900, 600),
    alt: 'Nồi hấp tiệt trùng, cửa mở, thấy túi dụng cụ bên trong',
    ratio: '3/2',
    placeholder: true,
    brief: 'Bước 4b Hấp. Cửa mở, thấy túi xếp bên trong.',
    clinical: false,
  },
  sterileIndicator: {
    src: temp('vcare-sterile-indicator', 900, 600),
    alt: 'Hai túi dụng cụ cạnh nhau, một chưa hấp và một đã hấp, chỉ thị nhiệt khác màu',
    ratio: '3/2',
    placeholder: true,
    brief:
      'CẶP chỉ thị nhiệt: một túi chưa hấp, một đã hấp, chụp chung khung. Một tấm riêng lẻ không chứng minh được gì.',
    clinical: false,
  },
  sterileBox: {
    src: temp('vcare-sterile-box', 900, 600),
    alt: 'Hộp giữ dụng cụ vô trùng sau khi hấp',
    ratio: '3/2',
    placeholder: true,
    brief: 'Hộp vô trùng đang đóng. Chụp thêm một tấm đang mở, cùng góc.',
    clinical: false,
  },

  // ── Thiết bị ─────────────────────────────────────────────────────────────
  ctScanner: {
    src: temp('vcare-ct', 1200, 800),
    alt: 'Máy chụp CT ConeBeam đặt trong phòng có che chắn',
    ratio: '3/2',
    placeholder: true,
    brief:
      'Máy CT ConeBeam, góc rộng. PHẢI lấy được vách che chắn vào khung — đó là thứ trả lời nỗi sợ nhiễm tia.',
    clinical: false,
  },
  leadApron: {
    src: temp('vcare-apron', 600, 800),
    alt: 'Áo chì treo sẵn cạnh phòng chụp',
    ratio: '3/4',
    placeholder: true,
    brief: 'Áo chì treo cạnh máy chụp. Ảnh dọc.',
    clinical: false,
  },
  iteroScan: {
    src: temp('vcare-itero', 900, 600),
    alt: 'Đầu quét iTero đang quét mẫu hàm',
    ratio: '3/2',
    placeholder: true,
    brief: 'Máy quét iTero đang quét. Quét trên mẫu hàm cũng được, không cần người thật.',
    clinical: false,
  },
  iteroScreen: {
    src: temp('vcare-itero-screen', 900, 600),
    alt: 'Màn hình iTero hiển thị mô hình răng ba chiều',
    ratio: '3/2',
    placeholder: true,
    brief: 'Màn hình đang dựng mô hình 3D. XOÁ HOẶC CHE mọi thông tin bệnh nhân trên màn hình.',
    clinical: false,
  },

  // ── Không gian ───────────────────────────────────────────────────────────
  surgeryRoom: {
    src: temp('vcare-surgery', 1200, 800),
    alt: 'Phòng phẫu thuật tại tầng hai',
    ratio: '3/2',
    placeholder: true,
    brief: 'Phòng phẫu thuật tầng 2, góc rộng. Chừa khoảng trống một bên để đè chữ lên.',
    clinical: false,
  },
  preOpRoom: {
    src: temp('vcare-preop', 900, 600),
    alt: 'Phòng tiền phẫu',
    ratio: '3/2',
    placeholder: true,
    brief: 'Phòng tiền phẫu tầng 2.',
    clinical: false,
  },
  checkinCorner: {
    src: temp('vcare-checkin', 600, 800),
    alt: 'Góc chụp ảnh cho khách tại phòng khám',
    ratio: '3/4',
    placeholder: true,
    brief: 'Góc check-in. Ảnh dọc.',
    clinical: false,
  },

  // ── Chân dung bác sĩ ─────────────────────────────────────────────────────
  // Ảnh tạm lấy từ dịch vụ ảnh đại diện miễn phí, tham số img cố định nên mỗi
  // lần build ra đúng khuôn mặt đó.
  //
  // ⚠️ Bộ này ghép một khuôn mặt với một cái tên và một số chứng chỉ hành nghề.
  // Nhãn "ảnh tạm" và cờ clinic.isDemoData là hai thứ giữ cho nó không ra ngoài.
  // Chỉ đặt isDemoData: false khi đã thay đủ CẢ BỐN: ảnh, tên, chứng chỉ, số
  // giấy phép. Thay ảnh thật mà quên tên mẫu thì ra hồ sơ nửa thật nửa giả.
  doctorA: {
    src: 'https://i.pravatar.cc/600?img=12',
    alt: 'Chân dung bác sĩ',
    ratio: '3/4',
    placeholder: true,
    brief: 'Chân dung BS 1. Cùng phông, cùng hướng sáng, cùng khoảng cách với bốn ảnh còn lại.',
    clinical: false,
  },
  doctorB: {
    src: 'https://i.pravatar.cc/600?img=45',
    alt: 'Chân dung bác sĩ',
    ratio: '3/4',
    placeholder: true,
    brief: 'Chân dung BS 2. Cùng điều kiện chụp với bốn ảnh còn lại.',
    clinical: false,
  },
  doctorC: {
    src: 'https://i.pravatar.cc/600?img=33',
    alt: 'Chân dung bác sĩ',
    ratio: '3/4',
    placeholder: true,
    brief: 'Chân dung BS 3. Cùng điều kiện chụp với bốn ảnh còn lại.',
    clinical: false,
  },
  doctorD: {
    src: 'https://i.pravatar.cc/600?img=26',
    alt: 'Chân dung bác sĩ',
    ratio: '3/4',
    placeholder: true,
    brief: 'Chân dung BS 4. Cùng điều kiện chụp với bốn ảnh còn lại.',
    clinical: false,
  },
  doctorE: {
    src: 'https://i.pravatar.cc/600?img=51',
    alt: 'Chân dung bác sĩ',
    ratio: '3/4',
    placeholder: true,
    brief: 'Chân dung BS 5. Cùng điều kiện chụp với bốn ảnh còn lại.',
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
