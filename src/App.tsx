import BackToTop from "@/components/feature/BackToTop";
import Guide from "@/components/feature/Guide";
import Timetable from "@/components/Timetable";
import Footer from "@/page/Footer";
import Header from "@/page/Header";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/guide" element={<Guide />} />
                <Route path="/" element={<Timetable />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <BackToTop />
            <Footer />
        </>
    );
}

export default App;
