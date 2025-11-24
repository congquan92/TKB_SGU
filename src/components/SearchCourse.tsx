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
        <div className="flex items-center gap-2.5">
            {/* label */}
            <span className="text-xs font-bold text-slate-700 min-w-[65px] uppercase tracking-wide">Môn học:</span>

            {/* combobox */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-[min(520px,90vw)] justify-between border-slate-300 bg-white hover:bg-slate-50 text-left h-9 px-3 shadow-sm cursor-pointer">
                        <span className="truncate text-sm font-medium">{value ? value.ten : "Chọn môn học..."}</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[min(520px,90vw)] p-0 shadow-xl border-slate-300 overflow-hidden" align="start" sideOffset={4}>
                    <div className="border-b bg-linear-to-r from-slate-50 to-white px-3 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Danh sách môn học</div>

                    <Command>
                        <div className="border-b px-3 pt-2.5 pb-2">
                            <CommandInput placeholder="Tìm kiếm môn học, mã HP" value={search} onValueChange={setSearch} className="h-8 text-sm" />
                            <p className="mt-1.5 text-[10px] text-slate-500 font-medium">Tìm thấy {filtered.length} môn học</p>
                        </div>

                        <CommandList>
                            <CommandEmpty className="py-6 text-center text-sm text-slate-500">Không tìm thấy môn phù hợp</CommandEmpty>

                            <ScrollArea className="max-h-72">
                                <CommandGroup>
                                    {filtered.map((item) => (
                                        <CommandItem
                                            key={item.ma}
                                            value={`${item.ma} ${item.ten}`}
                                            onSelect={() => {
                                                onChange(item);
                                                setOpen(false);
                                            }}
                                            className="flex flex-col items-start gap-1 px-3 py-2.5 cursor-pointer hover:bg-slate-50"
                                        >
                                            <span className="text-sm font-semibold text-slate-900">{item.ten}</span>
                                            <span className="text-[11px] text-slate-500 font-medium">Mã: {item.ma}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </ScrollArea>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* nút reset 1 môn */}
            <Button size="icon" variant="outline" className="h-9 w-9 hover:bg-slate-100 shadow-sm cursor-pointer" onClick={() => onChange(null)} title="Làm mới lựa chọn">
                <RotateCcw className="h-4 w-4 text-slate-600" />
            </Button>
        </div>
    );
}
