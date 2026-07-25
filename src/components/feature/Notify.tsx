import { useState } from "react";
import { Bell, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Notify() {
    const [open, setOpen] = useState(true);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="relative size-8 rounded-none transition-all duration-300 
                    border-rose-200 bg-white text-rose-500
                    hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300
                    dark:bg-zinc-950 dark:border-rose-900/40 dark:text-rose-400
                    dark:hover:bg-rose-950/30 dark:hover:border-rose-700 dark:hover:text-rose-300 cursor-pointer"
                    title="Thông báo"
                >
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md rounded-none">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Bell className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        Thông báo
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Khu vực để viết thông báo */}
                    <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-4 flex flex-col gap-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 border-b border-rose-200/60 dark:border-rose-900/50 pb-2">
                            <div className="p-1.5 bg-rose-200/50 dark:bg-rose-900/50 rounded-full shrink-0">
                                <Info className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                            </div>
                            <strong className="font-semibold text-rose-800 dark:text-rose-200 text-base">Thông báo cập nhật</strong>
                        </div>
                        <div className="text-sm text-rose-800 dark:text-rose-200 leading-relaxed space-y-3">
                            <p>
                                Website hiện tại vẫn là <strong>Học kỳ 3 - Năm học 2025 - 2026</strong>, mọi người có thể xem trước Thời khóa biểu của <strong>Học kỳ 1 - Năm học 2026 - 2027 </strong>
                                <a
                                    href="https://daotao.sgu.edu.vn/index.php/thong-bao/so-tay-dang-ki-mon-hoc/so-tay-dang-ki-mon-hoc-hk1-nh-2026-2027"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 underline decoration-rose-300 dark:decoration-rose-700 underline-offset-2 transition-colors"
                                >
                                    tại đây.
                                </a>
                            </p>
                            <p className="bg-rose-100/50 dark:bg-rose-900/20 p-2 rounded text-xs text-rose-700 dark:text-rose-300 italic border-l-2 border-rose-400">Website sẽ sớm được cập nhật dữ liệu mới nhất. Xin cảm ơn mọi người 💖</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="gap-2 cursor-pointer rounded-none border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-rose-900/50 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
                    >
                        <X className="w-4 h-4" />
                        Đóng
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
