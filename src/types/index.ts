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
  id_to_hoc?: string;
  sl_cp?: number;  // Số lượng chỗ tối đa
  sl_cl?: number;  // Số lượng chỗ còn lại
}

export interface TimetableCell {
  subject?: string;
  room?: string;
  instructor?: string;
  nhom_to?: string;
  to?: string;
  isConflict?: boolean;
  subjectCode?: string;
  sl_cp?: number;  // Số lượng chỗ tối đa
  sl_cl?: number;  // Số lượng chỗ còn lại
  rowSpan?: number; // Số dòng cell này span
  isMerged?: boolean; // Cell này có bị merge không (sẽ ẩn)
}

export type TimetableGrid = TimetableCell[][];
