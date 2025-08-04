import type { Subject, TimetableCell } from "../types";

interface TimetableProps {
  subjects: Subject[];
}

// Google Calendar inspired colors
const COLORS = [
  '#1a73e8', '#ea4335', '#fbbc04', '#34a853', '#9aa0a6', '#ff6d01',
  '#7c3aed', '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#6366f1',
  '#ef4444', '#84cc16', '#f97316', '#8b5cf6', '#14b8a6', '#f472b6'
];

const WEEKDAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Thứ 8'];

const TIME_SLOTS = [
  '07:00-07:50',  // Tiết 1
  '07:50-08:40',  // Tiết 2
  '09:00-09:50',  // Tiết 3
  '09:50-10:40',  // Tiết 4
  '10:40-11:30',  // Tiết 5
  '13:00-13:50',  // Tiết 6
  '13:50-14:40',  // Tiết 7
  '15:00-15:50',  // Tiết 8
  '15:50-16:40',  // Tiết 9
  '16:40-17:30',  // Tiết 10
  '17:40-18:30',  // Tiết 11
  '18:30-19:20',  // Tiết 12
  '19:20-20:10'   // Tiết 13
];

const getTimeSlotIndex = (time: string): number => {
  const timeSlotMap: { [key: string]: number } = {
    '07:00': 0,  // Tiết 1
    '07:50': 1,  // Tiết 2
    '09:00': 2,  // Tiết 3
    '09:50': 3,  // Tiết 4
    '10:40': 4,  // Tiết 5
    '13:00': 5,  // Tiết 6
    '13:50': 6,  // Tiết 7
    '15:00': 7,  // Tiết 8
    '15:50': 8,  // Tiết 9
    '16:40': 9,  // Tiết 10
    '17:40': 10, // Tiết 11
    '18:30': 11, // Tiết 12
    '19:20': 12  // Tiết 13
  };
  
  // Nếu thời gian chính xác có trong map
  if (timeSlotMap[time] !== undefined) {
    return timeSlotMap[time];
  }
  
  // Nếu không có, tìm slot gần nhất
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  
  // Danh sách thời gian bắt đầu các slot (tính bằng phút)
  const slotTimes = [
    7*60,        // 07:00 - Tiết 1
    7*60+50,     // 07:50 - Tiết 2
    9*60,        // 09:00 - Tiết 3
    9*60+50,     // 09:50 - Tiết 4
    10*60+40,    // 10:40 - Tiết 5
    13*60,       // 13:00 - Tiết 6
    13*60+50,    // 13:50 - Tiết 7
    15*60,       // 15:00 - Tiết 8
    15*60+50,    // 15:50 - Tiết 9
    16*60+40,    // 16:40 - Tiết 10
    17*60+40,    // 17:40 - Tiết 11
    18*60+30,    // 18:30 - Tiết 12
    19*60+20     // 19:20 - Tiết 13
  ];
  
  // Tìm slot phù hợp nhất
  for (let i = 0; i < slotTimes.length; i++) {
    if (totalMinutes <= slotTimes[i] + 25) { // Cho phép sai lệch 25 phút
      return i;
    }
  }
  
  return -1;
};

