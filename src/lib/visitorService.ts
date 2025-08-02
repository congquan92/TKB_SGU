import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';
import { fallbackVisitorService } from './fallbackService';

export interface VisitorData {
  count: number;
  lastUpdated: string;
  dailyVisits: { [date: string]: number };
}

// Tạo fingerprint duy nhất cho mỗi visitor (với cache)
export const generateFingerprint = (): string => {
  // Cache fingerprint để tránh tạo lại nhiều lần
  const cached = sessionStorage.getItem('tkb_fingerprint_cache');
  if (cached) {
    return cached;
  }

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('TKB Visitor', 2, 2);
    }
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
      canvas: ctx ? canvas.toDataURL() : 'no-canvas',
      timestamp: Math.floor(Date.now() / 1000 / 60 / 60) // Hour-based để stable
    };
    
    const result = btoa(JSON.stringify(fingerprint)).slice(0, 32);
    sessionStorage.setItem('tkb_fingerprint_cache', result);
    return result;
  } catch (error) {
    console.error('Fingerprint generation failed:', error);
    const fallback = `fallback_${Date.now()}`;
    sessionStorage.setItem('tkb_fingerprint_cache', fallback);
    return fallback;
  }
};

// Kiểm tra có nên đếm visitor không (30 phút cooldown)
export const shouldCountVisitor = (): boolean => {
  // Tạo unique fingerprint cho user
  const fingerprint = generateFingerprint();
  
  // Kiểm tra lần cuối được đếm
  const lastCountKey = `tkb_last_count_${fingerprint}`;
  const lastCountTime = localStorage.getItem(lastCountKey);
  const now = Date.now();
  
  if (lastCountTime) {
    const timeDiff = now - parseInt(lastCountTime);
    const fifteenMinutes = 15 * 60 * 1000; // 15 phút

    if (timeDiff < fifteenMinutes) {
      console.log('Visitor cooldown active, not counting. Time left:', Math.ceil((fifteenMinutes - timeDiff) / 1000 / 60), 'minutes');
      return false; // Chưa đủ 15 phút
    }
  }
  
  // Đánh dấu lần đếm này
  localStorage.setItem(lastCountKey, now.toString());
  console.log('New visitor or cooldown expired, counting...');
  return true;
};

// Lấy số lượt truy cập từ Firestore
export const getVisitorCount = async (): Promise<number> => {
  try {
    const docRef = doc(db, 'stats', 'visitors');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as VisitorData;
      return data.count || 0;
    }
    
    return 0;
  } catch (error) {
    console.error('Error getting visitor count from Firebase, using fallback:', error);
    return await fallbackVisitorService.getCount();
  }
};

// Tăng số lượt truy cập
export const incrementVisitorCount = async (): Promise<number> => {
  // Timeout để tránh hanging
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Firebase timeout')), 10000); // 10 seconds
  });

  try {
    // Kiểm tra cooldown 15 phút
    if (!shouldCountVisitor()) {
      // Không đếm do cooldown, chỉ trả về số hiện tại
      return await Promise.race([getVisitorCount(), timeout]);
    }
    
    console.log('Counting new visitor...');
    
    const docRef = doc(db, 'stats', 'visitors');
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Kiểm tra document có tồn tại không
    const docSnap = await Promise.race([getDoc(docRef), timeout]);
    
    if (docSnap.exists()) {
      // Document đã tồn tại, update count
      await Promise.race([updateDoc(docRef, {
        count: increment(1),
        lastUpdated: new Date().toISOString(),
        [`dailyVisits.${today}`]: increment(1)
      }), timeout]);
      
      // Lấy count mới
      const updatedDoc = await Promise.race([getDoc(docRef), timeout]);
      const data = updatedDoc.data() as VisitorData;
      console.log('New count:', data.count);
      return data.count;
    } else {
      // Document chưa tồn tại, tạo mới
      const initialData: VisitorData = {
        count: 1,
        lastUpdated: new Date().toISOString(),
        dailyVisits: { [today]: 1 }
      };
      
      await Promise.race([setDoc(docRef, initialData), timeout]);
      console.log('Firebase: First visitor, initialized count: 1');
      return 1;
    }
  } catch (error) {
    console.error('Error incrementing visitor count in Firebase, using fallback:', error);
    
    // Fallback: sử dụng service dự phòng
    if (shouldCountVisitor()) {
      return await fallbackVisitorService.incrementCount();
    } else {
      return await fallbackVisitorService.getCount();
    }
  }
};

// Lấy thống kê chi tiết
export const getVisitorStats = async (): Promise<VisitorData | null> => {
  try {
    const docRef = doc(db, 'stats', 'visitors');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as VisitorData;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting visitor stats from Firebase:', error);
    
    // Fallback: tạo stats từ cache
    const count = await fallbackVisitorService.getCount();
    const today = new Date().toISOString().split('T')[0];
    
    return {
      count,
      lastUpdated: new Date().toISOString(),
      dailyVisits: { [today]: 1 }
    };
  }
};
