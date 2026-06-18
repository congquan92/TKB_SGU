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
import { ChevronsUpDown, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MonHocItem } from "@/helper/type";

type Props = {
    subjects: MonHocItem[];
    value: MonHocItem | null;
    onChange: (item: MonHocItem | null) => void;
};

export function SearchCourse({ subjects, value, onChange }: Props) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const filtered = React.useMemo(() => {
        if (!search.trim()) return subjects;
        const q = search.toLowerCase();
        return subjects.filter((s) => s.ten.toLowerCase().includes(q) || s.ma.toLowerCase().includes(q));
    }, [subjects, search]);

    return (
        <div className="flex flex-col gap-2 w-full">
            {/* label */}
            <div className="flex items-center justify-between px-1">
                <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">Môn học:</span>
                {value && <span className="text-[9px] font-mono text-primary bg-primary/5 px-2 py-0.5 border border-primary/10">{value.ma}</span>}
            </div>

            <div className="flex items-center gap-2 w-full lg:w-[520px]">
                {/* combobox */}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="flex-1 min-w-0 justify-between border-border bg-background hover:bg-accent text-left h-10 sm:h-9 px-3 shadow-sm cursor-pointer rounded-none">
                            <span className="truncate text-xs sm:text-sm font-medium">{value ? value.ten : "Chọn môn học..."}</span>
                            <ChevronsUpDown className="ml-1 sm:ml-2 h-4 w-4 shrink-0 opacity-40" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[280px] sm:w-[520px] p-0 shadow-xl border-border overflow-hidden rounded-none" align="start" sideOffset={6}>
                        <div className="border-b bg-muted px-3 py-2 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">Danh sách môn học</div>

                        <Command className="rounded-none">
                            <div className="border-b px-3 pt-3 pb-2.5">
                                <CommandInput placeholder="Tìm kiếm..." value={search} onValueChange={setSearch} className="h-9 sm:h-8 text-sm" />
                                <p className="mt-2 text-[9px] sm:text-[10px] text-muted-foreground font-medium font-mono">Tìm thấy {filtered.length} môn</p>
                            </div>

                            <CommandList className="max-h-[300px] sm:max-h-[400px]">
                                <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">Không tìm thấy môn phù hợp</CommandEmpty>
                                <CommandGroup>
                                    <ScrollArea className="h-full">
                                        <div className="max-h-[250px] sm:max-h-[350px]">
                                            {filtered.map((item) => (
                                                <CommandItem
                                                    key={item.ma}
                                                    value={`${item.ma} ${item.ten}`}
                                                    onSelect={() => {
                                                        onChange(item);
                                                        setOpen(false);
                                                        setSearch("");
                                                    }}
                                                    className="flex flex-col items-start gap-1 px-3 py-3 sm:py-2.5 cursor-pointer hover:bg-accent aria-selected:bg-accent border-b border-border/50 last:border-0"
                                                >
                                                    <span className="text-sm font-semibold text-foreground font-sans line-clamp-1">{item.ten}</span>
                                                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">Mã: {item.ma}</span>
                                                </CommandItem>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                {/* nút reset 1 môn */}
                <Button
                    size="icon"
                    variant="outline"
                    className="h-10 w-10 sm:h-9 sm:w-9 shrink-0 hover:bg-accent shadow-sm cursor-pointer rounded-none"
                    onClick={() => {
                        onChange(null);
                        setSearch("");
                    }}
                    title="Làm mới lựa chọn"
                >
                    <RotateCcw className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>
        </div>
    );
}
