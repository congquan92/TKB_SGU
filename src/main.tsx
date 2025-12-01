import App from "@/App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import MobileBlockedLayout from "@/components/feature/MobileBlockedLayout";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <MobileBlockedLayout>
                <App />
                <Toaster />
            </MobileBlockedLayout>
        </BrowserRouter>
    </StrictMode>
);
