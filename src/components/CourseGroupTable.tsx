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
import React, { useState, useEffect } from "react";
import { LayoutGrid, TableProperties } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hook/useIsMobile";

type Props = {
    groups: ClassItem[];
    selectedSubject: MonHocItem | null;
    chosenIds: string[];
    onToggle: (item: ClassItem, checked: boolean) => void;
};

export function CourseGroupTable({ groups, selectedSubject, chosenIds, onToggle }: Props) {
    const isMobile = useIsMobile();
    const rows: ClassItem[] = selectedSubject ? groups.filter((c) => c.ma_mon === selectedSubject.ma) : [];
    const [viewMode, setViewMode] = useState<"card" | "table">("card");

    useEffect(() => {
        if (isMobile) {
            setViewMode("card");
        } else {
            setViewMode("table");
        }
    }, [isMobile]);

    return (
        <div className="space-y-3 bg-card">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Danh sách nhóm tổ</h3>

                {/* View Toggle on both mobile and desktop */}
                {rows.length > 0 && (
                    <div className="flex items-center border border-border p-0.5 bg-muted/40">
                        <Button
                            type="button"
                            variant={viewMode === "card" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-7 px-2 text-xs font-mono rounded-none cursor-pointer"
                            onClick={() => setViewMode("card")}
                        >
                            <LayoutGrid className="w-3.5 h-3.5 mr-1" />
                            Thẻ
                        </Button>
                        <Button
                            type="button"
                            variant={viewMode === "table" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-7 px-2 text-xs font-mono rounded-none cursor-pointer"
                            onClick={() => setViewMode("table")}
                        >
                            <TableProperties className="w-3.5 h-3.5 mr-1" />
                            Bảng
                        </Button>
                    </div>
                )}
            </div>

            {/* Card View */}
            <div className={viewMode === "card" ? "space-y-2.5 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3" : "hidden"}>
                {rows.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground font-mono border border-border border-dashed p-4">
                        {selectedSubject ? "Không có nhóm tổ nào cho môn học này" : "Chưa chọn môn học"}
                    </div>
                ) : (
                    rows.map((item) => {
                        const checked = chosenIds.includes(item.id_to_hoc);
                        const tkbList = item.tkb ?? [];

                        return (
                            <div
                                key={item.id_to_hoc}
                                onClick={() => onToggle(item, !checked)}
                                className={`border p-3 transition cursor-pointer active:scale-[0.99] select-none ${
                                    checked
                                        ? "border-primary bg-primary/10 shadow-xs"
                                        : "border-border bg-card hover:bg-muted/40"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5 rounded border-border text-primary cursor-pointer accent-primary"
                                            checked={checked}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                onToggle(item, e.target.checked);
                                            }}
                                        />
                                        <div>
                                            <span className="text-sm font-bold text-foreground">
                                                Nhóm {item.nhom_to || "--"}
                                            </span>
                                            <span className="text-xs text-muted-foreground ml-2 font-mono">
                                                ({item.so_tc} TC)
                                            </span>
                                        </div>
                                    </div>

                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-mono font-medium ${
                                            item.sl_cl === 0 ? "text-destructive bg-destructive/10" : "text-foreground bg-muted"
                                        }`}
                                    >
                                        {item.sl_cp - item.sl_cl}/{item.sl_cp} chỗ
                                    </span>
                                </div>

                                {/* Schedule info */}
                                <div className="mt-2.5 pt-2 border-t border-border/60 space-y-1.5 text-xs text-muted-foreground">
                                    {tkbList.map((tkb, idx) => {
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
                                            <div key={idx} className="flex flex-col gap-0.5 font-mono">
                                                <div className="flex items-center justify-between text-foreground">
                                                    <span>
                                                        <strong className="text-primary font-medium">{tkb.thu || "Thứ --"}</strong> • Tiết {tietBd} ({soTiet} tiết)
                                                    </span>
                                                    <span className="text-muted-foreground">{tkb.phong || "--"}</span>
                                                </div>
                                                <div className="text-[11px] text-muted-foreground">
                                                    GV: {tkb.giang_vien || "--"}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Table View */}
            <div className={viewMode === "table" ? "block" : "hidden"}>
                {/* Hint vuốt ngang chỉ hiện trên mobile */}
                <div className="sm:hidden flex items-center justify-between py-1 px-1 text-xs text-muted-foreground font-mono mb-1.5">
                    <span className="flex items-center gap-1">
                        <span>←</span> Vuốt ngang để xem đủ <span>→</span>
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-muted border border-border">
                        Bảng nhóm tổ
                    </span>
                </div>

                <div className="overflow-x-auto overscroll-x-contain border border-border bg-card">
                    <table className="w-full min-w-[1020px] text-xs sm:text-sm cursor-pointer border-collapse">
                        <thead className="bg-muted text-foreground">
                            <tr className="border-b border-border">
                                <th className="w-10 min-w-10 px-2.5 py-2.5 text-center border-r border-border">
                                    <span className="sr-only">Chọn</span>
                                </th>
                                <th className="w-[85px] min-w-[85px] px-3 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">Mã</th>
                                <th className="min-w-[240px] px-3 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">Tên môn</th>
                                <th className="w-[50px] min-w-[50px] px-2 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">TC</th>
                                <th className="w-[65px] min-w-[65px] px-2.5 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">Nhóm</th>
                                <th className="w-[90px] min-w-[90px] px-3 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">Số lượng</th>
                                <th className="min-w-[150px] px-3 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">Giảng viên</th>
                                <th className="w-[65px] min-w-[65px] px-2.5 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">Thứ</th>
                                <th className="w-[65px] min-w-[65px] px-2.5 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">Tiết BD</th>
                                <th className="w-[65px] min-w-[65px] px-2.5 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-r border-border">Số tiết</th>
                                <th className="min-w-[90px] px-3 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Phòng</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows.map((item) => {
                                const checked = chosenIds.includes(item.id_to_hoc);
                                const tkbList = item.tkb ?? [];
                                const rowSpan = tkbList.length || 1;

                                return (
                                    <React.Fragment key={item.id_to_hoc}>
                                        {tkbList.map((tkb, idx) => {
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
                                                <tr
                                                    key={idx}
                                                    onClick={() => onToggle(item, !checked)}
                                                    className={`border-b border-border transition select-none cursor-pointer ${
                                                        checked ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-muted/50"
                                                    }`}
                                                >
                                                    {idx === 0 && (
                                                        <>
                                                            {/* checkbox */}
                                                            <td rowSpan={rowSpan} className="w-10 min-w-10 px-2.5 py-2.5 text-center align-top border-r border-border">
                                                                <input
                                                                    type="checkbox"
                                                                    className="h-4 w-4 rounded border-border text-primary cursor-pointer accent-primary"
                                                                    checked={checked}
                                                                    onChange={(e) => {
                                                                        e.stopPropagation();
                                                                        onToggle(item, e.target.checked);
                                                                    }}
                                                                />
                                                            </td>

                                                            <td rowSpan={rowSpan} className="w-[85px] min-w-[85px] px-3 py-2.5 font-mono font-bold text-xs text-foreground align-top border-r border-border">
                                                                {item.ma_mon}
                                                            </td>
                                                            <td rowSpan={rowSpan} className="min-w-[240px] px-3 py-2.5 font-medium text-foreground text-xs sm:text-sm leading-snug align-top border-r border-border">
                                                                {item.ten_mon}
                                                            </td>
                                                            <td rowSpan={rowSpan} className="w-[50px] min-w-[50px] px-2 py-2.5 text-center text-foreground font-mono text-xs sm:text-sm align-top border-r border-border">
                                                                {item.so_tc}
                                                            </td>
                                                            <td rowSpan={rowSpan} className="w-[65px] min-w-[65px] px-2.5 py-2.5 text-center text-foreground font-mono text-xs sm:text-sm align-top border-r border-border">
                                                                {item.nhom_to || "--"}
                                                            </td>
                                                            <td rowSpan={rowSpan} className="w-[90px] min-w-[90px] px-3 py-2.5 text-center align-top border-r border-border">
                                                                <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-medium ${item.sl_cl === 0 ? "text-destructive bg-destructive/10" : "text-foreground bg-muted"}`}>
                                                                    {`${item.sl_cp - item.sl_cl}/${item.sl_cp}`}
                                                                </span>
                                                            </td>
                                                        </>
                                                    )}

                                                    {/* phần thay đổi mỗi dòng */}
                                                    <td className="min-w-[150px] px-3 py-2.5 whitespace-nowrap text-xs text-muted-foreground border-r border-border">{tkb.giang_vien || "--"}</td>
                                                    <td className="w-[65px] min-w-[65px] px-2.5 py-2.5 text-center text-xs text-foreground font-medium border-r border-border">{tkb.thu || "--"}</td>
                                                    <td className="w-[65px] min-w-[65px] px-2.5 py-2.5 text-center font-mono text-xs border-r border-border">{tietBd}</td>
                                                    <td className="w-[65px] min-w-[65px] px-2.5 py-2.5 text-center font-mono text-xs border-r border-border">{soTiet}</td>
                                                    <td className="min-w-[90px] px-3 py-2.5 whitespace-nowrap text-xs text-muted-foreground">{tkb.phong || "--"}</td>
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
        </div>
    );
}
