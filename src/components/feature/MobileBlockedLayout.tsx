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
    // const isMobile = useIsMobile();
    // Vô hiệu hóa việc chặn mobile để người dùng có thể trải nghiệm giao diện mới
    return <>{children}</>;
}

export default MobileBlockedLayout;
