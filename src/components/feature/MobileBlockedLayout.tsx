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
import { useIsMobile } from "@/hook/useIsMobile";
import { MonitorSmartphone, Smartphone } from "lucide-react";

function MobileBlockedLayout({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 py-12">
                <div className="max-w-md w-full">
                    <div className="bg-white border border-slate-200 shadow-xl p-8 space-y-6">
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-900 opacity-20 blur-xl rounded-full"></div>
                                <div className="relative p-4 rounded-2xl">
                                    <MonitorSmartphone className="w-12 h-12 text-white" strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-center space-y-3">
                            <h1 className="text-2xl font-bold text-slate-900">Chưa hỗ trợ thiết bị di động</h1>
                            <p className="text-sm text-slate-600 leading-relaxed">Ứng dụng hiện chưa tối ưu cho màn hình nhỏ. Vui lòng truy cập từ máy tính để có trải nghiệm tốt nhất.</p>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-200"></div>

                        {/* Info box */}
                        <div className="bg-blue-50 border border-blue-200 p-4 space-y-2">
                            <div className="flex items-start gap-3">
                                <Smartphone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-blue-900">Phiên bản mobile đang phát triển</p>
                                    <p className="text-xs text-blue-700 leading-relaxed">Chúng tôi đang cố gắng hoàn thiện giao diện cho điện thoại. Cảm ơn bạn đã kiên nhẫn!</p>
                                </div>
                            </div>
                        </div>
                        <img src="/wait.gif" alt="Mobile Development" className="w-full h-auto mt-4" />

                        {/* Footer */}
                        <div className="text-center pt-2">
                            <p className="text-xs text-slate-500">
                                Khuyến nghị sử dụng trên màn hình <span className="font-semibold">≥ 768px</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

export default MobileBlockedLayout;
