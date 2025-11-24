import { doc, getDoc, setDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface VisitorData {
    count: number;
    lastUpdated: unknown;
    dailyVisits?: Record<string, number>;
}

const VISITOR_DOC = "stats";
const VISITOR_STATS = "visitors";
const COOLDOWN_KEY = "visitor_last_increment";
const COOLDOWN_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Kiểm tra xem có nên tăng visitor count không (cooldown 30 phút)
export const shouldIncrementVisitor = (): boolean => {
    try {
        const lastIncrement = localStorage.getItem(COOLDOWN_KEY);

        if (!lastIncrement) {
            return true;
        }

        const lastTime = parseInt(lastIncrement, 10);
        const now = Date.now();

        // Nếu đã qua 30 phút thì cho phép tăng
        return now - lastTime >= COOLDOWN_DURATION;
    } catch {
        // Nếu localStorage không khả dụng, vẫn cho phép tăng
        return true;
    }
};

// Lưu thời gian increment vào localStorage
const saveIncrementTime = (): void => {
    try {
        localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
    } catch {
        // Ignore localStorage errors
    }
};

// Lấy số lượng visitor hiện tại
export const getVisitorCount = async (): Promise<number> => {
    try {
        const docRef = doc(db, VISITOR_DOC, VISITOR_STATS);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data() as VisitorData;
            return data.count || 0;
        }

        return 0;
    } catch (error) {
        console.error("Error getting visitor count:", error);
        throw error;
    }
};

// Tăng visitor count (chỉ gọi nếu đã qua 30 phút từ lần cuối)
export const incrementVisitorCount = async (): Promise<number> => {
    try {
        const docRef = doc(db, VISITOR_DOC, VISITOR_STATS);

        // Kiểm tra cooldown trước khi tăng
        if (!shouldIncrementVisitor()) {
            console.log("Cooldown active, not incrementing visitor count");
            // Chỉ lấy count hiện tại mà không tăng
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data() as VisitorData;
                return data.count || 0;
            }
            return 0;
        }

        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        // Check if document exists
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            // Initialize document
            await setDoc(docRef, {
                count: 1,
                lastUpdated: serverTimestamp(),
                dailyVisits: {
                    [today]: 1,
                },
            });
            saveIncrementTime();
            return 1;
        }

        // Increment count và daily visits
        await setDoc(
            docRef,
            {
                count: increment(1),
                lastUpdated: serverTimestamp(),
                [`dailyVisits.${today}`]: increment(1),
            },
            { merge: true }
        );

        // Lưu thời gian increment
        saveIncrementTime();

        // Return updated count
        const updatedDoc = await getDoc(docRef);
        const data = updatedDoc.data() as VisitorData;
        return data.count || 1;
    } catch (error) {
        console.error("Error incrementing visitor count:", error);
        throw error;
    }
};

// Lấy stats chi tiết
export const getVisitorStats = async (): Promise<VisitorData | null> => {
    try {
        const docRef = doc(db, VISITOR_DOC, VISITOR_STATS);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as VisitorData;
        }

        return null;
    } catch (error) {
        console.error("Error getting visitor stats:", error);
        throw error;
    }
};

// Lấy số lượt xem hôm nay (theo múi giờ Việt Nam)
export const getTodayVisitorCount = async (): Promise<number> => {
    try {
        const docRef = doc(db, VISITOR_DOC, VISITOR_STATS);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return 0;
        }

        const data = docSnap.data() as VisitorData;

        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        return data.dailyVisits?.[today] || 0;
    } catch (error) {
        console.error("Error getting today visitor count:", error);
        throw error;
    }
};
