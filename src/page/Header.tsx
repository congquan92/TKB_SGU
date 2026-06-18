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
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
            <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md">
                        <GraduationCap size={50} />
                    </div>
                    <div>
                        <h1 className="text-h1 flex items-center gap-2">
                            Thời Khóa Biểu SGU
                            <Sparkles className="w-4 h-4 text-primary" />
                        </h1>
                        <p className="text-label text-muted-foreground uppercase tracking-wider">Sắp xếp thời khóa biểu thông minh</p>
                    </div>
                    <div className="px-3 py-1.5 bg-card border border-border hover:bg-muted transition-colors cursor-pointer font-mono text-xs">{time}</div>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Donate />
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
