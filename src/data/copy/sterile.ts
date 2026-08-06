import type { ImageKey } from '../images';

/**
 * Nội dung trang Quy trình vô trùng, song ngữ.
 *
 * Vì sao ở đây chứ không ở i18n/ui.ts: ui.ts là các chuỗi giao diện ngắn, và
 * test ui.test.ts đếm số khoá hai ngôn ngữ. Nhét mấy trăm chữ văn xuôi vào đó
 * làm file phình lên và trộn hai loại nội dung khác hẳn nhau. Ở đây kiểu dữ
 * liệu ép hai ngôn ngữ cùng hình dạng, nên vẫn không lệch được.
 *
 * Vì sao không phải markdown: trang này là ảnh + sơ đồ + bảng, không phải văn
 * xuôi. Ép vào markdown thì phải nhúng HTML, còn khó sửa hơn.
 *
 * Nguồn: docs/superpowers/specs/2026-08-06-kich-ban-noi-dung-phong-kham.md §2 ch.1
 */

export interface SterileStep {
  name: string;
  body: string;
  image: ImageKey;
}

export interface SterileCopy {
  lede: string;
  /** ⚠ Câu mở phụ thuộc mục ⚠7 của kịch bản — "vô trùng ≠ sạch" hay "≠ tiệt trùng". */
  openingTitle: string;
  opening: string[];
  routesTitle: string;
  routes: string[];
  instrumentsTitle: string;
  instrumentsLede: string;
  steps: SterileStep[];
  stepWarning: string;
  boxTitle: string;
  box: string[];
  uv: string;
  surfacesTitle: string;
  surfaces: string[];
  closingTitle: string;
  closing: string[];
  surgeryTitle: string;
  surgery: string[];
  surgeryLink: string;
}

