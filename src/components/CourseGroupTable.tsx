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
import type { ClassItem, MonHocItem } from "@/helper/type";
import React from "react";

type Props = {
    groups: ClassItem[];
    selectedSubject: MonHocItem | null;
    chosenIds: string[];
    onToggle: (item: ClassItem, checked: boolean) => void;
};

export function CourseGroupTable({ groups, selectedSubject, chosenIds, onToggle }: Props) {
    const rows: ClassItem[] = selectedSubject ? groups.filter((c) => c.ma_mon === selectedSubject.ma) : [];

    return (
        <div className="space-y-3 bg-card">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Danh sách nhóm tổ</h3>

            <div className="overflow-x-auto border-2 border-border bg-card">
                <table className="min-w-full text-sm cursor-pointer">
                    <thead className="bg-muted text-foreground">
                        <tr className="border-b border-border">
                            <th className="w-10 px-3 py-3 text-left border-r border-border">
                                <input type="checkbox" disabled className="opacity-0" />
                            </th>
                            <th className="px-3 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">Mã</th>
                            <th className="px-3 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">Tên môn</th>
                            <th className="px-3 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">TC</th>
                            <th className="px-3 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">Nhóm</th>
                            <th className="px-3 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">Số lượng</th>
                            <th className="px-3 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">Giảng viên</th>
                            <th className="px-3 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">Thứ</th>
                            <th className="px-3 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">Tiết BD</th>
                            <th className="px-3 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">Số tiết</th>
                            <th className="px-3 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Phòng</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* {!selectedSubject && (
                            <tr>
                                <td colSpan={11} className="px-4 py-10 text-center text-muted-foreground">
                                    Chưa chọn môn học
                                </td>
                            </tr>
                        )}

                        {selectedSubject && rows.length === 0 && (
                            <tr>
                                <td colSpan={11} className="px-4 py-10 text-center text-muted-foreground">
                                    Không có nhóm tổ nào cho môn học này
                                </td>
                            </tr>
                        )} */}

                        {rows.map((item) => {
                            const checked = chosenIds.includes(item.id_to_hoc);

                            // gom từng dòng TKB
                            const tkbList = item.tkb ?? [];
                            const rowSpan = tkbList.length || 1;

                            return (
                                <React.Fragment key={item.id_to_hoc}>
                                    {tkbList.map((tkb, idx) => {
                                        // tách giờ
                                        let tietBd = "--";
                                        let soTiet = "--";

                                        if (tkb.thoi_gian) {
                                            const m = tkb.thoi_gian.match(/(\d+)\s*->\s*(\d+)/);
                                            if (m) {
                                                tietBd = m[1];
                                                soTiet = `${Number(m[2]) - Number(m[1]) + 1}`;
                                            }
                                        }

                                        return (
                                            <tr key={idx} className={`border-b border-border transition ${checked ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-muted/50"}`}>
                                                {idx === 0 && (
                                                    <>
                                                        {/* checkbox */}
                                                        <td rowSpan={rowSpan} className="px-3 py-3 align-top border-r border-border">
                                                            <input type="checkbox" className="h-4 w-4 rounded border-border text-primary cursor-pointer" checked={checked} onChange={(e) => onToggle(item, e.target.checked)} />
                                                        </td>

                                                        <td rowSpan={rowSpan} className="px-3 py-2.5 font-mono font-bold text-foreground align-top border-r border-border">
                                                            {item.ma_mon}
                                                        </td>
                                                        <td rowSpan={rowSpan} className="px-3 py-2.5 font-medium text-foreground text-sm align-top border-r border-border">
                                                            {item.ten_mon}
                                                        </td>
                                                        <td rowSpan={rowSpan} className="px-3 py-2.5 text-center text-foreground align-top border-r border-border">
                                                            {item.so_tc}
                                                        </td>
                                                        <td rowSpan={rowSpan} className="px-3 py-2.5 text-center text-foreground align-top border-r border-border">
                                                            {item.nhom_to || "--"}
                                                        </td>
                                                        <td rowSpan={rowSpan} className="px-3 py-3 text-center align-top border-r border-border">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.sl_cl === 0 ? "text-destructive" : "text-foreground"}`}>{`${item.sl_cp - item.sl_cl}/${item.sl_cp}`}</span>
                                                        </td>
                                                    </>
                                                )}

                                                {/* phần thay đổi mỗi dòng */}
                                                <td className="px-3 py-3 whitespace-nowrap text-muted-foreground border-r border-border">{tkb.giang_vien || "--"}</td>
                                                <td className="px-3 py-3 text-center text-muted-foreground border-r border-border">{tkb.thu || "--"}</td>
                                                <td className="px-3 py-3 text-center font-mono text-xs border-r border-border">{tietBd}</td>
                                                <td className="px-3 py-3 text-center font-mono text-xs border-r border-border">{soTiet}</td>
                                                <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">{tkb.phong || "--"}</td>
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