export default function Timetable({ subjects }: TimetableProps) {
  // console.log('Timetable received subjects:', subjects);
  // console.log('Number of subjects:', subjects.length);
  
  // Initialize empty timetable grid - Now 7 days (including Thứ 8) and 13 slots
  const grid: TimetableCell[][] = Array.from({ length: 13 }, () =>
    Array.from({ length: 7 }, () => ({}))
  );

  // Track subject colors
  const subjectColors = new Map<string, string>();
  let colorIndex = 0;

  // Track merged cells to avoid rendering duplicates
  const mergedCells = new Set<string>();

  // Fill the grid with subjects
  subjects.forEach((subject) => {
    // Assign color to subject if not already assigned
    if (!subjectColors.has(subject.ma_mon)) {
      subjectColors.set(subject.ma_mon, COLORS[colorIndex % COLORS.length]);
      colorIndex++;
    }

    subject.tkb.forEach((session) => {
      // console.log('Processing session:', session);
      const dayIndex = WEEKDAYS.indexOf(session.thu);
      // console.log('Day index:', dayIndex, 'for day:', session.thu);
      
      if (dayIndex === -1) {
        // console.log('Day not found:', session.thu);
        return;
      }

      let startSlot = -1;
      let endSlot = -1;

      // Kiểm tra định dạng "tiết X->Y"
      const tietMatch = session.thoi_gian.match(/tiết (\d+)->(\d+)/);
      if (tietMatch) {
        const tietStart = parseInt(tietMatch[1]);
        const tietEnd = parseInt(tietMatch[2]);
        
        // Chuyển đổi tiết thành slot index (tiết 1 = slot 0)
        startSlot = tietStart - 1;
        endSlot = tietEnd;
      } else {
        // Kiểm tra định dạng "từ HH:mm đến HH:mm"
        const timeMatch = session.thoi_gian.match(/từ (\d{2}:\d{2}) đến (\d{2}:\d{2})/);
        if (timeMatch) {
          startSlot = getTimeSlotIndex(timeMatch[1]);
          endSlot = getTimeSlotIndex(timeMatch[2]);
        }
      }

      if (startSlot === -1 || endSlot === -1) {
        // console.log('Invalid time format:', session.thoi_gian);
        return;
      }

      // Calculate rowspan (number of slots this subject spans)
      const rowSpan = endSlot - startSlot;

      // Only fill the first cell with complete info and rowspan
      const firstCell = grid[startSlot][dayIndex];
      if (!firstCell.subject) {
        firstCell.subject = subject.ten_mon;
        firstCell.room = session.phong;
        firstCell.instructor = session.giang_vien;
        firstCell.nhom_to = subject.nhom_to;
        firstCell.to = subject.to;
        firstCell.isConflict = false;
        firstCell.subjectCode = subject.ma_mon;
        firstCell.sl_cp = subject.sl_cp;
        firstCell.sl_cl = subject.sl_cl;
        firstCell.rowSpan = rowSpan; // Add rowspan info
      }

      // Mark subsequent cells as merged (hidden)
      for (let slot = startSlot + 1; slot < endSlot && slot < 13; slot++) {
        const cell = grid[slot][dayIndex];
        if (!cell.subject) {
          cell.isMerged = true; // Mark as merged cell (will be hidden)
          mergedCells.add(`${slot}-${dayIndex}`);
        }
      }
    });
  });

  const getCellStyle = (cell: TimetableCell) => {
    if (!cell.subject) {
      return {
        backgroundColor: 'var(--background-color)', // Nền thuần theo theme
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        minHeight: '80px',
      };
    }
    
    return {
      backgroundColor: 'var(--surface-color)', // Nền tối cho cell có content
      // borderLeft được xử lý bởi CSS với data attribute
      borderTop: '1px solid var(--border-color)', // Đảm bảo có border top
      borderRight: '1px solid var(--border-color)', // Đảm bảo có border right  
      borderBottom: '1px solid var(--border-color)', // Đảm bảo có border bottom
      fontWeight: cell.isConflict ? 'bold' : 'normal',
      position: 'relative' as const,
      color: 'var(--text-primary)', // Text theo theme
      minHeight: '80px',
    };
  };

  // Tính tổng tín chỉ
  const totalCredits = subjects.reduce((sum, subject) => sum + parseInt(subject.so_tc), 0);

  return (
    <div className="table-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
          <i className="fa-solid fa-calendar-days me-2" style={{ color: 'var(--primary-color)' }}></i>
          Thời Khóa Biểu
        </h4>
        {subjects.length > 0 && (
          <div className="d-flex gap-2">
            <span className="badge bg-success fs-6 px-3 py-2">
              <i className="fa-solid fa-book me-1"></i>
              {subjects.length} môn học
            </span>
            <span className="badge bg-info fs-6 px-3 py-2">
              <i className="fa-solid fa-credit-card me-1"></i>
              {totalCredits} tín chỉ
            </span>
          </div>
        )}
      </div>
      <table className="table table-bordered text-center timetable-custom" style={{
        borderCollapse: 'collapse',
        border: '2px solid var(--border-color)',
        backgroundColor: 'var(--background-color)',
        color: 'var(--text-primary)'
      }}>
        <thead>
          <tr>
            <th style={{ 
              width: '40px', 
              minWidth: '40px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--surface-color)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-color)'
            }}>Tiết</th>
            <th style={{ 
              width: '70px', 
              minWidth: '70px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--surface-color)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-color)'
            }}>Giờ</th>
            {WEEKDAYS.map((day) => (
              <th key={day} style={{ 
                width: '140px', 
                minWidth: '140px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface-color)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)'
              }}>
                {day.replace('Thứ 8', 'CN')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((row, slotIndex) => (
            <tr key={slotIndex}>
              <td className="align-middle fw-bold" style={{
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface-color)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)'
              }}>
                {slotIndex + 1}
              </td>
              <td className="align-middle" style={{
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface-color)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)'
              }}>
                <small>{TIME_SLOTS[slotIndex]}</small>
              </td>
              {row.map((cell, dayIndex) => {
                // Skip rendering cells that are merged (hidden)
                if (cell.isMerged) {
                  return null;
                }

                const cellColor = cell.subjectCode ? subjectColors.get(cell.subjectCode) : '#6366f1';
                const rowSpan = cell.rowSpan || 1;
                
                return (
                <td 
                  key={dayIndex} 
                  className="align-middle subject-cell"
                  data-has-subject={cell.subject ? "true" : "false"}
                  rowSpan={rowSpan}
                  style={{
                    ...getCellStyle(cell),
                    wordWrap: 'break-word',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    minHeight: '60px',
                    padding: '8px',
                    '--subject-border-color': cellColor,
                    '--subject-text-color': cellColor,
                    verticalAlign: 'middle'
                  } as React.CSSProperties & { '--subject-border-color': string; '--subject-text-color': string }}
                >
                  {cell.subject && (
                    <div className="h-100 d-flex flex-column justify-content-center">
                      <div className="fw-bold mb-1 subject-name" 
                           style={{ 
                             fontSize: '0.9rem', 
                             lineHeight: '1.2'
                           }}
                           title={cell.subject}>
                        {cell.subject}
                      </div>
                       {cell.subjectCode && (
                        <div className="mb-1 fst-italic" style={{ fontSize: '0.75rem', lineHeight: '1.2', fontWeight: '500', color: 'var(--text-secondary)' }}>
                         Mã môn : {cell.subjectCode}
                        </div>
                      )}
                         
                      {cell.room && (
                        <div className="mb-1 fst-italic" style={{ fontSize: '0.75rem', lineHeight: '1.2', fontWeight: '500', color: 'var(--text-secondary)' }}>
                          Phòng : {cell.room.replace('Ph ', '')}
                        </div>
                      )}    
                      {cell.nhom_to && (
                        <div className="mb-1 fst-italic" style={{ fontSize: '0.75rem', lineHeight: '1.2', fontWeight: '500', color: 'var(--text-secondary)' }}>
                          Nhóm : {cell.nhom_to}{cell.to ? ` - Tổ: ${cell.to}` : ''}
                        </div>
                      )}
                      {cell.instructor && (
                        <div className="fst-italic mb-1" 
                             style={{ fontSize: '0.75rem', lineHeight: '1.2', fontWeight: '500', color: 'var(--text-secondary)' }}
                             title={cell.instructor}>
                            GV : {cell.instructor.replace('GV ','')}     
                        </div>
                      )}
                      {(cell.sl_cp !== undefined || cell.sl_cl !== undefined) && (
                        <div className="fst-italic print-hide" 
                             style={{ 
                               fontSize: '0.75rem', 
                               lineHeight: '1.2', 
                               fontWeight: '600',
                               color: cell.sl_cl !== undefined && cell.sl_cl <= 0 
                                 ? '#dc3545'  // Đỏ cho hết slot
                                 : 'var(--text-secondary)'
                             }}>
                           Tình trạng : {cell.sl_cp !== undefined && cell.sl_cl !== undefined 
                            ? `${cell.sl_cp - cell.sl_cl}/${cell.sl_cp}`
                            : cell.sl_cp !== undefined 
                              ? `Tổng: ${cell.sl_cp}`
                              : `Còn: ${cell.sl_cl}`
                          }
                        </div>
                      )}
                      {rowSpan > 1 && (
                        <div className="mt-1" style={{ 
                          fontSize: '0.7rem', 
                          color: 'var(--accent-primary)', 
                          fontWeight: '600',
                          opacity: 0.8 
                        }}>
                          ({rowSpan} tiết)
                        </div>
                      )}
                    </div>
                  )}
                </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
