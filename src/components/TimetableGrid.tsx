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
import { useMemo, useState } from "react";
import type { TimetableEvent } from "@/helper/type";
import { Clock, MapPin, User, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const DAYS = [
    { label: "Thứ 2", short: "T2", value: 1 },
    { label: "Thứ 3", short: "T3", value: 2 },
    { label: "Thứ 4", short: "T4", value: 3 },
    { label: "Thứ 5", short: "T5", value: 4 },
    { label: "Thứ 6", short: "T6", value: 5 },
    { label: "Thứ 7", short: "T7", value: 6 },
    { label: "Chủ nhật", short: "CN", value: 0 },
];

const PERIOD_TIMES = ["07:00-07:50", "07:50-08:40", "09:00-09:50", "09:50-10:40", "10:40-11:30", "13:00-13:50", "13:50-14:40", "15:00-15:50", "15:50-16:40", "16:40-17:30", "17:40-18:30", "18:30-19:20", "19:20-20:10"];

const MAX_PERIOD = 13;
const PERIODS = Array.from({ length: MAX_PERIOD }, (_, i) => i + 1);
const ROW_HEIGHT = 70; // px cho 1 tiết

interface SubjectTheme {
    border: string;
    gridClass: string;
}

const SUBJECT_THEMES: SubjectTheme[] = [
    { border: "border-l-blue-500", gridClass: "bg-blue-50 dark:bg-blue-950/50 border-l-4 border-blue-500 dark:border-blue-400 text-slate-800 dark:text-blue-100" },
    { border: "border-l-emerald-500", gridClass: "bg-emerald-50 dark:bg-emerald-950/50 border-l-4 border-emerald-500 dark:border-emerald-400 text-slate-800 dark:text-emerald-100" },
    { border: "border-l-amber-500", gridClass: "bg-amber-50 dark:bg-amber-950/50 border-l-4 border-amber-500 dark:border-amber-400 text-slate-800 dark:text-amber-100" },
    { border: "border-l-purple-500", gridClass: "bg-purple-50 dark:bg-purple-950/50 border-l-4 border-purple-500 dark:border-purple-400 text-slate-800 dark:text-purple-100" },
    { border: "border-l-rose-500", gridClass: "bg-rose-50 dark:bg-rose-950/50 border-l-4 border-rose-500 dark:border-rose-400 text-slate-800 dark:text-rose-100" },
    { border: "border-l-cyan-500", gridClass: "bg-cyan-50 dark:bg-cyan-950/50 border-l-4 border-cyan-500 dark:border-cyan-400 text-slate-800 dark:text-cyan-100" },
    { border: "border-l-indigo-500", gridClass: "bg-indigo-50 dark:bg-indigo-950/50 border-l-4 border-indigo-500 dark:border-indigo-400 text-slate-800 dark:text-indigo-100" },
    { border: "border-l-pink-500", gridClass: "bg-pink-50 dark:bg-pink-950/50 border-l-4 border-pink-500 dark:border-pink-400 text-slate-800 dark:text-pink-100" },
    { border: "border-l-teal-500", gridClass: "bg-teal-50 dark:bg-teal-950/50 border-l-4 border-teal-500 dark:border-teal-400 text-slate-800 dark:text-teal-100" },
    { border: "border-l-orange-500", gridClass: "bg-orange-50 dark:bg-orange-950/50 border-l-4 border-orange-500 dark:border-orange-400 text-slate-800 dark:text-orange-100" },
    { border: "border-l-lime-600", gridClass: "bg-lime-50 dark:bg-lime-950/50 border-l-4 border-lime-600 dark:border-lime-400 text-slate-800 dark:text-lime-100" },
    { border: "border-l-fuchsia-500", gridClass: "bg-fuchsia-50 dark:bg-fuchsia-950/50 border-l-4 border-fuchsia-500 dark:border-fuchsia-400 text-slate-800 dark:text-fuchsia-100" },
    { border: "border-l-violet-500", gridClass: "bg-violet-50 dark:bg-violet-950/50 border-l-4 border-violet-500 dark:border-violet-400 text-slate-800 dark:text-violet-100" },
    { border: "border-l-sky-500", gridClass: "bg-sky-50 dark:bg-sky-950/50 border-l-4 border-sky-500 dark:border-sky-400 text-slate-800 dark:text-sky-100" },
    { border: "border-l-red-500", gridClass: "bg-red-50 dark:bg-red-950/50 border-l-4 border-red-500 dark:border-red-400 text-slate-800 dark:text-red-100" },
];

type Props = {
    events: TimetableEvent[];
    viewMode?: "grid" | "card";
};

export default function TimetableGrid({ events, viewMode = "grid" }: Props) {
    const [selectedDayFilter, setSelectedDayFilter] = useState<number | null>(null);

    // map màu cho từng môn học
    const themeMap = useMemo(() => {
        const uniqueSubjects = Array.from(new Set(events.map((e) => e.ma_mon))).sort();
        const map: Record<string, SubjectTheme> = {};

        uniqueSubjects.forEach((subject, index) => {
            map[subject] = SUBJECT_THEMES[index % SUBJECT_THEMES.length];
        });

        return map;
    }, [events]);

    // Danh sách ngày có thứ tự: T2 -> T7 -> CN
    const orderedDays = useMemo(() => {
        const sorted = [...DAYS];
        return sorted.sort((a, b) => {
            const valA = a.value === 0 ? 7 : a.value;
            const valB = b.value === 0 ? 7 : b.value;
            return valA - valB;
        });
    }, []);

    // Danh sách ngày cần hiển thị trong Agenda View
    const displayDays = useMemo(() => {
        if (selectedDayFilter !== null) {
            return orderedDays.filter((d) => d.value === selectedDayFilter);
        }
        return orderedDays.filter((d) => events.some((e) => e.dayOfWeek === d.value));
    }, [orderedDays, events, selectedDayFilter]);

    if (viewMode === "card") {
        return (
            <div className="w-full space-y-3.5">
                {/* Filter nhanh theo thứ */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    <Button
                        type="button"
                        variant={selectedDayFilter === null ? "secondary" : "outline"}
                        size="sm"
                        className="h-7 px-2.5 text-xs font-mono rounded-none shrink-0 cursor-pointer"
                        onClick={() => setSelectedDayFilter(null)}
                    >
                        Tất cả ({orderedDays.filter((d) => events.some((e) => e.dayOfWeek === d.value)).length} ngày)
                    </Button>
                    {orderedDays.map((d) => {
                        const count = events.filter((e) => e.dayOfWeek === d.value).length;
                        if (count === 0) return null;
                        const isSelected = selectedDayFilter === d.value;

                        return (
                            <Button
                                key={d.value}
                                type="button"
                                variant={isSelected ? "secondary" : "outline"}
                                size="sm"
                                className="h-7 px-2.5 text-xs font-mono rounded-none shrink-0 cursor-pointer"
                                onClick={() => setSelectedDayFilter(isSelected ? null : d.value)}
                            >
                                {d.label} ({count})
                            </Button>
                        );
                    })}
                </div>

                {/* Container chụp ảnh / Agenda Multi-Column Grid */}
                <div className="timetable-capture-target w-full bg-background overflow-hidden border border-border p-3 sm:p-4">
                    {displayDays.length === 0 ? (
                        <div className="py-12 text-center text-sm text-muted-foreground font-mono">
                            <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            Không có lịch học nào
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 items-start">
                            {displayDays.map((day) => {
                                const dayEvents = events
                                    .filter((e) => e.dayOfWeek === day.value)
                                    .sort((a, b) => a.periodStart - b.periodStart);

                                const totalPeriods = dayEvents.reduce(
                                    (sum, e) => sum + (e.periodEnd - e.periodStart + 1),
                                    0
                                );

                                return (
                                    <div
                                        key={day.value}
                                        className="bg-card border border-border/80 p-3 space-y-2.5 shadow-2xs"
                                    >
                                        {/* Tiêu đề ngày */}
                                        <div className="flex items-center justify-between border-b border-border/60 pb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-primary/80" />
                                                <span className="font-bold text-sm text-foreground">
                                                    {day.label}
                                                </span>
                                            </div>
                                            <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 border border-border/50">
                                                {dayEvents.length} môn • {totalPeriods} tiết
                                            </span>
                                        </div>

                                        {/* Danh sách thẻ môn học gọn gàng */}
                                        <div className="space-y-2">
                                            {dayEvents.map((ev) => {
                                                const theme = themeMap[ev.ma_mon] || SUBJECT_THEMES[0];
                                                const startTime = PERIOD_TIMES[ev.periodStart - 1]?.split("-")[0] || "--";
                                                const endTime = PERIOD_TIMES[ev.periodEnd - 1]?.split("-")[1] || "--";
                                                const periodCount = ev.periodEnd - ev.periodStart + 1;

                                                return (
                                                    <div
                                                        key={`${ev.id}-${ev.periodStart}-${ev.periodEnd}`}
                                                        className={`border border-border/70 border-l-[3.5px] ${theme.border} bg-muted/20 hover:bg-muted/40 p-2.5 transition shadow-2xs space-y-1.5`}
                                                    >
                                                        {/* Hàng 1: Giờ & Tiết */}
                                                        <div className="flex items-center justify-between text-xs">
                                                            <div className="flex items-center gap-1.5 font-mono text-foreground font-semibold">
                                                                <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                                                                <span>{startTime} – {endTime}</span>
                                                            </div>
                                                            <span className="text-[11px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 border border-border/40">
                                                                Tiết {ev.periodStart}–{ev.periodEnd} ({periodCount}t)
                                                            </span>
                                                        </div>

                                                        {/* Hàng 2: Tên môn học */}
                                                        <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-2">
                                                            {ev.courseName}
                                                        </h4>

                                                        {/* Hàng 3: Metadata chips */}
                                                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                                            <span className="text-[11px] font-mono font-medium px-1.5 py-0.5 bg-muted text-muted-foreground border border-border/40">
                                                                Mã: {ev.ma_mon}
                                                            </span>
                                                            {ev.room && (
                                                                <span className="text-[11px] font-medium px-1.5 py-0.5 bg-muted text-foreground border border-border/40 inline-flex items-center gap-1">
                                                                    <MapPin className="w-3 h-3 text-primary shrink-0" />
                                                                    {ev.room}
                                                                </span>
                                                            )}
                                                            {ev.giang_vien && (
                                                                <span
                                                                    className="text-[11px] font-medium px-1.5 py-0.5 bg-muted text-muted-foreground border border-border/40 inline-flex items-center gap-1 max-w-[160px] truncate"
                                                                    title={ev.giang_vien}
                                                                >
                                                                    <User className="w-3 h-3 shrink-0" />
                                                                    {ev.giang_vien}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Grid View (mặc định)
    return (
        <div className="w-full">
            {/* Hint vuốt ngang chỉ hiện trên mobile */}
            <p className="sm:hidden text-[10px] text-muted-foreground text-center py-1 font-mono">← Vuốt ngang để xem đủ →</p>

            {/* Scroll container — giữ min-width để grid không bị ép */}
            <div className="overflow-x-auto scrollbar-hide overscroll-x-contain">
                <div className="w-full min-w-[700px]">
                    <div className="timetable-capture-target w-full bg-background overflow-hidden border border-b-0 border-r-0 dark:border-b dark:border-r">
                        {/* header: Tiết / Giờ / Thứ */}
                        <div className="grid grid-cols-[70px_110px_repeat(7,1fr)] ">
                            <div className="flex items-center justify-center border-r border-b border-border py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted">Tiết</div>
                            <div className="flex items-center justify-center border-r border-b border-border py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted">Giờ</div>

                            {/* Các thứ */}
                            {DAYS.map((d) => (
                                <div key={d.value} className="flex flex-col items-center justify-center py-3 border-r border-b bg-muted">
                                    <span className="text-sm font-bold text-foreground">{d.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* body */}
                        <div className="grid grid-cols-[70px_110px_repeat(7,1fr)] text-xs bg-background relative">
                            {/* Cột Tiết bên trái */}
                            <div className="border-r bg-background">
                                {PERIODS.map((p) => (
                                    <div key={p} style={{ height: ROW_HEIGHT }} className="border-b border-border flex items-center justify-center text-[11px] font-semibold text-muted-foreground">
                                        {p}
                                    </div>
                                ))}
                            </div>

                            {/* Cột Giờ bên trái */}
                            <div className="border-r border-border bg-background">
                                {PERIODS.map((p, idx) => (
                                    <div key={p} style={{ height: ROW_HEIGHT }} className="border-b border-border flex items-center justify-center text-[12px] text-muted-foreground font-medium">
                                        {PERIOD_TIMES[idx] || "--"}
                                    </div>
                                ))}
                            </div>

                            {/* 7 cột ngày */}
                            {DAYS.map((d) => {
                                const dayEvents = events.filter((e) => e.dayOfWeek === d.value);

                                return (
                                    <div key={d.value} className="relative border-r bg-background" style={{ minHeight: PERIODS.length * ROW_HEIGHT }}>
                                        {/* grid lines nền */}
                                        {PERIODS.map((p) => (
                                            <div key={p} style={{ height: ROW_HEIGHT }} className="border-b" />
                                        ))}

                                        {/* block môn học */}
                                        {dayEvents.map((ev) => {
                                            const top = (ev.periodStart - 1) * ROW_HEIGHT + 4;
                                            const height = (ev.periodEnd - ev.periodStart + 1) * ROW_HEIGHT - 8;
                                            const theme = themeMap[ev.ma_mon] || SUBJECT_THEMES[0];
                                            const width = `calc((100% - 14px))`;

                                            return (
                                                <div
                                                    key={`${ev.id}-${ev.periodStart}-${ev.periodEnd}`}
                                                    className={`absolute mx-[7px] shadow-sm cursor-pointer overflow-hidden ${theme.gridClass} px-2.5 py-2 rounded-md`}
                                                    style={{ top, height, width }}
                                                    title={`${ev.courseName}\n${ev.giang_vien || ""}\nTiết ${ev.periodStart}–${ev.periodEnd}\n${ev.room || ""}`}
                                                >
                                                    <div className="text-[13px] font-bold text-sky-900 dark:text-sky-100 leading-snug line-clamp-2 text-center mb-1">{ev.courseName}</div>
                                                    <div className="text-[11px] font-medium leading-tight text-slate-700 dark:text-slate-300 text-center">Mã môn: {ev.ma_mon}</div>
                                                    {ev.room && <div className="text-[11px] font-medium leading-tight text-slate-700 dark:text-slate-300 text-center">Phòng: {ev.room}</div>}
                                                    {ev.giang_vien && <div className="text-[11px] font-medium leading-tight text-slate-600 dark:text-slate-400 text-center mt-0.5">{ev.giang_vien}</div>}
                                                    <div className="text-[11px] font-medium leading-tight text-slate-500 dark:text-slate-400 text-center mt-0.5">
                                                        Tiết {ev.periodStart}–{ev.periodEnd}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

