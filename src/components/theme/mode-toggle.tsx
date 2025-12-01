import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    const cycleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <Button
            variant="outline"
            size="icon"
            className="relative size-8 rounded-none transition-all duration-300 
            border-rose-200 bg-white text-rose-500
            hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300
            dark:bg-zinc-950 dark:border-rose-900/40 dark:text-rose-400
            dark:hover:bg-rose-950/30 dark:hover:border-rose-700 dark:hover:text-rose-300 cursor-pointer"
            onClick={cycleTheme}
            title={`Giao diện: ${theme === "dark" ? "Tối" : "Sáng"}`}
        >
            {/* Hiệu ứng chuyển đổi icon mượt mà (xoay và phóng to/nhỏ) */}
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0  transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    );
}
