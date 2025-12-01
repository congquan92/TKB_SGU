import BackToTop from "@/components/feature/BackToTop";
import Timetable from "@/components/Timetable";
import { artAcsii } from "@/lib/artAcsii";
import Footer from "@/page/Footer";
import Header from "@/page/Header";
import { useEffect } from "react";
function App() {
    useEffect(() => {
        artAcsii();
    }, []);
    return (
        <>
            <Header />
            <Timetable />
            <BackToTop />
            <Footer />
        </>
    );
}

export default App;
