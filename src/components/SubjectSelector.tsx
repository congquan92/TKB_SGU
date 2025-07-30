import { useState, useMemo } from "react";
import type { Subject } from "../types";

interface SubjectSelectorProps {
  data: Subject[];
  onSelect: (mon: Subject) => void;
}

export default function SubjectSelector({ data, onSelect }: SubjectSelectorProps) {
  const [keyword, setKeyword] = useState("");

  // Improved search with better matching
  const results = useMemo(() => {
    if (!keyword.trim()) return [];
    
    const searchTerm = keyword.toLowerCase().trim();
    
    return data.filter((mon) => {
      // Search in subject code
      if (mon.ma_mon.toLowerCase().includes(searchTerm)) return true;
      
      // Search in subject name
      if (mon.ten_mon.toLowerCase().includes(searchTerm)) return true;
      
      // Search in instructor name
      const hasInstructor = mon.tkb.some(session => 
        session.giang_vien && session.giang_vien.toLowerCase().includes(searchTerm)
      );
      if (hasInstructor) return true;
      
      // Search in room
      const hasRoom = mon.tkb.some(session => 
        session.phong && session.phong.toLowerCase().includes(searchTerm)
      );
      if (hasRoom) return true;
      
      return false;
    }).slice(0, 50); // Limit results for performance
  }, [data, keyword]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSubjectClick = (mon: Subject) => {
    // console.log('Subject clicked:', mon.ma_mon, mon.ten_mon);
    onSelect(mon);
    // Không xóa search để user có thể chọn tiếp các môn khác
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length > 0) {
      handleSubjectClick(results[0]);
    }
  };

  return (
    <div className="mb-4">
      <div className="position-relative">
        <input
          className="form-control mb-3"
          placeholder="Tìm môn học, giảng viên, phòng học..."
          value={keyword}
          onChange={handleKeywordChange}
          onKeyPress={handleKeyPress}
          autoComplete="off"
          style={{
            borderRadius: '24px',
            padding: '12px 20px',
            paddingRight: keyword ? '50px' : '20px',
            border: '1px solid var(--border-color)',
            fontSize: '14px',
            backgroundColor: 'var(--background-color)',
            color: 'var(--text-primary)'
          }}
        />
        {keyword && (
          <button
            onClick={() => setKeyword("")}
            className="btn btn-sm position-absolute"
            title="Xóa tìm kiếm"
            style={{
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              padding: '4px 8px',
              marginBottom: '12px'
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>
      
      {keyword && (
        <div className="card shadow-sm" style={{
          backgroundColor: 'var(--surface-color)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}>
          <div 
            className="list-container" 
            style={{ 
              maxHeight: '400px',
              overflowY: 'auto',
              padding: '8px'
            }}
          >
            {results.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {results.map((mon) => (
                  <div
                    key={`${mon.ma_mon}-${mon.nhom_to}-${mon.to}`}
                    className="list-group-item"
                    onClick={(e) => {
                      // console.log('Click event triggered', e);
                      e.preventDefault();
                      e.stopPropagation();
                      handleSubjectClick(mon);
                    }}
                    style={{ 
                      cursor: 'pointer',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      border: '1px solid var(--border-color)',
                      marginBottom: '6px',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'var(--background-color)',
                      color: 'var(--text-primary)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--background-color)';
                    }}
                  >
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px', marginBottom: '4px' }}>
                      <strong>{mon.ma_mon}</strong> – {mon.ten_mon}
                      <span className="badge ms-2" style={{ 
                        background: 'var(--text-primary)', 
                        color: 'var(--background-color)',
                        fontSize: '11px'
                      }}>
                        {mon.so_tc} TC
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.3' }}>
                      <div>📚 Nhóm {mon.nhom_to} {mon.to ? `- Tổ ${mon.to}` : ""}</div>
                      <div>👨‍🏫 {mon.tkb[0]?.giang_vien || "Chưa có GV"}</div>
                      <div>📅 {mon.tkb.length > 0 ? 
                        mon.tkb.map(session => `${session.thu} ${session.thoi_gian}`).join(', ') : 
                        "Chưa có lịch"
                      }</div>
                      <div>🏫 {mon.tkb.length > 0 ? 
                        [...new Set(mon.tkb.map(session => session.phong))].join(', ') : 
                        "Chưa có phòng"
                      }</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>
                <i className="fa-solid fa-search-minus fa-2x mb-2"></i>
                <div>Không tìm thấy môn học nào</div>
                <small>Thử tìm kiếm với từ khóa khác</small>
              </div>
            )}
          </div>
          
          {results.length > 0 && (
            <div className="card-footer text-center py-2" style={{ 
              backgroundColor: 'var(--surface-color)',
              borderTopColor: 'var(--border-color)'
            }}>
              <small style={{ color: 'var(--text-secondary)' }}>
                <i className="fa-solid fa-list me-1"></i>
                Tìm thấy {results.length} môn học
                
              </small>
            </div>
          )}
        </div>
      )}
      
      {!keyword && (
        <div className="text-center py-3" style={{ color: 'var(--text-secondary)' }}>
          <i className="fa-solid fa-graduation-cap fa-2x mb-2"></i>
          <div>Nhập từ khóa để tìm kiếm</div>
          <small>Hỗ trợ tìm theo mã môn, tên môn, giảng viên, phòng học</small>
        </div>
      )}
    </div>
  );
}
