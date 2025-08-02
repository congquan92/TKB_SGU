// Fallback service khi Firebase không khả dụng
export const fallbackVisitorService = {
  // Lấy count từ cache hoặc GitHub API
  getCount: async (): Promise<number> => {
    try {
      // 1. Thử cache trước
      const cachedCount = localStorage.getItem('tkb-visitor-count-fallback');
      const cachedTime = localStorage.getItem('tkb-visitor-timestamp-fallback');
      
      if (cachedCount && cachedTime) {
        const timeDiff = Date.now() - parseInt(cachedTime);
        const fiveMinutes = 5 * 60 * 1000;
        
        if (timeDiff < fiveMinutes) {
          return parseInt(cachedCount);
        }
      }
      
      // 2. Thử GitHub API backup
      // const response = await fetch('https://api.github.com/repos/congquan92/TKB_SGU');
      // const data = await response.json();
      // const count = Math.max((data.stargazers_count || 0) + 450, 500);
      
      // Cache kết quả
      localStorage.setItem('tkb-visitor-count-fallback', count.toString());
      localStorage.setItem('tkb-visitor-timestamp-fallback', Date.now().toString());
      
      return count;
    } catch (error) {
      console.error('Fallback service failed:', error);
      
      // Trả về cache cũ nếu có
      const cachedCount = localStorage.getItem('tkb-visitor-count-fallback');
      return cachedCount ? parseInt(cachedCount) : 500;
    }
  },

  // Tăng count với 30 phút cooldown
  incrementCount: async (): Promise<number> => {
    try {
      // Kiểm tra cooldown cho fallback
      const lastFallbackCount = localStorage.getItem('tkb-fallback-last-count');
      const now = Date.now();
      
      if (lastFallbackCount) {
        const timeDiff = now - parseInt(lastFallbackCount);
        const thirtyMinutes = 30 * 60 * 1000;
        
        if (timeDiff < thirtyMinutes) {
          console.log('Fallback: Cooldown active, not incrementing');
          return await fallbackVisitorService.getCount();
        }
      }
      
      const currentCount = await fallbackVisitorService.getCount();
      const newCount = currentCount + 1;
      
      localStorage.setItem('tkb-visitor-count-fallback', newCount.toString());
      localStorage.setItem('tkb-visitor-timestamp-fallback', Date.now().toString());
      localStorage.setItem('tkb-fallback-last-count', now.toString());
      
      console.log('Fallback: Visitor counted (30min cooldown passed), new count:', newCount);
      return newCount;
    } catch (error) {
      console.error('Fallback increment failed:', error);
      return await fallbackVisitorService.getCount();
    }
  }
};
