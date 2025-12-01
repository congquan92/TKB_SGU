import { useVisitorCounter } from "@/hook/useVictorCounter";
import { Eye, LoaderCircle } from "lucide-react";

export default function VictorCounter() {
    const { visitorCount, todayCount, isLoading, error } = useVisitorCounter();

    if (error) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                <Eye size={14} />
                <span>Lỗi (đang thử lại...)</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 px-3 py-1.5 bg-card border border-border hover:border-foreground/20 transition-colors cursor-pointer">
            <div className="flex items-center gap-1.5">
                <Eye size={16} className="text-muted-foreground" />
                {isLoading ? (
                    <span className="text-sm font-semibold text-muted-foreground/50">
                        <LoaderCircle size={16} className="animate-spin" />
                    </span>
                ) : (
                    <span className="text-sm font-bold text-foreground">{visitorCount.toLocaleString()}</span>
                )}
                <span className="text-xs text-muted-foreground font-medium">lượt xem</span>
            </div>

            <div className="h-4 w-px bg-border" />

            <div className="flex items-center gap-1.5">
                {isLoading ? (
                    <span className="text-sm font-semibold text-muted-foreground/50">
                        <LoaderCircle size={16} className="animate-spin" />
                    </span>
                ) : (
                    <span className="text-sm font-bold text-primary">{todayCount.toLocaleString()}</span>
                )}
                <span className="text-xs text-muted-foreground font-medium">hôm nay</span>
            </div>
        </div>
    );
}
