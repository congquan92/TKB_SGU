import { useVisitorCounter } from '../hooks/useVisitorCounter';

interface VisitorCounterProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function VisitorCounter({ className = '', style = {} }: VisitorCounterProps) {
  const { visitorCount, isLoading, error, stats } = useVisitorCounter();

  const formatVisitorCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString('vi-VN');
  };

  const getTodayVisits = (): number => {
    if (!stats?.dailyVisits) return 0;
    const today = new Date().toISOString().split('T')[0];
    return stats.dailyVisits[today] || 0;
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

  if (error && visitorCount === 0) {
    return (
      <div className={className} style={defaultStyle} title={error}>
        <i className="fa-solid fa-exclamation-triangle" style={{ color: 'var(--warning-color)' }}></i>
        <span>Lỗi tải</span>
      </div>
    );
  }

  const todayCount = getTodayVisits();
  const tooltipText = `Tổng số lượt truy cập: ${visitorCount.toLocaleString('vi-VN')} visitors\nHôm nay: ${todayCount.toLocaleString('vi-VN')} visitors\nCooldown: 15 phút mỗi user\nCập nhật lần cuối: ${stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleString('vi-VN') : 'N/A'}`;

  return (
    <div 
      className={className} 
      style={defaultStyle}
      title={tooltipText}
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
        {formatVisitorCount(visitorCount)} lượt xem
        {error && <small style={{ color: 'var(--warning-color)', marginLeft: '4px' }}>*</small>}
      </span>
      {todayCount > 0 && (
        <small style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '12px',
          marginLeft: '4px'
        }}>
          (+{todayCount} hôm nay)
        </small>
      )}
    </div>
  );
}
