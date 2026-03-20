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
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0  transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    );
}
