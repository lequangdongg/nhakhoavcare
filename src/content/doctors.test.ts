import { describe, expect, it } from 'vitest';
import { doctorSchema } from './doctors-schema';

const valid = {
  key: 'bs-nguyen-van-a',
  lang: 'vi',
  name: 'BS. Nguyễn Văn A',
  title: 'Bác sĩ Răng Hàm Mặt',
  order: 1,
  yearsOfExperience: 12,
  portrait: './bs-nguyen-van-a.jpg',
  summary:
    'Bác sĩ chuyên sâu cấy ghép Implant với hơn mười năm kinh nghiệm, đã thực hiện trên một nghìn ca tại Đà Nẵng và khu vực miền Trung.',
  education: [{ degree: 'Bác sĩ Răng Hàm Mặt', institution: 'Đại học Y Dược Huế', year: 2012 }],
  certificates: [
    {
      name: 'Chứng chỉ Cấy ghép Implant nha khoa',
      issuer: 'Bệnh viện Răng Hàm Mặt Trung ương',
      year: 2016,
    },
  ],
  achievements: ['Hoàn thành trên 1.000 ca cấy ghép Implant'],
  specialties: ['implant', 'crown'],
};

describe('doctorSchema — trường bắt buộc', () => {
  it('chấp nhận hồ sơ đầy đủ', () => {
    expect(doctorSchema.safeParse(valid).success).toBe(true);
  });

  it('bắt buộc có ít nhất một bằng cấp — hồ sơ y tế không được để trống phần đào tạo', () => {
    const r = doctorSchema.safeParse({ ...valid, education: [] });
    expect(r.success).toBe(false);
  });

  it('bắt buộc có ít nhất một chứng chỉ', () => {
    const r = doctorSchema.safeParse({ ...valid, certificates: [] });
    expect(r.success).toBe(false);
  });
});

describe('doctorSchema — chứng chỉ phải truy nguyên được', () => {
  it('từ chối chứng chỉ không ghi nơi cấp', () => {
    const r = doctorSchema.safeParse({
      ...valid,
      certificates: [{ name: 'Chứng chỉ Implant', issuer: '', year: 2016 }],
    });
    expect(r.success).toBe(false);
  });

  it('từ chối chứng chỉ không ghi năm', () => {
    const r = doctorSchema.safeParse({
      ...valid,
      certificates: [{ name: 'Chứng chỉ Implant', issuer: 'Bệnh viện X' }],
    });
    expect(r.success).toBe(false);
  });

  it('từ chối năm cấp ở tương lai', () => {
    const r = doctorSchema.safeParse({
      ...valid,
      certificates: [{ name: 'Chứng chỉ Implant', issuer: 'Bệnh viện X', year: 2099 }],
    });
    expect(r.success).toBe(false);
  });
});

describe('doctorSchema — chuyên môn nối với trang dịch vụ', () => {
  it('chấp nhận key dịch vụ có thật', () => {
    expect(doctorSchema.safeParse({ ...valid, specialties: ['implant'] }).success).toBe(true);
  });

  it('từ chối key dịch vụ không tồn tại — chặn liên kết chết sang trang dịch vụ', () => {
    const r = doctorSchema.safeParse({ ...valid, specialties: ['khong-co-dich-vu-nay'] });
    expect(r.success).toBe(false);
  });
});

describe('doctorSchema — số năm kinh nghiệm', () => {
  it('từ chối số âm', () => {
    expect(doctorSchema.safeParse({ ...valid, yearsOfExperience: -1 }).success).toBe(false);
  });

  it('từ chối con số phi lý (trên 60 năm)', () => {
    expect(doctorSchema.safeParse({ ...valid, yearsOfExperience: 80 }).success).toBe(false);
  });
});
