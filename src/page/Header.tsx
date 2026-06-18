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
import Donate from "@/components/feature/Donate";
import { GraduationCap, Sparkles } from "lucide-react";
import { time } from "@/data/dsCustom.json";
import { ModeToggle } from "@/components/theme/mode-toggle";
export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80 transform-gpu will-change-transform">
            <div className="mx-auto max-w-7xl px-4 h-[60px] sm:h-[65px] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center shrink-0">
                        <GraduationCap size={30} className="sm:w-[38px] sm:h-[38px] text-primary" />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                        <h1 className="text-sm sm:text-lg font-bold flex items-center gap-1.5 leading-tight text-foreground truncate">
                            Thời Khóa Biểu SGU
                            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 hidden xs:block" />
                        </h1>
                        <p className="text-[9px] sm:text-xs text-muted-foreground font-medium uppercase tracking-tight sm:tracking-normal truncate">Sắp xếp thời khóa biểu thông minh</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <div className="hidden md:block shrink-0 px-2 py-1 bg-muted/50 border border-border font-mono text-xs">Cập nhật lúc: {time}</div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <Donate />
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}
