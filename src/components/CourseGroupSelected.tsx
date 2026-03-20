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
import { Trash2 } from "lucide-react";
import type { ClassItem } from "@/helper/type";
import { Button } from "@/components/ui/button";

type Props = {
    groups: ClassItem[];
    chosenIds: string[];
    onRemove: (id: string) => void;
};

export default function CourseGroupSelected({ groups, chosenIds, onRemove }: Props) {
    const data = groups.filter((g) => chosenIds.includes(g.id_to_hoc));
    const totalTC = data.reduce((sum, item) => sum + (Number(item.so_tc) || 0), 0);

    return (
        <div className="w-full bg-card">
            <div className="uppercase text-base tracking-wide font-bold m-5 text-foreground">Danh sách nhóm tổ đã chọn</div>

            {/* Header */}
            <div className="grid grid-cols-[120px_1fr_100px_120px_100px_80px] font-bold text-sm border border-border bg-muted">
                <div className="px-6 py-3 border-r border-border text-foreground uppercase text-xs tracking-wider">Mã</div>
                <div className="px-6 py-3 border-r border-border text-foreground uppercase text-xs tracking-wider">Tên môn</div>
                <div className="px-6 py-3 border-r border-border text-center text-foreground uppercase text-xs tracking-wider">Nhóm</div>
                <div className="px-6 py-3 border-r border-border text-center text-foreground uppercase text-xs tracking-wider">Số lượng</div>
                <div className="px-6 py-3 border-r border-border text-center text-foreground uppercase text-xs tracking-wider">Số TC</div>
                <div className="px-6 py-3 text-center text-foreground uppercase text-xs tracking-wider">Xóa</div>
            </div>

            {/* Rows */}
            {data.length === 0 ? (
                <div className="px-6 py-10 text-center text-muted-foreground">Chưa có nhóm tổ nào được chọn</div>
            ) : (
                data.map((item) => (
                    <div key={item.id_to_hoc} className="grid grid-cols-[120px_1fr_100px_120px_100px_80px] text-sm border border-t-0 border-border hover:bg-muted/50 transition">
                        <div className="px-6 py-3 border-r border-border font-medium text-xs text-foreground">{item.ma_mon}</div>
                        <div className="px-6 py-3 border-r border-border font-medium text-foreground">{item.ten_mon}</div>
                        <div className="px-6 py-3 border-r border-border text-center font-medium text-foreground">{item.nhom_to || "--"}</div>
                        <div className="px-6 py-3 border-r border-border text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.sl_cl === 0 ? "text-destructive" : "text-foreground"}`}>{`${item.sl_cp - item.sl_cl}/${item.sl_cp}`}</span>
                        </div>
                        <div className="px-6 py-3 border-r border-border text-center font-bold text-foreground">{item.so_tc}</div>
                        <div className="px-6 py-3 flex justify-center">
                            <Button variant="outline" className="text-destructive hover:text-destructive transition cursor-pointer rounded-none" title="Xóa nhóm tổ" onClick={() => onRemove(item.id_to_hoc)}>
                                <Trash2 size={18} />
                            </Button>
                        </div>
                    </div>
                ))
            )}

            {/* Footer */}
            {data.length > 0 && (
                <div className="grid grid-cols-[120px_1fr_100px_120px_100px_80px] font-semibold border border-t-0 bg-muted border-border ">
                    <div className="col-span-4 px-6 py-3 border-r border-border text-foreground">Tổng số tín chỉ</div>
                    <div className="px-6 py-3 border-r border-border text-center font-bold text-foreground">{totalTC}</div>
                    <div className="px-6 py-3"></div>
                </div>
            )}
        </div>
    );
}
