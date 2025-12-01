import Donate from "@/components/feature/Donate";
import { GraduationCap, Sparkles } from "lucide-react";
import { time } from "@/data/dsCustom.json";
import { ModeToggle } from "@/components/theme/mode-toggle";
export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
            <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl">
                        <GraduationCap size={50} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                            Thời Khóa Biểu SGU
                            <Sparkles className="w-4 h-4 text-amber-500" />
                        </h1>
                        <p className="text-xs text-muted-foreground">Sắp xếp thời khóa biểu thông minh</p>
                    </div>
                    <div className="px-3 py-1.5 bg-card border border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30  transition-colors cursor-pointer">{time}</div>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Donate />
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
