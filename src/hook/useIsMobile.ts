import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => {
            const byWidth = window.innerWidth < breakpoint;

            const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
            const byUA = /android|iphone|ipad|ipod|mobile/i.test(ua);

            setIsMobile(byWidth || byUA);
        };

        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, [breakpoint]);

    return isMobile;
}
