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
import { useState } from "react";
import { Heart, X, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Donate() {
    const [open, setOpen] = useState(false);

    // VietQR parameters
    const bankCode = "970415";
    const accountNumber = "104875883096";
    const accountName = "NGUYEN CONG QUAN";
    const description = "Ung ho TKB SGU";

    // VietQR URL
    const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:hover:bg-red-950/50 dark:hover:border-red-800 transition-colors rounded-none cursor-pointer">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span className="text-sm font-medium text-foreground">Ủng hộ</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md rounded-none">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Coffee className="w-5 h-5 text-amber-600" />
                        Ủng hộ dự án
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">Nếu bạn thấy công cụ này hữu ích, hãy ủng hộ chúng mình một ly cà phê để duy trì và phát triển thêm nhiều tính năng mới nhé!</p>

                    {/* QR Code */}
                    <div className="flex justify-center py-2">
                        <div className="bg-white p-4 border-2 border-border inline-block rounded-lg">
                            <img
                                src={qrUrl}
                                alt="VietQR Code"
                                className="w-80 h-80 object-contain"
                                onError={(e) => {
                                    e.currentTarget.src = "/qr.png";
                                }}
                            />
                        </div>
                    </div>

                    {/* Bank Info */}
                    <div className="bg-muted border border-border p-4 space-y-2 rounded-md">
                        <div className="flex items-center justify-between py-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Số tài khoản</span>
                            <span className="text-sm font-mono font-bold text-foreground">{accountNumber}</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Chủ tài khoản</span>
                            <span className="text-sm font-bold text-foreground">{accountName}</span>
                        </div>
                    </div>

                    {/* Thank you message */}
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3 flex items-start gap-2 rounded-md">
                        <Heart className="w-4 h-4 text-amber-600 dark:text-amber-500 fill-amber-600 dark:fill-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">Mọi đóng góp của bạn đều giúp chúng mình có động lực để tiếp tục phát triển và cải thiện công cụ. Cảm ơn bạn rất nhiều! </p>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setOpen(false)} className="gap-2 cursor-pointer rounded-none">
                        <X className="w-4 h-4" />
                        Đóng
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
