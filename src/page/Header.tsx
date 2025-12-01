import Donate from "@/components/feature/Donate";
import { FileQuestionMark, GraduationCap, Sparkles } from "lucide-react";
import { time } from "@/data/daiTra.json";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
            <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl">
                        <GraduationCap size={50} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            Thời Khóa Biểu SGU
                            <Sparkles className="w-4 h-4 text-amber-500" />
                        </h1>
                        <p className="text-xs text-slate-500">Sắp xếp thời khóa biểu thông minh</p>
                    </div>
                    <div className="px-3 py-1.5 bg-white border border-red-200 hover:bg-red-50 hover:border-red-300  transition-colors cursor-pointer">{time}</div>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Donate />
                    <Link to="/guide">
                        <Button variant="outline" size="sm" className="gap-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors rounded-none cursor-pointer">
                            <FileQuestionMark className="w-4 h-4" />
                            <span className="text-sm font-medium text-slate-700">Câu hỏi</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
