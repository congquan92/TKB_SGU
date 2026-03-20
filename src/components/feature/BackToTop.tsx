/*
 * Copyright (C) 2026  Nguyen Cong Quan
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useSmoothScroll } from "@/hook/useSmoothScroll";

export default function BackToTop() {
    const { scrollToTop } = useSmoothScroll();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 40) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <Button
                    variant="secondary"
                    onClick={() => scrollToTop()}
                    size="icon"
                    className="fixed bottom-5 right-5 z-50 rounded-none shadow-lg hover:shadow-xl transition-all duration-300 border border-black cursor-pointer dark:border-white/30"
                    aria-label="Vá» Ä‘áº§u trang"
                >
                    <ArrowUp className="w-5 h-5" />
                </Button>
            )}
        </>
    );
}

