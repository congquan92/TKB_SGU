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
import { useMemo } from "react";
import type { TimetableEvent } from "@/helper/type";

const DAYS = [
    { label: "Thứ 2", short: "T2", value: 1 },
    { label: "Thứ 3", short: "T3", value: 2 },
    { label: "Thứ 4", short: "T4", value: 3 },
    { label: "Thứ 5", short: "T5", value: 4 },
    { label: "Thứ 6", short: "T6", value: 5 },
    { label: "Thứ 7", short: "T7", value: 6 },
    { label: "CN", short: "CN", value: 0 },
];

const PERIOD_TIMES = ["07:00-07:50", "07:50-08:40", "09:00-09:50", "09:50-10:40", "10:40-11:30", "13:00-13:50", "13:50-14:40", "15:00-15:50", "15:50-16:40", "16:40-17:30", "17:40-18:30", "18:30-19:20", "19:20-20:10"];

const MAX_PERIOD = 13;
const PERIODS = Array.from({ length: MAX_PERIOD }, (_, i) => i + 1);
const ROW_HEIGHT = 70; // px cho 1 tiết

const COLORS = [
    "bg-blue-50 dark:bg-blue-950/50 border-l-4 border-blue-500 dark:border-blue-400 text-slate-800 dark:text-blue-100",
    "bg-emerald-50 dark:bg-emerald-950/50 border-l-4 border-emerald-500 dark:border-emerald-400 text-slate-800 dark:text-emerald-100",
    "bg-amber-50 dark:bg-amber-950/50 border-l-4 border-amber-500 dark:border-amber-400 text-slate-800 dark:text-amber-100",
    "bg-purple-50 dark:bg-purple-950/50 border-l-4 border-purple-500 dark:border-purple-400 text-slate-800 dark:text-purple-100",
    "bg-rose-50 dark:bg-rose-950/50 border-l-4 border-rose-500 dark:border-rose-400 text-slate-800 dark:text-rose-100",
    "bg-cyan-50 dark:bg-cyan-950/50 border-l-4 border-cyan-500 dark:border-cyan-400 text-slate-800 dark:text-cyan-100",
    "bg-indigo-50 dark:bg-indigo-950/50 border-l-4 border-indigo-500 dark:border-indigo-400 text-slate-800 dark:text-indigo-100",
    "bg-pink-50 dark:bg-pink-950/50 border-l-4 border-pink-500 dark:border-pink-400 text-slate-800 dark:text-pink-100",
    "bg-teal-50 dark:bg-teal-950/50 border-l-4 border-teal-500 dark:border-teal-400 text-slate-800 dark:text-teal-100",
    "bg-orange-50 dark:bg-orange-950/50 border-l-4 border-orange-500 dark:border-orange-400 text-slate-800 dark:text-orange-100",
    "bg-lime-50 dark:bg-lime-950/50 border-l-4 border-lime-600 dark:border-lime-400 text-slate-800 dark:text-lime-100",
    "bg-fuchsia-50 dark:bg-fuchsia-950/50 border-l-4 border-fuchsia-500 dark:border-fuchsia-400 text-slate-800 dark:text-fuchsia-100",
    "bg-violet-50 dark:bg-violet-950/50 border-l-4 border-violet-500 dark:border-violet-400 text-slate-800 dark:text-violet-100",
    "bg-sky-50 dark:bg-sky-950/50 border-l-4 border-sky-500 dark:border-sky-400 text-slate-800 dark:text-sky-100",
    "bg-red-50 dark:bg-red-950/50 border-l-4 border-red-500 dark:border-red-400 text-slate-800 dark:text-red-100",
];

type Props = {
    events: TimetableEvent[];
};

export default function TimetableGrid({ events }: Props) {
    // màu cho từng môn học để đảm bảo không trùng lặp (trong giới hạn số lượng màu)
    const colorMap = useMemo(() => {
        const uniqueSubjects = Array.from(new Set(events.map((e) => e.ma_mon))).sort();
        const map: Record<string, string> = {};

        uniqueSubjects.forEach((subject, index) => {
            map[subject] = COLORS[index % COLORS.length];
        });

        return map;
    }, [events]);

    return (
        <div className="w-full bg-background overflow-hidden border border-b-0 border-r-0 dark:border-b dark:border-r">
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
                                const colorClass = colorMap[ev.ma_mon] || COLORS[0];
                                const width = `calc((100% - 14px))`;

                                return (
                                    <div
                                        key={`${ev.id}-${ev.periodStart}-${ev.periodEnd}`}
                                        className={`absolute mx-[7px] shadow-sm cursor-pointer overflow-hidden ${colorClass} px-2.5 py-2 rounded-md`}
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
    );
}
