import { useState, useEffect } from 'react';
import { getVisitorCount, incrementVisitorCount, getVisitorStats } from '../lib/visitorService';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { VisitorData } from '../lib/visitorService';

export const useVisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<VisitorData | null>(null);

  // Khởi tạo và tăng visitor count + Real-time listener
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let hasInitialized = false;

    const initializeVisitor = async () => {
      if (hasInitialized) return; // Prevent multiple initialization
      hasInitialized = true;
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Initializing visitor counter...');
        
        // Tăng count nếu là visitor mới (chỉ 1 lần)
        const newCount = await incrementVisitorCount();
        setVisitorCount(newCount);
        
        // Lấy stats chi tiết
        const visitorStats = await getVisitorStats();
        setStats(visitorStats);
        
      } catch (err) {
        console.error('Error initializing visitor:', err);
        setError('Không thể tải số lượt truy cập');
        
        // Fallback: chỉ lấy count hiện tại
        try {
          const currentCount = await getVisitorCount();
          setVisitorCount(currentCount);
        } catch (fallbackErr) {
          console.error('Fallback failed:', fallbackErr);
          setVisitorCount(0);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize first
    initializeVisitor();

    // Setup real-time listener (separate from initialization)
    try {
      const docRef = doc(db, 'stats', 'visitors');
      unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists() && hasInitialized) {
          const data = doc.data() as VisitorData;
          console.log('Real-time update: New count =', data.count);
          setVisitorCount(data.count);
          setStats(data);
        }
      }, (error) => {
        console.error('Real-time listener error:', error);
        setError('Real-time sync failed');
      });
    } catch (error) {
      console.error('Failed to setup real-time listener:', error);
    }

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        console.log('Cleaning up real-time listener');
        unsubscribe();
      }
    };
  }, []);

  // Refresh count (không tăng)
  const refreshCount = async () => {
    try {
      setError(null);
      const currentCount = await getVisitorCount();
      setVisitorCount(currentCount);
      
      const visitorStats = await getVisitorStats();
      setStats(visitorStats);
    } catch (err) {
      console.error('Error refreshing count:', err);
      setError('Không thể cập nhật số lượt truy cập');
    }
  };

  return {
    visitorCount,
    isLoading,
    error,
    stats,
    refreshCount
  };
};
