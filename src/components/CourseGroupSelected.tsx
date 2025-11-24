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
        <div className="w-full bg-white">
            <div className="uppercase text-base tracking-wide font-bold m-5 text-slate-800">Danh sách nhóm tổ đã chọn</div>

            {/* Header */}
            <div className="grid grid-cols-[120px_1fr_100px_120px_100px_80px] font-bold text-sm border border-slate-300 bg-slate-50">
                <div className="px-6 py-3 border-r border-slate-300 text-slate-700 uppercase text-xs tracking-wider">Mã</div>
                <div className="px-6 py-3 border-r border-slate-300 text-slate-700 uppercase text-xs tracking-wider">Tên môn</div>
                <div className="px-6 py-3 border-r border-slate-300 text-center text-slate-700 uppercase text-xs tracking-wider">Nhóm</div>
                <div className="px-6 py-3 border-r border-slate-300 text-center text-slate-700 uppercase text-xs tracking-wider">Số lượng</div>
                <div className="px-6 py-3 border-r border-slate-300 text-center text-slate-700 uppercase text-xs tracking-wider">Số TC</div>
                <div className="px-6 py-3 text-center text-slate-700 uppercase text-xs tracking-wider">Xóa</div>
            </div>

            {/* Rows */}
            {data.length === 0 ? (
                <div className="px-6 py-10 text-center text-slate-600">Chưa có nhóm tổ nào được chọn</div>
            ) : (
                data.map((item) => (
                    <div key={item.id_to_hoc} className="grid grid-cols-[120px_1fr_100px_120px_100px_80px] text-sm border border-t-0 border-slate-300 hover:bg-slate-50 transition">
                        <div className="px-6 py-3 border-r border-slate-300 font-medium text-xs text-slate-700">{item.ma_mon}</div>
                        <div className="px-6 py-3 border-r border-slate-300 font-medium text-slate-700">{item.ten_mon}</div>
                        <div className="px-6 py-3 border-r border-slate-300 text-center font-medium text-slate-700">{item.nhom_to || "--"}</div>
                        <div className="px-6 py-3 border-r border-slate-300 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.sl_cl === 0 ? "text-red-700" : "text-slate-700"}`}>{`${item.sl_cp - item.sl_cl}/${item.sl_cp}`}</span>
                        </div>
                        <div className="px-6 py-3 border-r border-slate-300 text-center font-bold text-slate-700">{item.so_tc}</div>
                        <div className="px-6 py-3 flex justify-center">
                            <Button variant="outline" className="text-red-500 hover:text-red-700 transition cursor-pointer rounded-none" title="Xóa nhóm tổ" onClick={() => onRemove(item.id_to_hoc)}>
                                <Trash2 size={18} />
                            </Button>
                        </div>
                    </div>
                ))
            )}

            {/* Footer */}
            {data.length > 0 && (
                <div className="grid grid-cols-[120px_1fr_100px_120px_100px_80px] font-semibold border border-t-0 bg-slate-50 border-slate-300 ">
                    <div className="col-span-4 px-6 py-3 border-r border-slate-300 text-slate-700">Tổng số tín chỉ</div>
                    <div className="px-6 py-3 border-r border-slate-300 text-center font-bold text-slate-700">{totalTC}</div>
                    <div className="px-6 py-3"></div>
                </div>
            )}
        </div>
    );
}
