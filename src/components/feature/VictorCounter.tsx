import { useVisitorCounter } from "@/hook/useVictorCounter";
import { Eye, LoaderCircle } from "lucide-react";

export default function VictorCounter() {
    const { visitorCount, todayCount, isLoading, error } = useVisitorCounter();

    if (error) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 text-xs">
                <Eye size={14} />
                <span>Lỗi (đang thử lại...)</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer">
            <div className="flex items-center gap-1.5">
                <Eye size={16} className="text-slate-500" />
                {isLoading ? (
                    <span className="text-sm font-semibold text-slate-400">
                        <LoaderCircle size={16} className="animate-spin" />
                    </span>
                ) : (
                    <span className="text-sm font-bold text-slate-900">{visitorCount.toLocaleString()}</span>
                )}
                <span className="text-xs text-slate-500 font-medium">lượt xem</span>
            </div>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-1.5">
                {isLoading ? (
                    <span className="text-sm font-semibold text-slate-400">
                        <LoaderCircle size={16} className="animate-spin" />
                    </span>
                ) : (
                    <span className="text-sm font-bold text-blue-600">{todayCount.toLocaleString()}</span>
                )}
                <span className="text-xs text-slate-500 font-medium">hôm nay</span>
            </div>
        </div>
    );
}
