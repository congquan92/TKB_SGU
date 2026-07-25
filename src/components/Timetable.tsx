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
import { useState, useRef, useEffect } from "react";
import { Calendar, Camera, Download, Trash, Upload } from "lucide-react";
import { SearchCourse } from "@/components/SearchCourse";
import TimetableGrid from "@/components/TimetableGrid";
import { CourseGroupTable } from "@/components/CourseGroupTable";
import { toast } from "sonner";

import type { ClassItem, MonHocItem, SguTimetableJson, TimetableEvent } from "@/helper/type";
import raw from "@/data/dsCustom.json";
import { Button } from "@/components/ui/button";
import CourseGroupSelected from "@/components/CourseGroupSelected";
import { toPng } from "html-to-image";
import TimetableTabs, { type TimetableVersion } from "@/components/TimetableTabs";

const rawData = raw as SguTimetableJson;
const groups: ClassItem[] = rawData.data.ds_nhom_to;

// Set chỉ lấy 1 cái mã môn học
const validSubjectIds = new Set(groups.map((g) => g.ma_mon));
const subjects: MonHocItem[] = rawData.data.ds_mon_hoc.filter((s) => validSubjectIds.has(s.ma));

const hocKy = rawData.hoc_ky_dang_ky;

// map "Thứ 2" -> 1, ...
function parseDay(thu: string): number {
    thu = thu.trim();
    const map: Record<string, number> = {
        "Chủ nhật": 0,
        CN: 0,
        "Thứ 2": 1,
        "Thứ 3": 2,
        "Thứ 4": 3,
        "Thứ 5": 4,
        "Thứ 6": 5,
        "Thứ 7": 6,
    };
    return map[thu] ?? -1;
}

// "tiết 3->5" -> { start: 3, end: 5 }
function parsePeriod(thoi_gian: string) {
    const match = thoi_gian.match(/(\d+)\s*->\s*(\d+)/);
    if (!match) return null;
    return {
        start: Number(match[1]),
        end: Number(match[2]),
    };
}

function classToEvents(item: ClassItem): TimetableEvent[] {
    return item.tkb
        .map((t) => {
            const day = parseDay(t.thu);
            const period = parsePeriod(t.thoi_gian);

            if (day === -1 || !period) return null;

            return {
                id: item.id_to_hoc,
                courseName: item.ten_mon,
                ma_mon: item.ma_mon,
                dayOfWeek: day,
                periodStart: period.start,
                periodEnd: period.end,
                room: t.phong,
                giang_vien: t.giang_vien,
            } as TimetableEvent;
        })
        .filter(Boolean) as TimetableEvent[];
}

function hasConflict(existing: TimetableEvent[], incoming: TimetableEvent[]): boolean {
    for (const ev of incoming) {
        for (const cur of existing) {
            if (ev.dayOfWeek !== cur.dayOfWeek) continue;
            const overlap = ev.periodStart <= cur.periodEnd && ev.periodEnd >= cur.periodStart;
            if (overlap) return true;
        }
    }
    return false;
}

const STORAGE_KEY = "tkb-versions";
const ACTIVE_VERSION_KEY = "tkb-active-version-id";

function loadEventsFromIds(ids: string[]): TimetableEvent[] {
    const newEvents: TimetableEvent[] = [];
    ids.forEach((id) => {
        const group = groups.find((g) => g.id_to_hoc === id);
        if (group) {
            newEvents.push(...classToEvents(group));
        }
    });
    return newEvents;
}

