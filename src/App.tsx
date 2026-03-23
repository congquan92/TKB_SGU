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
import BackToTop from "@/components/feature/BackToTop";
import Timetable from "@/components/Timetable";
import { artAcsii } from "@/lib/artAcsii";
import Footer from "@/page/Footer";
import Header from "@/page/Header";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
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
            <Analytics />
        </>
    );
}

export default App;
