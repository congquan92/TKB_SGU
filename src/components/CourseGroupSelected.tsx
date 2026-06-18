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
        <div className="w-full bg-card border border-border shadow-sm">
            <div className="uppercase text-xs sm:text-base tracking-widest sm:tracking-wide font-extrabold px-4 sm:px-6 py-4 text-foreground border-b border-border bg-muted/30">
                Danh sách môn học đã chọn
            </div>

            {/* Content Area with Horizontal Scroll */}
            <div className="overflow-x-auto no-scrollbar border-t border-border/10">
                <div className="min-w-[1000px] w-full">
                    {/* Header */}
                    <div className="grid grid-cols-[110px_1fr_100px_130px_100px_100px] font-bold text-[10px] sm:text-xs border-b border-border bg-muted/50 text-muted-foreground uppercase tracking-wider">
                        <div className="px-4 py-3 border-r border-border">Mã môn</div>
                        <div className="px-4 py-3 border-r border-border">Tên môn học</div>
                        <div className="px-4 py-3 border-r border-border text-center">Nhóm</div>
                        <div className="px-4 py-3 border-r border-border text-center">Sĩ số</div>
                        <div className="px-4 py-3 border-r border-border text-center">Số TC</div>
                        <div className="px-4 py-3 text-center">Hành động</div>
                    </div>

                    {/* Rows */}
                    {data.length === 0 ? (
                        <div className="px-6 py-12 text-center text-sm text-muted-foreground bg-background/50">
                            Chưa có môn học nào được chọn trong phiên bản này.
                        </div>
                    ) : (
                        data.map((item) => (
                            <div key={item.id_to_hoc} className="grid grid-cols-[110px_1fr_100px_130px_100px_100px] text-xs sm:text-sm border-b border-border hover:bg-accent/5 transition-colors items-center">
                                <div className="px-4 py-3 border-r border-border font-mono font-bold text-primary/80">{item.ma_mon}</div>
                                <div className="px-4 py-3 border-r border-border font-semibold text-foreground whitespace-normal break-words" title={item.ten_mon}>{item.ten_mon}</div>
                                <div className="px-4 py-3 border-r border-border text-center font-medium">{item.nhom_to || "--"}</div>
                                <div className="px-4 py-3 border-r border-border text-center">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.sl_cl === 0 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                                        {`${item.sl_cp - item.sl_cl}/${item.sl_cp}`}
                                    </span>
                                </div>
                                <div className="px-4 py-3 border-r border-border text-center font-bold text-foreground">{item.so_tc}</div>
                                <div className="px-4 py-3 flex justify-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer rounded-none"
                                        onClick={() => onRemove(item.id_to_hoc)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Footer */}
                    {data.length > 0 && (
                        <div className="grid grid-cols-[110px_1fr_100px_130px_100px_100px] font-bold bg-muted/30 text-foreground border-b border-border">
                            <div className="col-span-4 px-4 py-3 border-r border-border text-right uppercase tracking-wider text-[10px] sm:text-xs text-muted-foreground">Tổng số tín chỉ tích lũy:</div>
                            <div className="px-4 py-3 border-r border-border text-center text-sm sm:text-base text-primary">{totalTC}</div>
                            <div className="px-4 py-3"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