export default function Timetable() {
    const [selectedSubject, setSelectedSubject] = useState<MonHocItem | null>(null);

    const [versions, setVersions] = useState<TimetableVersion[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (error) {
            console.error("Lỗi khi đọc versions:", error);
        }
        // Tạo phiên bản mặc định
        const defaultVersion: TimetableVersion = {
            id: `v-${Date.now()}`,
            name: "TKB_1",
            chosenIds: [],
            createdAt: Date.now(),
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultVersion]));
        } catch (error) {
            console.error("Lỗi khi lưu default version:", error);
        }
        return [defaultVersion];
    });

    const [activeVersionId, setActiveVersionId] = useState<string>(() => {
        try {
            const saved = localStorage.getItem(ACTIVE_VERSION_KEY);
            if (saved) {
                // Kiểm tra xem ID này có tồn tại trong versions không
                const versionsSaved = localStorage.getItem(STORAGE_KEY);
                if (versionsSaved) {
                    const parsed = JSON.parse(versionsSaved);
                    if (Array.isArray(parsed)) {
                        const exists = parsed.find((v: TimetableVersion) => v.id === saved);
                        if (exists) return saved;
                    }
                }
            }

            // Nếu không có hoặc không hợp lệ, lấy version đầu tiên
            const versionsSaved = localStorage.getItem(STORAGE_KEY);
            if (versionsSaved) {
                const parsed = JSON.parse(versionsSaved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed[0].id;
                }
            }
        } catch (error) {
            console.error("Lỗi khi đọc active version:", error);
        }
        // Fallback: trả về ID của version đầu tiên trong state
        return versions[0]?.id || "";
    });

    const activeVersion = versions.find((v) => v.id === activeVersionId);
    const chosenIds = activeVersion?.chosenIds || [];
    const events = loadEventsFromIds(chosenIds);

    const timetableRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Lưu active version ID
    useEffect(() => {
        if (activeVersionId) {
            try {
                localStorage.setItem(ACTIVE_VERSION_KEY, activeVersionId);
            } catch (error) {
                console.error("Lỗi khi lưu active version:", error);
            }
        }
    }, [activeVersionId]);

    // Lưu versions vào localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(versions));
        } catch (error) {
            console.error("Lỗi khi lưu versions:", error);
        }
    }, [versions]);

    // Update chosenIds của active version
    const updateChosenIds = (newIds: string[]) => {
        if (!activeVersionId) {
            console.error("Không có phiên bản đang active");
            toast.error("Vui lòng chọn một phiên bản trước!");
            return;
        }

        setVersions((prev) => prev.map((v) => (v.id === activeVersionId ? { ...v, chosenIds: newIds } : v)));
    };

    const handleVersionChange = (versionId: string) => {
        setActiveVersionId(versionId);
        setSelectedSubject(null); // Reset selected subject khi đổi version
    };

    const handleVersionsUpdate = (newVersions: TimetableVersion[]) => {
        setVersions(newVersions);
    };

    const handleCourseChange = (item: MonHocItem | null) => {
        setSelectedSubject(item);
    };

    const handleToggleGroup = (item: ClassItem, checked: boolean) => {
        if (checked) {
            const incoming = classToEvents(item);
            if (incoming.length === 0) return;

            // bỏ hết event của cùng mã môn trước (giống radio theo mã môn)
            const cleanedEvents = events.filter((ev) => ev.ma_mon !== item.ma_mon);

            // chỉ check trùng với môn khác (đã loại cùng mã rồi)
            if (hasConflict(cleanedEvents, incoming)) {
                toast.error("Lịch trùng !");
                return;
            }

            const sameCourseIds = groups.filter((g) => g.ma_mon === item.ma_mon).map((g) => g.id_to_hoc);
            const filtered = chosenIds.filter((id) => !sameCourseIds.includes(id));
            updateChosenIds([...filtered, item.id_to_hoc]);
        } else {
            // bỏ tick -> xóa id của chính nhóm đó
            updateChosenIds(chosenIds.filter((id) => id !== item.id_to_hoc));
        }
    };

    const clearAll = () => {
        setSelectedSubject(null);
        updateChosenIds([]);
    };

    const handleRemoveGroup = (id: string) => {
        updateChosenIds(chosenIds.filter((cid) => cid !== id));
    };

    const handleCapture = async () => {
        if (!timetableRef.current) return;

        try {
            // Tìm element TimetableGrid bên trong timetableRef
            const gridElement = timetableRef.current.querySelector(".w-full.bg-background.overflow-hidden.border") as HTMLElement;
            if (!gridElement) {
                toast.error("Không tìm thấy thời khóa biểu");
                return;
            }
            toast.loading("Đang chụp ảnh...");
            const dataUrl = await toPng(gridElement, {
                quality: 1,
                pixelRatio: 3, // tăng độ phân giải
                backgroundColor: "#ffffff",
            });

            // Download ảnh
            const link = document.createElement("a");
            link.download = `tkb-sgu-${new Date().getTime()}.png`;
            link.href = dataUrl;
            link.click();

            toast.dismiss();
            toast.success("Đã lưu ảnh thời khóa biểu!");
        } catch (error) {
            console.error("Lỗi khi chụp ảnh:", error);
            toast.dismiss();
            toast.error("Không thể chụp ảnh");
        }
    };

    const handleDownloadJson = () => {
        if (chosenIds.length === 0) {
            toast.error("Chưa có môn học nào để tải xuống");
            return;
        }

        // Lưu chosenIds
        const data = {
            chosenIds,
            exportDate: new Date().toISOString(),
            hocKy,
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `tkb-sgu-${new Date().getTime()}.json`;
        link.click();
        URL.revokeObjectURL(url);

        toast.success("Đã tải xuống file JSON!");
    };

    const handleUploadJson = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                if (!data.chosenIds || !Array.isArray(data.chosenIds)) {
                    toast.error("File JSON không hợp lệ");
                    return;
                }

                // Load chosenIds từ file
                const validIds = data.chosenIds.filter((id: string) => groups.some((g) => g.id_to_hoc === id));

                if (validIds.length === 0) {
                    toast.error("Không tìm thấy môn học nào trong file");
                    return;
                }

                updateChosenIds(validIds);
                toast.success(`Đã tải ${validIds.length} môn học!`);
            } catch (error) {
                console.error("Lỗi khi đọc file:", error);
                toast.error("Không thể đọc file JSON");
            }
        };
        reader.readAsText(file);

        // Reset input để có thể upload lại cùng file
        event.target.value = "";
    };

    return (
        <div className="w-full bg-background">
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleUploadJson} style={{ display: "none" }} />

            {/* Tabs phiên bản */}
            <TimetableTabs activeVersionId={activeVersionId} onVersionChange={handleVersionChange} onVersionsUpdate={handleVersionsUpdate} versions={versions} />

            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                {/*  Search and Course Group Table */}
                <div className="bg-card shadow-sm border border-border overflow-hidden">
                    {/* Header Section */}
                    <div className="flex items-center justify-between flex-wrap gap-4 px-6 py-4 border-b border-border">
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Thời Khóa Biểu</h2>
                            <div className="flex items-center gap-1">
                                {hocKy && <p className="text-xs text-muted-foreground">{hocKy} : </p>}
                                <span className="text-xs font-medium text-muted-foreground">
                                    {rawData.sl_monhoc}/{rawData.data.ds_mon_hoc.length} môn
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="flex items-center gap-3 flex-wrap px-6 py-4">
                        <div className="flex-1 min-w-[300px]">
                            <SearchCourse subjects={subjects} value={selectedSubject} onChange={handleCourseChange} />
                        </div>
                    </div>

                    {/* Course Group Table */}
                    <div className="px-6 py-4">
                        <CourseGroupTable groups={groups} selectedSubject={selectedSubject} chosenIds={chosenIds} onToggle={handleToggleGroup} />
                    </div>
                </div>

                {/* Timetable Grid */}
                {events.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <div ref={timetableRef} className="bg-card border border-border px-6 py-4 shadow-sm ">
                            <div className="flex justify-between">
                                <div className="flex items-center gap-2 p-4">
                                    <h2 className="text-xl font-bold text-foreground">Thời khóa biểu của bạn</h2>
                                    <span className="text-xs font-medium text-muted-foreground px-3 py-1 bg-muted border border-border">
                                        {groups.filter((g) => chosenIds.includes(g.id_to_hoc)).reduce((sum, g) => sum + Number(g.so_tc), 0)} tín chỉ
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground px-3 py-1 bg-muted border border-border">{new Set(groups.filter((g) => chosenIds.includes(g.id_to_hoc)).map((g) => g.ma_mon)).size} môn</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant={"outline"} onClick={clearAll} size={"icon"} className="cursor-pointer rounded-none" title="Xóa tất cả">
                                        <Trash />
                                    </Button>
                                    <Button variant={"outline"} onClick={handleCapture} size={"icon"} className="cursor-pointer rounded-none" title="Chụp ảnh">
                                        <Camera />
                                    </Button>
                                    <Button variant={"outline"} onClick={() => fileInputRef.current?.click()} size={"icon"} className="cursor-pointer rounded-none" title="Tải lên TKB">
                                        <Upload />
                                    </Button>
                                    <Button variant={"outline"} onClick={handleDownloadJson} size={"icon"} className="cursor-pointer rounded-none" title="Tải xuống TKB">
                                        <Download />
                                    </Button>
                                </div>
                            </div>

                            <TimetableGrid events={events} />
                        </div>

                        <div className="px-6 py-4 border border-border mt-4 bg-card">
                            <CourseGroupSelected groups={groups} chosenIds={chosenIds} onRemove={handleRemoveGroup} />
                        </div>
                    </div>
                )}

                {events.length === 0 && (
                    <div className="bg-card border border-border overflow-hidden shadow-sm">
                        <div className="px-6 py-12 text-center">
                            <div className="max-w-md mx-auto space-y-4">
                                <div className="flex items-center justify-center text-muted-foreground">
                                    <Calendar size={64} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-foreground">Chưa có môn học nào</h3>
                                    <p className="text-sm text-muted-foreground">Tìm kiếm và chọn các môn học bạn muốn đăng ký ở trên, hoặc tải lên file JSON để khôi phục thời khóa biểu</p>
                                </div>
                                <div className="flex items-center justify-center gap-3 pt-2">
                                    <Button variant={"outline"} onClick={() => fileInputRef.current?.click()} className="rounded-none gap-2 cursor-pointer">
                                        <Upload size={16} />
                                        Tải lên TKB
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
