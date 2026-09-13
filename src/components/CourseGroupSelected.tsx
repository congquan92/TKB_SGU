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
import { useState, useEffect } from "react";
import { Trash2, LayoutGrid, TableProperties } from "lucide-react";
import type { ClassItem } from "@/helper/type";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hook/useIsMobile";

type Props = {
    groups: ClassItem[];
    chosenIds: string[];
    onRemove: (id: string) => void;
};

export default function CourseGroupSelected({ groups, chosenIds, onRemove }: Props) {
    const isMobile = useIsMobile();
    const [viewMode, setViewMode] = useState<"card" | "table">("card");

    useEffect(() => {
        if (isMobile) {
            setViewMode("card");
        }
    }, [isMobile]);

    const data = groups.filter((g) => chosenIds.includes(g.id_to_hoc));
    const totalTC = data.reduce((sum, item) => sum + (Number(item.so_tc) || 0), 0);

    return (
        <div className="w-full bg-card">
            <div className="flex items-center justify-between flex-wrap gap-2 m-4 sm:m-5">
                <div className="uppercase text-sm sm:text-base tracking-wide font-bold text-foreground">
                    Danh sách nhóm tổ đã chọn ({data.length})
                </div>
                {data.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="text-xs font-mono font-bold bg-muted px-2.5 py-1 text-foreground border border-border">
                            Tổng: {totalTC} tín chỉ
                        </div>
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
                    </div>
                )}
            </div>

            {/* Card View */}
            <div className={viewMode === "card" ? "block px-4 pb-4 space-y-2.5" : "hidden"}>
                {data.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground font-mono border border-border border-dashed p-4">
                        Chưa có nhóm tổ nào được chọn
                    </div>
                ) : (
                    data.map((item) => (
                        <div key={item.id_to_hoc} className="border border-border p-3 bg-card flex items-center justify-between gap-3 shadow-2xs">
                            <div className="flex flex-col gap-1 min-w-0 flex-1">
                                <span className="text-sm font-semibold text-foreground truncate">
                                    {item.ten_mon}
                                </span>
                                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground flex-wrap">
                                    <span className="bg-muted px-1.5 py-0.5 text-foreground font-medium">Mã: {item.ma_mon}</span>
                                    <span>Nhóm: {item.nhom_to || "--"}</span>
                                    <span>{item.so_tc} TC</span>
                                    <span className={item.sl_cl === 0 ? "text-destructive font-bold" : ""}>
                                        {item.sl_cp - item.sl_cl}/{item.sl_cp} chỗ
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 transition cursor-pointer rounded-none shrink-0"
                                title="Xóa nhóm tổ"
                                onClick={() => onRemove(item.id_to_hoc)}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    ))
                )}
            </div>

            {/* Table View */}
            <div className={viewMode === "table" ? "block overflow-x-auto scrollbar-hide" : "hidden"}>
                <div className="w-full min-w-[600px]">
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
            </div>
        </div>
    );
}
