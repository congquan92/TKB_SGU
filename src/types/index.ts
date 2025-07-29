// Types cho ứng dụng Thời Khóa Biểu

export interface ScheduleItem {
  thu: string;
  thoi_gian: string;
  phong: string;
  giang_vien: string;
  ngay: string;
}

export interface Subject {
  ma_mon: string;
  ten_mon: string;
  nhom_to: string;
  to: string;
  so_tc: string;
  tkb: ScheduleItem[];
}

export interface TimetableCell {
  subject?: string;
  room?: string;
  instructor?: string;
  isConflict?: boolean;
  subjectCode?: string;
}

export type TimetableGrid = TimetableCell[][];
