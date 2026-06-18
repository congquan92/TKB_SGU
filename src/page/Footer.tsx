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
import { Heart, Github } from "lucide-react"; // Thêm icon CalendarClock cho sinh động
import VictorCounter from "@/components/feature/VictorCounter";

export default function Footer() {
    return (
        <footer className="w-full border-t border-border/40 bg-muted/20 backdrop-blur-sm mt-12">
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="flex flex-col items-center gap-6 text-sm">
                    {/*Giới thiệu */}
                    <div className="text-center space-y-2">
                        <p className="text-muted-foreground max-w-lg leading-relaxed">Công cụ hỗ trợ sinh viên sắp xếp thời khóa biểu thông minh, tránh xung đột lịch học của sinh viên</p>
                    </div>

                    {/* (Copyright, Version, Counter) */}
                    <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl gap-4 text-label text-muted-foreground mt-2 pt-4 border-t font-mono">
                        <span>© 2025 SVSGU - K23 </span>

                        <div className="opacity-80 scale-90">
                            <VictorCounter />
                        </div>

                        <div className="flex items-center gap-2">
                            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors group">
                                <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </a>
                            <span className="bg-muted px-2 py-0.5 rounded-sm">v2.1.0</span>
                        </div>
                    </div>

                    {/* Auhtor */}
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-label text-muted-foreground border-t pt-4 font-mono uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                            <span>Mọi thắc mắc xin hãy liên hệ qua nhà phát triển </span>
                            <a href="https://www.facebook.com/cucngau.quan/" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-primary transition-colors decoration-primary/50 underline underline-offset-4">
                                Quan
                            </a>
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
