/*
 * Copyright (C) 2026  Nguyen Cong Quan
 * * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
export interface ClassItem {
    ma_mon: string;
    ten_mon: string;
    nhom_to: string;
    to: string;
    so_tc: string;
    tkb: {
        thu: string; // "Thứ 2", "Thứ 3", hoặc mấy dòng GV rác -> mình lọc
        thoi_gian: string; // "tiết 1->3"
        phong?: string;
        giang_vien?: string;
        ngay?: string; // "30/03/26 đến 04/05/26"
    }[];
    id_to_hoc: string;
    sl_cp: number;
    sl_cl: number;
}

// event đã convert ra để vẽ lên calendar
export interface TimetableEvent {
    id: string; // id_to_hoc
    courseName: string;
    ma_mon: string;

    dayOfWeek: number; // 0..6 (0 = CN, 1 = Thứ 2, ...)
    periodStart: number; // 1..n
    periodEnd: number;

    room?: string;
    giang_vien?: string;
}

export interface MonHocItem {
    ma: string;
    ten: string;
    ten_eg?: string;
}

export interface DsMonHocItem extends MonHocItem {}

export interface SguTimetableJson {
    hoc_ky_dang_ky: string;
    data: {
        ds_nhom_to: ClassItem[];
        ds_mon_hoc: DsMonHocItem[];
    };
    time: string;
    sl_monhoc: number;
    total_items: number;
}
