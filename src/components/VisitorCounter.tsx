import { useEffect, useState } from 'react';

interface VisitorCounterProps {
  className?: string;
  style?: React.CSSProperties;
}

interface CountResponse {
  value: number;
}

export default function VisitorCounter({ className = '', style = {} }: VisitorCounterProps) {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API endpoint cho CountAPI.xyz
  const API_URL = 'https://api.countapi.xyz/hit/tkb-sgu.vercel.app/visits';

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: CountResponse = await response.json();
        setVisitorCount(data.value);
        
        // Lưu vào localStorage để cache
        localStorage.setItem('tkb-visitor-count', data.value.toString());
        localStorage.setItem('tkb-visitor-timestamp', Date.now().toString());
        
      } catch (err) {
        console.error('Error fetching visitor count:', err);
        setError('Không thể tải số liệu truy cập');
        
        // Fallback từ localStorage nếu có
        const cachedCount = localStorage.getItem('tkb-visitor-count');
        if (cachedCount) {
          setVisitorCount(parseInt(cachedCount));
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Kiểm tra cache trước (cache 5 phút)
    const cachedCount = localStorage.getItem('tkb-visitor-count');
    const cachedTime = localStorage.getItem('tkb-visitor-timestamp');
    const fiveMinutes = 5 * 60 * 1000;
    
    if (cachedCount && cachedTime) {
      const timeDiff = Date.now() - parseInt(cachedTime);
      if (timeDiff < fiveMinutes) {
        // Sử dụng cache
        setVisitorCount(parseInt(cachedCount));
        setIsLoading(false);
        return;
      }
    }

    // Fetch mới nếu không có cache hoặc cache đã cũ
    fetchVisitorCount();
  }, []);

  const formatVisitorCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString('vi-VN');
  };

  const defaultStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: 'var(--surface-color)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    transition: 'all 0.3s ease',
    cursor: 'default',
    ...style
  };

  if (isLoading) {
    return (
      <div className={className} style={defaultStyle} title="Đang tải số liệu truy cập...">
        <i className="fa-solid fa-spinner fa-spin" style={{ color: 'var(--accent-primary)' }}></i>
        <span>Đang tải...</span>
      </div>
    );
  }

  if (error && !visitorCount) {
    return (
      <div className={className} style={defaultStyle} title={error}>
        <i className="fa-solid fa-exclamation-triangle" style={{ color: 'var(--warning-color)' }}></i>
        <span>Lỗi tải</span>
      </div>
    );
  }

  return (
    <div 
      className={className} 
      style={defaultStyle}
      title={`Tổng số lượt truy cập: ${visitorCount?.toLocaleString('vi-VN')} lượt`}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--surface-color)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <i className="fa-solid fa-eye" style={{ color: 'var(--accent-primary)' }}></i>
      <span>
        {visitorCount ? formatVisitorCount(visitorCount) : '---'} lượt xem
        {error && <small style={{ color: 'var(--warning-color)', marginLeft: '4px' }}>*</small>}
      </span>
    </div>
  );
}
