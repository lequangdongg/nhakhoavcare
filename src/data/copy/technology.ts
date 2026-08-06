/**
 * Nội dung trang Thiết bị và chẩn đoán hình ảnh, song ngữ.
 * Nguồn: kịch bản §2 chương 2 (chẩn đoán hình ảnh) và chương 4 (nha khoa số).
 *
 * ⚠️ CHỖ CÒN TRỐNG: câu trả lời chính cho nỗi sợ nhiễm tia cần tên cơ quan và
 * số hiệu kiểm định thiết bị X-quang (mục ⚠3 của kịch bản). Cho tới lúc có,
 * trang chỉ nói những gì kiểm chứng được — áo chì, phòng che chắn, nguyên tắc
 * chỉ định — và KHÔNG khẳng định chung chung kiểu "hoàn toàn an toàn".
 */

export interface ScanMode {
  name: string;
  question: string;
}

export interface TechCopy {
  lede: string;
  imagingTitle: string;
  imaging: string[];
  modesTitle: string;
  modesLede: string;
  modes: ScanMode[];
  onSite: string;
  radiationTitle: string;
  radiationLede: string;
  radiation: string[];
  radiationAsk: string;
  impactedTitle: string;
  impacted: string[];
  scanTitle: string;
  scanLede: string;
  benefitsTitle: string;
  benefits: Array<{ name: string; body: string }>;
  recordsTitle: string;
  records: string[];
  bracesLink: string;
}

