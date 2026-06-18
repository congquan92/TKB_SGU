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
import { useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface TimetableVersion {
    id: string;
    name: string;
    chosenIds: string[];
    createdAt: number;
}

const MAX_VERSIONS = 5;

interface TimetableTabsProps {
    activeVersionId: string | null;
    onVersionChange: (versionId: string) => void;
    onVersionsUpdate: (versions: TimetableVersion[]) => void;
    versions: TimetableVersion[];
}

export default function TimetableTabs({ activeVersionId, onVersionChange, onVersionsUpdate, versions }: TimetableTabsProps) {
    // Đảm bảo có active version
    useEffect(() => {
        if (!activeVersionId && versions.length > 0) {
            onVersionChange(versions[0].id);
        }
    }, [activeVersionId, versions, onVersionChange]);

    const handleAddVersion = () => {
        if (versions.length >= MAX_VERSIONS) {
            toast.error(`Tối đa ${MAX_VERSIONS} phiên bản!`);
            return;
        }

        // Tìm số thứ tự chưa được sử dụng
        const usedNumbers = versions.map((v) => {
            const match = v.name.match(/TKB_(\d+)/);
            return match ? parseInt(match[1]) : 0;
        });

        let newNumber = 1;
        while (usedNumbers.includes(newNumber)) {
            newNumber++;
        }

        const newVersion: TimetableVersion = {
            id: `v-${Date.now()}`,
            name: `TKB_${newNumber}`,
            chosenIds: [],
            createdAt: Date.now(),
        };

        const newVersions = [...versions, newVersion];
        onVersionsUpdate(newVersions);
        onVersionChange(newVersion.id);
        toast.success("Đã tạo phiên bản mới!");
    };

    const handleDeleteVersion = (versionId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (versions.length === 1) {
            toast.error("Không thể xóa phiên bản cuối cùng!");
            return;
        }

        const newVersions = versions.filter((v) => v.id !== versionId);
        onVersionsUpdate(newVersions);

        // Nếu đang active version bị xóa, chuyển sang version đầu tiên
        if (activeVersionId === versionId) {
            onVersionChange(newVersions[0].id);
        }

        toast.success("Đã xóa phiên bản!");
    };

    return (
        <div className="bg-background border-b border-border">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-2 overflow-x-auto py-2">
                    {versions.map((version) => {
                        const isActive = version.id === activeVersionId;
                        const courseCount = version.chosenIds.length;

                        return (
                            <div
                                key={version.id}
                                onClick={() => onVersionChange(version.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 border-b-2 cursor-pointer whitespace-nowrap
                                    transition-colors group relative font-mono text-label
                                    ${isActive ? "border-primary bg-primary/10 text-primary" : "border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"}
                                `}
                            >
                                <span className="font-medium uppercase tracking-wider">{version.name}</span>
                                {courseCount > 0 && <span className="px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground">{courseCount}</span>}
                                <button onClick={(e) => handleDeleteVersion(version.id, e)} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:bg-destructive/10 rounded-sm p-0.5 cursor-pointer" title="Xóa phiên bản">
                                    <X size={14} className="text-destructive" />
                                </button>
                            </div>
                        );
                    })}

                    {versions.length < MAX_VERSIONS && (
                        <Button variant="ghost" size="sm" onClick={handleAddVersion} className="gap-2 rounded-none cursor-pointer" title={`Thêm phiên bản (${versions.length}/${MAX_VERSIONS})`}>
                            <Plus size={16} />
                            <span className="text-sm">Thêm phiên bản</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
