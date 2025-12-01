import App from "@/App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import MobileBlockedLayout from "@/components/feature/MobileBlockedLayout";
import { ThemeProvider } from "@/components/theme/theme-provider";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="theme">
            <MobileBlockedLayout>
                <App />
                <Toaster />
            </MobileBlockedLayout>
        </ThemeProvider>
    </StrictMode>
);
