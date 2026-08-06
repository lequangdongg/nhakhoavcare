/**
 * Nội dung trang mẹ Nha khoa trẻ em, song ngữ.
 * Nguồn: kịch bản §2 chương 3.
 *
 * VAI TRÒ CỦA TRANG NÀY: trang mẹ. Nó nói KHI NÀO và VÌ SAO, không nói LÀM THẾ
 * NÀO. Chỗ nào chạm tới kỹ thuật thì dừng lại và dẫn link xuống bài viết hoặc
 * trang dịch vụ. Viết kỹ thuật ở đây là tự cạnh tranh với chính trang con của
 * mình, và Google sẽ chọn giúp — thường chọn nhầm trang.
 *
 * ⚠️ CHỖ CÒN TRỐNG, chờ bác sĩ (mục ⚠1, ⚠2, ⚠4 của kịch bản):
 *   - số giờ đeo khí cụ mỗi ngày
 *   - mốc tăng trưởng xương hàm → biểu đồ
 *   - câu "100% ca chỉnh nha do BS chuyên sâu thực hiện"
 * Ba chỗ đó CHƯA có trên trang. Không viết bằng số đoán.
 */

export interface KidsCopy {
  lede: string;
  keepTitle: string;
  keep: string[];
  whenTitle: string;
  when: Array<{ name: string; body: string }>;
  mythTitle: string;
  myth: string[];
  mythLink: string;
  filmTitle: string;
  film: string[];
  filmLink: string;
  habitsTitle: string;
  habits: string[];
  habitsLink: string;
  earlyTitle: string;
  early: string[];
  archLabel: string;
  archCaption: string;
  earlyLink: string;
  windowTitle: string;
  window: string[];
  ctaTitle: string;
  cta: string;
}