export const STERILE: Record<'vi' | 'en', SterileCopy> = {
  vi: {
    lede: 'Vô trùng không nhìn ra bằng mắt thường. Vì không nhìn ra được, chúng tôi viết nó ra đây.',

    openingTitle: 'Vô trùng không phải là sạch',
    opening: [
      'Một cái ghế lau bóng vẫn có thể mang mầm bệnh từ người ngồi trước. Sạch là thứ nhìn thấy được. Vô trùng là thứ phải làm đúng quy trình mới có, và không nhìn ra bằng mắt thường.',
      'Vì không nhìn ra được, người bệnh chỉ còn cách tin. Trang này tồn tại để bạn không phải chỉ tin — mà kiểm tra được.',
    ],

    routesTitle: 'Ba đường lây phải chặn',
    routes: [
      'Bàn tay — của bác sĩ và của phụ tá.',
      'Ghế và bề mặt — những chỗ được chạm vào nhiều lần trong một ca.',
      'Dụng cụ — thứ đi thẳng vào miệng bạn.',
    ],

    instrumentsTitle: 'Dụng cụ: bốn bước, không bỏ bước nào',
    instrumentsLede:
      'Nguyên tắc đầu tiên: cái gì tháo rời được thì tháo rời. Mũi khoan, tay khoan, đầu hút — tách hết ra. Khe kẽ không tháo được là khe kẽ không làm sạch được.',

    steps: [
      {
        name: 'Ngâm',
        body: 'Ngâm dung dịch ngay khi dụng cụ rời khỏi miệng bệnh nhân, trước khi máu và nước bọt kịp khô lại. Chất bẩn đã khô thì bước sau khó gỡ hơn nhiều.',
        image: 'sterileSoak',
      },
      {
        name: 'Rửa',
        body: 'Bằng máy rửa dụng cụ chuyên dụng, không rửa tay. Rửa tay vừa không đều vừa làm người rửa tiếp xúc với vật sắc nhọn đã nhiễm khuẩn.',
        image: 'sterileWash',
      },
      {
        name: 'Rung',
        body: 'Bể rửa siêu âm. Sóng siêu âm đánh bật thứ nằm trong khe kẽ và trong lòng ống mà không bàn chải nào với tới được.',
        image: 'sterileUltrasonic',
      },
      {
        name: 'Đóng gói và hấp',
        body: 'Dụng cụ vào túi hàn kín rồi mới đưa vào nồi hấp tiệt trùng. Hấp xong túi vẫn kín cho tới lúc mở trước mặt bệnh nhân.',
        image: 'sterileAutoclave',
      },
    ],

    stepWarning:
      'Bước cuối là bước hay bị làm tắt nhất. Hấp rồi để dụng cụ nằm trần trong khay thì nó vô trùng đúng lúc lấy ra khỏi nồi, và hết vô trùng ngay sau đó.',

    boxTitle: 'Sau khi hấp: hộp vô trùng',
    box: [
      'Dụng cụ đã hấp được giữ trong hộp vô trùng, không để trần trên khay hở. Túi và hộp chỉ mở ra ngay trước mặt bạn, lúc bắt đầu điều trị.',
      'Đây cũng là chỗ bạn tự kiểm tra được: túi dụng cụ có được bóc trước mặt bạn không. Nếu dụng cụ đã nằm sẵn trên khay lúc bạn ngồi xuống, không ai còn biết nó đã ở đó bao lâu.',
    ],

    uv: 'Ngoài ra có tủ tia cực tím cỡ lớn, đủ chỗ cho những dụng cụ và khay lớn không vào vừa nồi hấp thường.',

    surfacesTitle: 'Ghế và bề mặt',
    surfaces: [
      'Sau mỗi bệnh nhân, ghế và mặt bàn được làm sạch theo quy trình cố định — không phải lau qua.',
      'Những vị trí bác sĩ chạm vào nhiều lần trong một ca — tay cầm đèn, nút điều khiển ghế, tay khoan — được bọc màng dùng một lần. Hết ca, bóc bỏ, bọc mới.',
    ],

    closingTitle: 'Mọi vị trí bác sĩ chạm vào trong lúc điều trị đều là vị trí vô trùng',
    closing: [
      'Đó là cách kiểm tra một phòng nha nhanh nhất, và bạn làm được ngay khi đang ngồi trên ghế: nhìn xem tay bác sĩ vừa chạm vào đâu, và chỗ đó có được bọc hoặc đã tiệt trùng hay không.',
    ],

    surgeryTitle: 'Phòng phẫu thuật riêng ở tầng 2',
    surgery: [
      'Ca phẫu thuật không làm trên ghế khám thường. Tầng 2 có phòng tiền phẫu và phòng phẫu thuật riêng, giữ ở điều kiện vô trùng cao hơn khu khám.',
      'Lý do không phải hình thức: vết thương trong môi trường vô trùng thì lành nhanh hơn và ít biến chứng hơn. Với cấy ghép Implant, đó là khác biệt giữa một trụ tích hợp tốt và một trụ phải tháo ra làm lại.',
    ],
    surgeryLink: 'Chi tiết về cấy ghép Implant',
  },

  en: {
    lede: 'Sterile is not something you can see. Because you cannot see it, we have written it down.',

    openingTitle: 'Sterile is not the same as clean',
    opening: [
      'A polished chair can still carry infection from whoever sat in it before. Clean is what you can see. Sterile is what only a correct procedure produces, and it is invisible to the eye.',
      'Because you cannot see it, patients are usually left to take it on trust. This page exists so that you do not have to — so that you can check.',
    ],

    routesTitle: 'Three routes that have to be closed',
    routes: [
      'Hands — the dentist’s and the assistant’s.',
      'The chair and surfaces — everything touched repeatedly during a single appointment.',
      'Instruments — what goes directly into your mouth.',
    ],

    instrumentsTitle: 'Instruments: four steps, none skipped',
    instrumentsLede:
      'First principle: anything that comes apart, comes apart. Burs, handpieces, suction tips — all separated. A crevice you cannot open is a crevice you cannot clean.',

    steps: [
      {
        name: 'Soak',
        body: 'Instruments go into solution the moment they leave the mouth, before blood and saliva have a chance to dry. Dried debris is far harder to remove at every later step.',
        image: 'sterileSoak',
      },
      {
        name: 'Wash',
        body: 'In a dedicated instrument washer, not by hand. Hand washing is uneven, and it puts the person washing in contact with contaminated sharps.',
        image: 'sterileWash',
      },
      {
        name: 'Ultrasonic',
        body: 'An ultrasonic bath. The waves lift out what sits in crevices and inside lumens, where no brush reaches.',
        image: 'sterileUltrasonic',
      },
      {
        name: 'Pouch and autoclave',
        body: 'Instruments are sealed in a pouch before they enter the autoclave. Afterwards the pouch stays sealed until it is opened in front of the patient.',
        image: 'sterileAutoclave',
      },
    ],

    stepWarning:
      'The last step is the one most often cut short. Autoclave an instrument and then leave it uncovered on a tray and it is sterile at the moment it leaves the chamber — and not afterwards.',

    boxTitle: 'After the autoclave: the sterile box',
    box: [
      'Sterilised instruments are kept in a sterile box, not left out on an open tray. Pouch and box are opened in front of you, at the start of treatment.',
      'This is also where you can check for yourself: is the pouch opened in front of you. If instruments are already laid out on the tray when you sit down, nobody can say how long they have been there.',
    ],

    uv: 'There is also a large UV cabinet, with room for the bigger instruments and trays that do not fit a standard autoclave.',

    surfacesTitle: 'Chair and surfaces',
    surfaces: [
      'After every patient, the chair and worktop are cleaned to a fixed procedure — not simply wiped over.',
      'The points a dentist touches repeatedly during an appointment — light handle, chair controls, handpiece — are covered with single-use barrier film. At the end of the appointment it is stripped off and replaced.',
    ],

    closingTitle: 'Every point the dentist touches during treatment is a sterile point',
    closing: [
      'That is the fastest way to assess any dental practice, and you can do it from the chair: watch where the dentist’s hand has just been, and see whether that point is covered or sterilised.',
    ],

    surgeryTitle: 'A separate surgical suite on the first floor',
    surgery: [
      'Surgical cases are not done in an ordinary treatment chair. The floor above has a pre-operative room and a separate operating room, held to a higher standard than the treatment area.',
      'The reason is not appearance: a wound in a sterile environment heals faster and with fewer complications. For an implant, that is the difference between one that integrates and one that has to come out and be redone.',
    ],
    surgeryLink: 'More about dental implants',
  },
};
