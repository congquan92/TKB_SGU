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
import * as React from "react";
import { ChevronsUpDown, RotateCcw, Search, X, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useIsMobile } from "@/hook/useIsMobile";
import type { MonHocItem } from "@/helper/type";

type Props = {
    subjects: MonHocItem[];
    value: MonHocItem | null;
    onChange: (item: MonHocItem | null) => void;
};

export function SearchCourse({ subjects, value, onChange }: Props) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const isMobile = useIsMobile();

    const filtered = React.useMemo(() => {
        if (!search.trim()) return subjects;
        const q = search.toLowerCase();
        return subjects.filter((s) => s.ten.toLowerCase().includes(q) || s.ma.toLowerCase().includes(q));
    }, [subjects, search]);

    return (
        <div className="flex items-center gap-2 sm:gap-2.5 w-full">
            {/* label */}
            <span className="text-label font-bold text-muted-foreground shrink-0 uppercase tracking-wider font-mono text-xs hidden sm:inline">Môn học:</span>

            {/* Combobox Trigger: Responsive Popover on Desktop, Bottom Sheet Dialog on Mobile */}
            {isMobile ? (
                <>
                    <Button
                        variant="outline"
                        role="combobox"
                        onClick={() => setOpen(true)}
                        className="flex-1 min-w-0 max-w-xl justify-between border-border bg-background hover:bg-accent text-left h-9 px-3 shadow-sm cursor-pointer rounded-none active:scale-[0.99] transition-transform"
                    >
                        <span className="truncate text-sm font-medium">{value ? value.ten : "Chọn môn học..."}</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
                    </Button>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent
                            showCloseButton={false}
                            className="fixed inset-x-0 bottom-0 top-auto translate-x-0 translate-y-0 w-full max-w-full max-h-[85dvh] h-[80dvh] flex flex-col rounded-t-2xl sm:rounded-lg border-t border-border bg-background p-0 shadow-2xl overflow-hidden focus:outline-none pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] gap-0"
                        >
                            {/* Drag Indicator */}
                            <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30 mx-auto mt-2.5 mb-1 shrink-0" />

                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0 bg-muted/20">
                                <div>
                                    <DialogTitle className="text-sm font-bold uppercase tracking-wider font-mono text-foreground">
                                        Chọn môn học
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-muted-foreground font-mono mt-0.5">
                                        Tìm thấy {filtered.length} môn học
                                    </DialogDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                                    onClick={() => setOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Đóng</span>
                                </Button>
                            </div>

                            {/* Sticky Search Input (Font size >= 16px to prevent iOS Safari auto-zoom) */}
                            <div className="p-3 border-b border-border bg-muted/10 shrink-0">
                                <div className="relative flex items-center">
                                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Tìm kiếm môn học, mã HP..."
                                        className="w-full h-10 pl-9 pr-9 bg-background border border-border rounded-none text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition font-sans"
                                        autoComplete="off"
                                        autoCorrect="off"
                                        spellCheck="false"
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => setSearch("")}
                                            className="absolute right-3 p-1 rounded-full text-muted-foreground hover:text-foreground cursor-pointer active:scale-95"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                            <span className="sr-only">Xóa tìm kiếm</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Course List */}
                            <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-border/60">
                                {filtered.length === 0 ? (
                                    <div className="py-12 text-center text-sm text-muted-foreground font-mono">
                                        Không tìm thấy môn phù hợp
                                    </div>
                                ) : (
                                    filtered.map((item) => {
                                        const isSelected = value?.ma === item.ma;
                                        return (
                                            <button
                                                key={item.ma}
                                                type="button"
                                                onClick={() => {
                                                    onChange(item);
                                                    setOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition active:bg-muted cursor-pointer ${
                                                    isSelected ? "bg-primary/10" : "hover:bg-muted/40"
                                                }`}
                                            >
                                                <div className="flex flex-col gap-1 min-w-0 pr-3">
                                                    <span className={`text-sm font-semibold truncate ${isSelected ? "text-primary" : "text-foreground"}`}>
                                                        {item.ten}
                                                    </span>
                                                    <span className="text-label text-muted-foreground font-mono text-xs">
                                                        Mã: {item.ma}
                                                    </span>
                                                </div>
                                                {isSelected && (
                                                    <Check className="h-4 w-4 text-primary shrink-0 ml-2" />
                                                )}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </>
            ) : (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="flex-1 min-w-0 max-w-xl justify-between border-border bg-background hover:bg-accent text-left h-9 px-3 shadow-sm cursor-pointer rounded-none">
                            <span className="truncate text-sm font-medium">{value ? value.ten : "Chọn môn học..."}</span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[min(520px,calc(100vw-2rem))] p-0 shadow-xl border-border overflow-hidden rounded-none" align="start" sideOffset={4}>
                        <div className="border-b bg-muted px-3 py-2.5 text-label font-bold text-muted-foreground uppercase tracking-wider font-mono">Danh sách môn học</div>

                        <Command>
                            <div className="border-b px-3 pt-2.5 pb-2">
                                <CommandInput placeholder="Tìm kiếm môn học, mã HP" value={search} onValueChange={setSearch} className="h-8 text-sm" />
                                <p className="mt-1.5 text-label text-muted-foreground font-medium font-mono">Tìm thấy {filtered.length} môn học</p>
                            </div>

                            <CommandList>
                                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">Không tìm thấy môn phù hợp</CommandEmpty>

                                <ScrollArea className="max-h-72 font-mono">
                                    <CommandGroup>
                                        {filtered.map((item) => (
                                            <CommandItem
                                                key={item.ma}
                                                value={`${item.ma} ${item.ten}`}
                                                onSelect={() => {
                                                    onChange(item);
                                                    setOpen(false);
                                                }}
                                                className="flex flex-col items-start gap-1 px-3 py-2.5 cursor-pointer hover:bg-accent"
                                            >
                                                <span className="text-sm font-semibold text-foreground font-sans">{item.ten}</span>
                                                <span className="text-label text-muted-foreground font-medium">Mã: {item.ma}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </ScrollArea>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            )}

            {/* nút reset 1 môn */}
            <Button size="icon" variant="outline" className="h-9 w-9 hover:bg-accent shadow-sm cursor-pointer rounded-none" onClick={() => onChange(null)} title="Làm mới lựa chọn">
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
            </Button>
        </div>
    );
}
