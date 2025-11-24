import { Heart, Github } from "lucide-react";
import VictorCounter from "@/components/feature/VictorCounter";

export default function Footer() {
    return (
        <footer className="w-full border-t border-slate-200 bg-slate-50 mt-12">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col items-center gap-4 text-sm text-slate-600">
                    {/* Visitor Counter */}
                    <VictorCounter />

                    <div className="flex items-center gap-2">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        <a href="https://www.facebook.com/cucngau.quan/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors font-medium">
                            Quan
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-slate-900 transition-colors flex items-center gap-2">
                            <Github className="w-4 h-4" />
                            <span>GitHub</span>
                        </a>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500">v1.0.0</span>
                    </div>

                    <p className="text-xs text-slate-400 text-center max-w-md">Công cụ hỗ trợ sinh viên sắp xếp thời khóa biểu thông minh, tránh xung đột lịch học</p>
                </div>
            </div>
        </footer>
    );
}
