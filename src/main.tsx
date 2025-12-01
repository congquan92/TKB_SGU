import App from "@/App";
import { ProgramProvider } from "@/context/ProgramContext";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import MobileBlockedLayout from "@/components/feature/MobileBlockedLayout";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <ProgramProvider>
                <MobileBlockedLayout>
                    <App />
                    <Toaster />
                </MobileBlockedLayout>
            </ProgramProvider>
        </BrowserRouter>
    </StrictMode>
);
