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
import { useState, useEffect } from "react";
import { getVNDate, getVisitorCount, incrementVisitorCount, getVisitorStats, getTodayVisitorCount } from "@/lib/visitorService";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { VisitorData } from "@/lib/visitorService";

export const useVisitorCounter = () => {
    const [visitorCount, setVisitorCount] = useState<number>(0);
    const [todayCount, setTodayCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<VisitorData | null>(null);

    // Khởi tạo và tăng visitor count + Real-time listener
    useEffect(() => {
        let unsubscribe: (() => void) | null = null;
        let hasInitialized = false;

        const initializeVisitor = async () => {
            if (hasInitialized) return; // Prevent multiple initialization
            hasInitialized = true;

            try {
                setIsLoading(true);
                setError(null);

                console.log("Initializing visitor counter...");

                // Tăng count nếu là visitor mới (chỉ 1 lần)
                const newCount = await incrementVisitorCount();
                setVisitorCount(newCount);

                // Lấy stats chi tiết
                const visitorStats = await getVisitorStats();
                setStats(visitorStats);

                // Lấy số lượt xem hôm nay
                const todayVisits = await getTodayVisitorCount();
                setTodayCount(todayVisits);
            } catch (err) {
                console.error("Error initializing visitor:", err);
                setError("Không thể tải số lượt truy cập");

                // Auto-retry after 3 seconds
                setTimeout(() => {
                    refreshCount();
                }, 3000);

                // Fallback: chỉ lấy count hiện tại
                try {
                    const currentCount = await getVisitorCount();
                    setVisitorCount(currentCount);
                    const todayVisits = await getTodayVisitorCount();
                    setTodayCount(todayVisits);
                } catch (fallbackErr) {
                    console.error("Fallback failed:", fallbackErr);
                    setVisitorCount(0);
                    setTodayCount(0);
                }
            } finally {
                setIsLoading(false);
            }
        };

        // Initialize first
        initializeVisitor();

        // Setup real-time listener (separate from initialization)
        try {
            const docRef = doc(db, "stats", "visitors");
            unsubscribe = onSnapshot(
                docRef,
                (doc) => {
                    if (doc.exists() && hasInitialized) {
                        const data = doc.data() as VisitorData;
                        console.log("Real-time update: New count =", data.count);
                        setVisitorCount(data.count);
                        setStats(data);

                        // Cập nhật today count
                        const today = getVNDate();
                        setTodayCount(data.dailyVisits?.[today] || 0);
                    }
                },
                (error) => {
                    console.error("Real-time listener error:", error);
                    setError("Real-time sync failed");
                },
            );
        } catch (error) {
            console.error("Failed to setup real-time listener:", error);
        }

        // Cleanup listener on unmount
        return () => {
            if (unsubscribe) {
                console.log("Cleaning up real-time listener");
                unsubscribe();
            }
        };
    }, []);

    // Refresh count (không tăng)
    const refreshCount = async () => {
        try {
            setError(null);
            const currentCount = await getVisitorCount();
            setVisitorCount(currentCount);

            const visitorStats = await getVisitorStats();
            setStats(visitorStats);

            const todayVisits = await getTodayVisitorCount();
            setTodayCount(todayVisits);
        } catch (err) {
            console.error("Error refreshing count:", err);
            setError("Không thể cập nhật số lượt truy cập");
        }
    };

    return {
        visitorCount,
        todayCount,
        isLoading,
        error,
        stats,
        refreshCount,
    };
};
