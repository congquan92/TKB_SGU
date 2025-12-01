import { createContext, useContext, useState, type ReactNode } from "react";
import daiTraData from "@/data/daiTra.json";
import clCaoData from "@/data/clCao.json";
import type { SguTimetableJson } from "@/helper/type";

type ProgramType = "daiTra" | "clCao";

interface ProgramContextType {
    programType: ProgramType;
    setProgramType: (type: ProgramType) => void;
    currentData: SguTimetableJson;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export function ProgramProvider({ children }: { children: ReactNode }) {
    const [programType, setProgramType] = useState<ProgramType>("daiTra");

    const currentData = (programType === "daiTra" ? daiTraData : clCaoData) as SguTimetableJson;

    return (
        <ProgramContext.Provider value={{ programType, setProgramType, currentData }}>
            {children}
        </ProgramContext.Provider>
    );
}

export function useProgram() {
    const context = useContext(ProgramContext);
    if (context === undefined) {
        throw new Error("useProgram must be used within a ProgramProvider");
    }
    return context;
}
