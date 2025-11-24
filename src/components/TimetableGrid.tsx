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
const ROW_HEIGHT = 66; // px cho 1 tiết

type Props = {
    events: TimetableEvent[];
};

export default function TimetableGrid({ events }: Props) {
    return (
        <div className="w-full bg-white overflow-hidden border border-b-0 border-r-0">
            {/* header: Tiết / Giờ / Thứ */}
            <div className="grid grid-cols-[70px_110px_repeat(7,1fr)] ">
                <div className="flex items-center justify-center border-r border-b border-slate-200 py-3 text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-50">Tiết</div>
                <div className="flex items-center justify-center border-r border-b border-slate-200 py-3 text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-50">Giờ</div>

                {/* Các thứ */}
                {DAYS.map((d) => (
                    <div key={d.value} className="flex flex-col items-center justify-center py-3 border-r border-b bg-slate-50">
                        <span className="text-sm font-bold text-slate-800">{d.label}</span>
                    </div>
                ))}
            </div>

            {/* body */}
            <div className="grid grid-cols-[70px_110px_repeat(7,1fr)] text-xs bg-white relative">
                {/* Cột Tiết bên trái */}
                <div className="border-r bg-white">
                    {PERIODS.map((p) => (
                        <div key={p} style={{ height: ROW_HEIGHT }} className="border-b border-slate-200 flex items-center justify-center text-[11px] font-semibold text-slate-700">
                            {p}
                        </div>
                    ))}
                </div>

                {/* Cột Giờ bên trái */}
                <div className="border-r border-slate-200 bg-white">
                    {PERIODS.map((p, idx) => (
                        <div key={p} style={{ height: ROW_HEIGHT }} className="border-b border-slate-200 flex items-center justify-center text-[11px] text-slate-600 font-medium">
                            {PERIOD_TIMES[idx] || "--"}
                        </div>
                    ))}
                </div>

                {/* 7 cột ngày */}
                {DAYS.map((d) => {
                    const dayEvents = events.filter((e) => e.dayOfWeek === d.value);

                    return (
                        <div key={d.value} className="relative border-r bg-white" style={{ minHeight: PERIODS.length * ROW_HEIGHT }}>
                            {/* grid lines nền */}
                            {PERIODS.map((p) => (
                                <div key={p} style={{ height: ROW_HEIGHT }} className="border-b" />
                            ))}

                            {/* block môn học */}
                            {dayEvents.map((ev) => {
                                const top = (ev.periodStart - 1) * ROW_HEIGHT + 4;
                                const height = (ev.periodEnd - ev.periodStart + 1) * ROW_HEIGHT - 8;

                                const colors = [
                                    "bg-blue-50 border-l-4 border-blue-500 text-slate-800",
                                    "bg-emerald-50 border-l-4 border-emerald-500 text-slate-800",
                                    "bg-amber-50 border-l-4 border-amber-500 text-slate-800",
                                    "bg-purple-50 border-l-4 border-purple-500 text-slate-800",
                                    "bg-rose-50 border-l-4 border-rose-500 text-slate-800",
                                    "bg-cyan-50 border-l-4 border-cyan-500 text-slate-800",
                                    "bg-indigo-50 border-l-4 border-indigo-500 text-slate-800",
                                    "bg-pink-50 border-l-4 border-pink-500 text-slate-800",
                                    "bg-teal-50 border-l-4 border-teal-500 text-slate-800",
                                    "bg-orange-50 border-l-4 border-orange-500 text-slate-800",
                                    "bg-lime-50 border-l-4 border-lime-600 text-slate-800",
                                    "bg-fuchsia-50 border-l-4 border-fuchsia-500 text-slate-800",
                                    "bg-violet-50 border-l-4 border-violet-500 text-slate-800",
                                    "bg-sky-50 border-l-4 border-sky-500 text-slate-800",
                                    "bg-red-50 border-l-4 border-red-500 text-slate-800",
                                ];

                                // Sử dụng ma_mon để đảm bảo cùng môn học luôn có cùng màu
                                const colorIndex = ev.ma_mon.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
                                const colorClass = colors[colorIndex];

                                return (
                                    <div
                                        key={`${ev.id}-${ev.periodStart}-${ev.periodEnd}`}
                                        className={`absolute mx-[7px] shadow-sm cursor-pointer overflow-hidden ${colorClass} px-2.5 py-2 rounded-md`}
                                        style={{ top, height }}
                                        title={`${ev.courseName}\n${ev.giang_vien || ""}\nTiết ${ev.periodStart}–${ev.periodEnd}\n${ev.room || ""}`}
                                    >
                                        <div className="text-[11px] font-bold text-sky-900 leading-snug line-clamp-2 text-center mb-1">{ev.courseName}</div>
                                        <div className="text-[10px] font-medium leading-tight text-slate-700 text-center">Mã môn: {ev.ma_mon}</div>
                                        {ev.room && <div className="text-[10px] font-medium leading-tight text-slate-700 text-center">Phòng: {ev.room}</div>}
                                        {ev.giang_vien && <div className="text-[9px] font-medium leading-tight text-slate-600 text-center mt-0.5">{ev.giang_vien}</div>}
                                        <div className="text-[9px] font-medium leading-tight text-slate-500 text-center mt-0.5">
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
