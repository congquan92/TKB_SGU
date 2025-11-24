import { useState } from "react";
import { Heart, X, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Donate() {
    const [open, setOpen] = useState(true);

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
                <Button variant="outline" size="sm" className="gap-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors rounded-none cursor-pointer">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span className="text-sm font-medium text-slate-700">Ủng hộ</span>
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
                    <p className="text-sm text-slate-600 leading-relaxed">Nếu bạn thấy công cụ này hữu ích, hãy ủng hộ chúng mình một ly cà phê để duy trì và phát triển thêm nhiều tính năng mới nhé!</p>

                    {/* QR Code */}
                    <div className="flex justify-center py-2">
                        <div className="bg-white p-4 border-2 border-slate-300 inline-block">
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
                    <div className="bg-slate-50 border border-slate-200 p-4 space-y-2">
                        <div className="flex items-center justify-between py-1">
                            <span className="text-xs font-semibold text-slate-600 uppercase">Số tài khoản</span>
                            <span className="text-sm font-mono font-bold text-slate-900">{accountNumber}</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            <span className="text-xs font-semibold text-slate-600 uppercase">Chủ tài khoản</span>
                            <span className="text-sm font-bold text-slate-900">{accountName}</span>
                        </div>
                    </div>

                    {/* Thank you message */}
                    <div className="bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
                        <Heart className="w-4 h-4 text-amber-600 fill-amber-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-800 leading-relaxed">Mọi đóng góp của bạn đều giúp chúng mình có động lực để tiếp tục phát triển và cải thiện công cụ. Cảm ơn bạn rất nhiều! </p>
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
