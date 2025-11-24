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
        <div className="space-y-3 bg-white">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Danh sách nhóm tổ</h3>

            <div className="overflow-x-auto border-2 border-slate-300 bg-white">
                <table className="min-w-full text-sm cursor-pointer">
                    <thead className="bg-linear-to-r from-slate-100 to-slate-50 text-slate-700">
                        <tr className="border-b border-slate-300">
                            <th className="w-10 px-3 py-3 text-left border-r border-slate-300">
                                <input type="checkbox" disabled className="opacity-0" />
                            </th>
                            <th className="px-3 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider text-slate-600 border-r border-slate-300">Mã</th>
                            <th className="px-3 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider text-slate-600 border-r border-slate-300">Tên môn</th>
                            <th className="px-3 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-slate-600 border-r border-slate-300">TC</th>
                            <th className="px-3 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-slate-600 border-r border-slate-300">Nhóm</th>
                            <th className="px-3 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-slate-600 border-r border-slate-300">Số lượng</th>
                            <th className="px-3 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider text-slate-600 border-r border-slate-300">Giảng viên</th>
                            <th className="px-3 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-slate-600 border-r border-slate-300">Thứ</th>
                            <th className="px-3 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-slate-600 border-r border-slate-300">Tiết BD</th>
                            <th className="px-3 py-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-slate-600 border-r border-slate-300">Số tiết</th>
                            <th className="px-3 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider text-slate-600">Phòng</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={11} className="px-4 py-10 text-center text-slate-600">
                                    Chưa chọn môn học
                                </td>
                            </tr>
                        )}

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
                                            <tr key={idx} className={`border-b border-slate-300 transition ${checked ? "bg-sky-50/70 hover:bg-sky-100" : "hover:bg-slate-50"}`}>
                                                {idx === 0 && (
                                                    <>
                                                        {/* checkbox */}
                                                        <td rowSpan={rowSpan} className="px-3 py-3 align-top border-r border-slate-300">
                                                            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-sky-600 cursor-pointer" checked={checked} onChange={(e) => onToggle(item, e.target.checked)} />
                                                        </td>

                                                        <td rowSpan={rowSpan} className="px-3 py-2.5 font-mono font-bold text-slate-700 align-top border-r border-slate-300">
                                                            {item.ma_mon}
                                                        </td>
                                                        <td rowSpan={rowSpan} className="px-3 py-2.5 font-medium text-slate-900 text-sm align-top border-r border-slate-300">
                                                            {item.ten_mon}
                                                        </td>
                                                        <td rowSpan={rowSpan} className="px-3 py-2.5 text-center text-slate-700 align-top border-r border-slate-300">
                                                            {item.so_tc}
                                                        </td>
                                                        <td rowSpan={rowSpan} className="px-3 py-2.5 text-center text-slate-700 align-top border-r border-slate-300">
                                                            {item.nhom_to || "--"}
                                                        </td>
                                                        <td rowSpan={rowSpan} className="px-3 py-3 text-center align-top border-r border-slate-300">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.sl_cl === 0 ? "text-red-700" : "text-slate-700"}`}>{`${item.sl_cp - item.sl_cl}/${item.sl_cp}`}</span>
                                                        </td>
                                                    </>
                                                )}

                                                {/* phần thay đổi mỗi dòng */}
                                                <td className="px-3 py-3 whitespace-nowrap text-slate-600 border-r border-slate-300">{tkb.giang_vien || "--"}</td>
                                                <td className="px-3 py-3 text-center text-slate-600 border-r border-slate-300">{tkb.thu || "--"}</td>
                                                <td className="px-3 py-3 text-center font-mono text-xs border-r border-slate-300">{tietBd}</td>
                                                <td className="px-3 py-3 text-center font-mono text-xs border-r border-slate-300">{soTiet}</td>
                                                <td className="px-3 py-3 whitespace-nowrap text-slate-600">{tkb.phong || "--"}</td>
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