export const KIDS: Record<'vi' | 'en', KidsCopy> = {
  vi: {
    lede: 'Mục tiêu là giữ răng cho trẻ, không phải nhổ. Và cửa sổ can thiệp sớm không mở mãi.',

    keepTitle: 'Răng sữa không phải răng tạm bợ',
    keep: [
      'Trong lúc còn ở đó, răng sữa giữ chỗ cho răng vĩnh viễn mọc lên đúng vị trí, và dạy xương hàm cách phát triển qua lực nhai hằng ngày.',
      'Mất một răng sữa quá sớm, chỗ trống bị các răng bên cạnh nghiêng vào lấp mất dần. Đến lúc răng vĩnh viễn muốn lên thì không còn đường.',
    ],

    whenTitle: 'Hai thời điểm nên nhổ một chiếc răng sữa',
    when: [
      {
        name: 'Khi răng đã lung lay',
        body: 'Chân răng đã tiêu gần hết một cách tự nhiên, vì răng vĩnh viễn bên dưới đang đẩy lên.',
      },
      {
        name: 'Khi răng vĩnh viễn đang mọc',
        body: 'Răng sữa chưa chịu rời chỗ, nên răng vĩnh viễn buộc phải lách sang bên.',
      },
    ],

    mythTitle: 'Nhổ răng sữa không làm răng vĩnh viễn mọc lệch',
    myth: [
      'Rất nhiều phụ huynh tin điều ngược lại, và nỗi tin đó làm chậm điều trị. Răng vĩnh viễn mọc lệch vì thiếu chỗ trên cung hàm, vì mất khoảng trống khi răng sữa rụng sớm mà không được giữ chỗ, vì thói quen xấu, hoặc vì mầm răng vốn đã nằm sai từ đầu.',
      'Sợ nhổ nên để chiếc răng sâu nằm lại thêm một năm — đó mới là thứ gây hại thật.',
    ],
    mythLink: 'Đọc bài: Có nên nhổ răng sữa sớm cho bé?',

    filmTitle: 'Mốc 6–7 tuổi: nên chụp một phim toàn cảnh',
    film: [
      'Đây là lúc trẻ bắt đầu thay răng và răng hàm vĩnh viễn đầu tiên đã mọc. Một tấm phim toàn cảnh trả lời cùng lúc bốn câu hỏi mà khám bằng mắt không trả lời nổi: đủ mầm răng không, mầm nào nằm sai hướng, có sâu ở mặt bên không, và cung hàm còn đủ chỗ không.',
      'Biết sớm để can thiệp nhẹ. Một khoảng thiếu chỗ phát hiện lúc 7 tuổi xử lý bằng khí cụ tháo lắp; cũng khoảng thiếu chỗ đó phát hiện lúc 14 tuổi có thể phải nhổ răng vĩnh viễn.',
    ],
    filmLink: 'Đọc bài: Vì sao nên chụp phim lúc 6–7 tuổi',

    habitsTitle: 'Thói quen xấu làm lệch hàm',
    habits: [
      'Xương hàm của trẻ mềm và đang lớn. Một lực nhỏ nhưng lặp lại mỗi ngày, trong nhiều năm, đủ để đổi hình dạng nó. Mút tay, thở bằng miệng, đẩy lưỡi khi nuốt, nhai lệch một bên — đều là những lực như vậy.',
    ],
    habitsLink: 'Đọc bài: Thói quen nhỏ có thể làm lệch hàm',

    earlyTitle: 'Chỉnh nha sớm: dẫn hướng, không phải kéo răng',
    early: [
      'Phòng khám nhận trẻ từ 4 tuổi. Chỉnh nha sớm không phải niềng răng cho trẻ mẫu giáo — nó là việc khác hẳn: thay vì kéo răng về đúng chỗ, nó dẫn xương hàm lớn lên đúng hướng, trong lúc xương còn đang lớn.',
      'Cách làm là khí cụ tháo lắp, làm riêng cho từng trẻ theo dấu hàm của chính bé. Can thiệp được ở cả giai đoạn răng sữa lẫn giai đoạn răng hỗn hợp, và chi phí thấp hơn so với niềng cố định khi trẻ đã lớn.',
    ],
    archLabel:
      'Sơ đồ cung hàm nhìn từ trên, hai mũi tên chỉ ra hai bên và đường nét đứt cho thấy cung hàm sau khi được nong rộng',
    archCaption: 'Nong rộng cung hàm: tạo thêm chỗ trước khi răng vĩnh viễn cần tới nó.',
    earlyLink: 'Chi tiết về niềng răng chỉnh nha',

    windowTitle: 'Vì sao "càng sớm càng tốt" không phải câu nói cho có',
    window: [
      'Chỉnh nha sớm dựa vào một thứ có hạn: xương hàm còn đang lớn. Khi xương còn lớn, khí cụ chỉ cần dẫn hướng. Khi xương đã ngừng lớn, muốn đổi hình dạng nó thì phải dùng lực mạnh hơn, thời gian dài hơn, và trong một số trường hợp là phẫu thuật.',
      'Đưa con đi khám sớm không có nghĩa là phải điều trị ngay — có thể chỉ là theo dõi. Nhưng khám muộn thì mất luôn lựa chọn điều trị nhẹ nhàng nhất.',
    ],

    ctaTitle: 'Đặt lịch khám cho bé',
    cta: 'Buổi khám đầu tiên là để trả lời một câu: bé đang ở đâu trong quá trình phát triển, và có gì cần theo dõi không.',
  },

  en: {
    lede: 'The goal is to keep a child’s teeth, not remove them. And the window for early treatment does not stay open.',

    keepTitle: 'A primary tooth is not a placeholder',
    keep: [
      'While it is there, a primary tooth holds the space for the adult tooth to come up in the right place, and teaches the jaw how to grow through the daily force of chewing.',
      'Lose one too early and the neighbouring teeth tip into the gap. By the time the adult tooth wants to come up, there is no longer a path.',
    ],

    whenTitle: 'The only two moments to remove a primary tooth',
    when: [
      {
        name: 'When it is already loose',
        body: 'The root has dissolved naturally, because the adult tooth beneath is pushing up.',
      },
      {
        name: 'When the adult tooth is coming through',
        body: 'The primary tooth has not made way, so the adult tooth is forced to deviate around it.',
      },
    ],

    mythTitle: 'Extraction does not cause crooked adult teeth',
    myth: [
      'Many parents believe the opposite, and that belief delays treatment. Adult teeth come in crooked because the arch lacks room, because a space was lost when a primary tooth went early and nothing held it, because of a long-standing habit, or because the tooth bud sat wrong from the start.',
      'Fear of extraction usually means leaving a decayed tooth in place another year — and that is the real harm.',
    ],
    mythLink: 'Read: Should a baby tooth be taken out early?',

    filmTitle: 'Age six to seven: worth one panoramic radiograph',
    film: [
      'This is when the front teeth begin to change over and the first permanent molar has arrived. One panoramic image answers four questions at once that a visual check cannot: are all the buds present, is any of them sitting the wrong way, is there decay between the teeth, and is there room on the arch.',
      'Finding it early means treating it gently. Crowding found at seven can be managed with a removable appliance; the same crowding found at fourteen may mean removing permanent teeth.',
    ],
    filmLink: 'Read: Why a panoramic radiograph matters at six or seven',

    habitsTitle: 'Habits that reshape the jaw',
    habits: [
      'A child’s jaw is soft and still growing. A small force repeated every day for years is enough to change its shape. Thumb sucking, mouth breathing, tongue thrusting on swallowing, chewing on one side only — all are forces of that kind.',
    ],
    habitsLink: 'Read: Small habits that can reshape a child’s jaw',

    earlyTitle: 'Early orthodontics: guiding growth, not pulling teeth',
    early: [
      'The clinic takes children from the age of four. Early orthodontics is not braces for preschoolers — it is a different thing entirely: instead of moving teeth into place, it guides the jaw to grow in the right direction, while it is still growing.',
      'It is done with a removable appliance, made individually from the child’s own impression. It works in both the primary and the mixed dentition stage, and costs less than fixed braces later on.',
    ],
    archLabel:
      'Diagram of a dental arch seen from above, with two arrows pointing outwards and a dashed line showing the arch after expansion',
    archCaption: 'Arch expansion: making room before the adult teeth need it.',
    earlyLink: 'More about orthodontics',

    windowTitle: 'Why "as early as possible" is not just a phrase',
    window: [
      'Early orthodontics depends on something finite: a jaw that is still growing. While it grows, an appliance only has to guide it. Once growth stops, changing its shape takes greater force, more time, and in some cases surgery.',
      'Bringing a child in early does not mean treatment starts immediately — it may mean nothing more than monitoring. But coming late removes the gentlest option from the table.',
    ],

    ctaTitle: 'Book an appointment for your child',
    cta: 'The first visit answers one question: where your child is in their development, and whether anything needs watching.',
  },
};