export const TECH: Record<'vi' | 'en', TechCopy> = {
  vi: {
    lede: 'Không nhìn thấy thì không động vào. Phim và mô hình số là thứ quyết định kế hoạch điều trị, không phải phỏng đoán.',

    imagingTitle: 'Vì sao phải có phim',
    imaging: [
      'Xương hàm dày bao nhiêu, dây thần kinh nằm ở đâu, cái răng chưa mọc đang nằm ngang hay nằm dọc — không có phim thì tất cả đều là phỏng đoán.',
      'Khám bằng mắt chỉ thấy phần răng nhô lên khỏi lợi. Phần quyết định kế hoạch điều trị lại nằm dưới đó.',
    ],

    modesTitle: 'Một máy, ba việc',
    modesLede:
      'Phòng khám có máy CT ConeBeam đặt tại chỗ. Mỗi chế độ chụp trả lời một loại câu hỏi khác nhau.',
    modes: [
      {
        name: 'Phim thường',
        question: 'Có sâu răng không, chóp răng có viêm không, xương quanh răng còn bao nhiêu.',
      },
      {
        name: 'Phim chỉnh nha',
        question: 'Hai hàm tương quan với nhau thế nào, và cung hàm còn đủ chỗ cho các răng không.',
      },
      {
        name: 'Phim 3 chiều',
        question:
          'Ngay tại vị trí mất răng, xương còn cao bao nhiêu và đặc bao nhiêu. Đây là phim bắt buộc trước khi cấy Implant.',
      },
    ],
    onSite:
      'Chụp tại chỗ nghĩa là bạn không phải cầm giấy giới thiệu đi nơi khác rồi hẹn lại lần sau. Khám, chụp, đọc phim và tư vấn xong trong cùng một buổi.',

    radiationTitle: 'Chụp nhiều vậy có bị nhiễm tia không',
    radiationLede:
      'Đây là câu được hỏi nhiều nhất, và nó xứng đáng được trả lời bằng những thứ kiểm chứng được chứ không phải một lời trấn an.',
    radiation: [
      'Mỗi lần chụp, bạn được mặc áo chì che phần thân.',
      'Máy đặt trong phòng riêng có che chắn, không đặt giữa khu khám.',
      'Bác sĩ chỉ định chụp khi tấm phim đó thay đổi được kế hoạch điều trị — không chụp theo thói quen.',
    ],
    radiationAsk:
      'Nếu bạn còn băn khoăn, cứ hỏi thẳng trước khi đồng ý: tấm phim này trả lời câu hỏi gì, và nếu không chụp thì mình mất gì. Một câu trả lời rõ ràng là dấu hiệu tốt nhất.',

    impactedTitle: 'Phim thấy được thứ mắt không thấy',
    impacted: [
      'Răng ngầm là ví dụ rõ nhất. Một chiếc răng không mọc lên được, nằm ngang trong xương, có thể tì vào chân răng bên cạnh và làm tiêu chân răng đó trong nhiều năm mà bạn không đau, không biết.',
      'Chỉ có phim mới thấy. Xử lý là phẫu thuật lấy răng ngầm, và làm càng sớm thì càng ít tổn thất cho chiếc răng bên cạnh.',
    ],

    scanTitle: 'Không còn lấy dấu bằng vật liệu',
    scanLede:
      'Phòng khám dùng máy quét trong miệng iTero. Một đầu quét nhỏ đi qua các mặt răng và dựng ra mô hình ba chiều ngay trên màn hình — thay cho khay vật liệu đặt vào miệng, thứ gây buồn nôn, phải ngồi yên vài phút, và làm lại từ đầu nếu lệch.',

    benefitsTitle: 'Bạn nhận được gì',
    benefits: [
      {
        name: 'Ít thời gian hơn',
        body: 'Quét xong là có mô hình. Không chờ đổ mẫu, không hẹn lại vì dấu lỗi.',
      },
      {
        name: 'Ít chi phí hơn',
        body: 'Không vật liệu tiêu hao, và không phải làm lại một bước đã làm.',
      },
      {
        name: 'Thấy trước kết quả',
        body: 'Phần mềm dựng được hình răng sau điều trị và cho bạn xem trước khi bắt đầu — không phải nghe mô tả bằng lời.',
      },
      {
        name: 'Yên tâm hơn',
        body: 'Quyết định trên một hình ảnh cụ thể thì dễ hơn quyết định trên một lời hứa.',
      },
    ],

    recordsTitle: 'Dữ liệu được lưu lại',
    records: [
      'Mô hình số của bạn nằm trong hồ sơ. Lần sau tới, so được hàm hôm nay với hàm một năm trước — thấy răng đã dịch chuyển bao nhiêu, lợi đã tụt chưa, răng mòn thêm ở chỗ nào.',
      'Dữ liệu đó cũng là thứ dùng để đặt khay chỉnh nha trong suốt Invisalign.',
    ],
    bracesLink: 'Chi tiết về niềng răng chỉnh nha',
  },

  en: {
    lede: 'We do not treat what we cannot see. Radiographs and digital models decide the treatment plan — not guesswork.',

    imagingTitle: 'Why an image comes first',
    imaging: [
      'How thick the bone is, where the nerve runs, whether an unerupted tooth is lying sideways or upright — without an image, all of it is guesswork.',
      'A visual check only sees the part of a tooth above the gum. What decides the treatment plan sits below it.',
    ],

    modesTitle: 'One machine, three jobs',
    modesLede:
      'The clinic has a CBCT scanner on site. Each mode answers a different kind of question.',
    modes: [
      {
        name: 'Standard radiograph',
        question:
          'Is there decay, is the root apex inflamed, how much bone is left around the tooth.',
      },
      {
        name: 'Orthodontic radiograph',
        question:
          'How the two jaws relate to each other, and whether the arch has room for the teeth.',
      },
      {
        name: '3D scan',
        question:
          'At the exact site of a missing tooth, how tall and how dense the remaining bone is. This one is required before any implant.',
      },
    ],
    onSite:
      'On site means you are not sent elsewhere with a referral and asked to come back another day. Examination, imaging, reading and discussion all happen in the same visit.',

    radiationTitle: 'Is that much imaging safe',
    radiationLede:
      'It is the question we are asked most, and it deserves an answer made of things you can verify rather than a reassurance.',
    radiation: [
      'You wear a lead apron over the body for every exposure.',
      'The scanner sits in its own shielded room, not out in the treatment area.',
      'An image is ordered when it will change the treatment plan — not out of routine.',
    ],
    radiationAsk:
      'If you are still unsure, ask before you agree: what question does this image answer, and what do we lose by not taking it. A clear answer is the best sign you will get.',

    impactedTitle: 'An image sees what the eye cannot',
    impacted: [
      'An impacted tooth is the clearest example. A tooth that cannot erupt, lying sideways in the bone, can press on the root of its neighbour and dissolve it over years — with no pain and no warning.',
      'Only an image shows it. The treatment is surgical removal, and the earlier it is done the less damage the neighbouring tooth takes.',
    ],

    scanTitle: 'No more impression material',
    scanLede:
      'The clinic uses an iTero intraoral scanner. A small wand passes over the teeth and builds a three-dimensional model on screen — instead of a tray of impression material held in the mouth, which triggers gagging, requires several still minutes, and has to be redone if it slips.',

    benefitsTitle: 'What you get from it',
    benefits: [
      {
        name: 'Less time',
        body: 'The model exists the moment the scan ends. No waiting for a cast, no second appointment because an impression failed.',
      },
      {
        name: 'Less cost',
        body: 'No consumable material, and no paying twice for a step already done.',
      },
      {
        name: 'You see the result first',
        body: 'The software renders the teeth as they would look after treatment and shows you before anything starts — rather than describing it in words.',
      },
      {
        name: 'More confidence',
        body: 'Deciding from a concrete image is easier than deciding from a promise.',
      },
    ],

    recordsTitle: 'The data is kept',
    records: [
      'Your digital model stays in your record. Next visit, today’s scan can be compared against last year’s — how far teeth have moved, whether the gum has receded, where the enamel has worn.',
      'The same data is what an Invisalign clear aligner is manufactured from.',
    ],
    bracesLink: 'More about orthodontics',
  },
};
