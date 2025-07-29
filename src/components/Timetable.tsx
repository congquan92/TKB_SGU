import type { Subject, TimetableCell } from "../types";

const TIME_SLOTS = [
  "07:00", "07:50", "09:00", "09:50", "10:40",
  "13:00", "13:50", "15:00", "15:50", "16:40", "17:40", "18:30"
];

const TIME_SLOTS2 = [
  "07:00 - 07:50", "07:50 - 09:00", "09:00 - 09:50", "09:50 - 10:40",
  "10:40 - 13:00", "13:00 - 13:50", "13:50 - 15:00", "15:00 - 15:50",
  "15:50 - 16:40", "16:40 - 17:40", "17:40 - 18:30", "18:30 - 19:20"
];


const WEEKDAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

const COLORS = [
  '#FFE5E5', '#E5F3FF', '#E5FFE5', '#FFF5E5', '#F5E5FF', 
  '#E5FFFF', '#FFE5F5', '#F0F0F0', '#E5E5FF', '#FFFFE5'
];

function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function getTimeSlotIndex(timeStr: string): number {
  const targetTime = parseTime(timeStr);
  return TIME_SLOTS.findIndex((slot) => {
    const slotTime = parseTime(slot);
    return targetTime <= slotTime;
  });
}

interface TimetableProps {
  subjects: Subject[];
}

export default function Timetable({ subjects }: TimetableProps) {
  // Initialize empty timetable grid
  const grid: TimetableCell[][] = Array.from({ length: 12 }, () =>
    Array.from({ length: 6 }, () => ({}))
  );

  // Track subject colors
  const subjectColors = new Map<string, string>();
  let colorIndex = 0;

  // Fill the grid with subjects
  subjects.forEach((subject) => {
    // Assign color to subject if not already assigned
    if (!subjectColors.has(subject.ma_mon)) {
      subjectColors.set(subject.ma_mon, COLORS[colorIndex % COLORS.length]);
      colorIndex++;
    }

    subject.tkb.forEach((session) => {
      const dayIndex = WEEKDAYS.indexOf(session.thu);
      if (dayIndex === -1) return;

      const timeMatch = session.thoi_gian.match(/từ (\d{2}:\d{2}) đến (\d{2}:\d{2})/);
      if (!timeMatch) return;

      const startSlot = getTimeSlotIndex(timeMatch[1]);
      const endSlot = getTimeSlotIndex(timeMatch[2]);

      if (startSlot === -1 || endSlot === -1) return;

      for (let slot = startSlot; slot < endSlot && slot < 12; slot++) {
        const cell = grid[slot][dayIndex];
        
        // Chỉ thêm vào nếu ô trống (không trùng lịch)
        if (!cell.subject) {
          cell.subject = subject.ten_mon;
          cell.room = session.phong;
          cell.instructor = session.giang_vien;
          cell.isConflict = false;
          cell.subjectCode = subject.ma_mon; // Thêm mã môn để dễ tìm màu
        }
      }
    });
  });

  const getCellStyle = (cell: TimetableCell) => {
    if (!cell.subject) return {};
    
    const backgroundColor = cell.subjectCode ? subjectColors.get(cell.subjectCode) : '#F0F0F0';
    
    return {
      backgroundColor,
      border: cell.isConflict ? '2px solid #dc3545' : '1px solid #dee2e6',
      fontWeight: cell.isConflict ? 'bold' : 'normal',
    };
  };

  // Tính tổng tín chỉ
  const totalCredits = subjects.reduce((sum, subject) => sum + parseInt(subject.so_tc), 0);

  return (
    <div className="table-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="text-dark fw-bold mb-0">
          <i className="fa-solid fa-calendar-days text-primary me-2"></i>
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
      <table className="table table-bordered text-center timetable-custom">
        <thead className="table-dark">
          <tr>
            <th style={{ width: '40px', minWidth: '40px' }}>Tiết</th>
            <th style={{ width: '70px', minWidth: '70px' }}>Giờ</th>
            {WEEKDAYS.map((day) => (
              <th key={day} style={{ width: '140px', minWidth: '140px' }}>
                {day.replace('Thứ ', 'T')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((row, slotIndex) => (
            <tr key={slotIndex}>
              <td className="align-middle fw-bold">
                {slotIndex + 1}
              </td>
              <td className="align-middle">
                <small>{TIME_SLOTS2[slotIndex]}</small>
              </td>
              {row.map((cell, dayIndex) => (
                <td 
                  key={dayIndex} 
                  className="align-middle"
                  style={{
                    ...getCellStyle(cell),
                    wordWrap: 'break-word',
                    overflow: 'hidden'
                  }}
                >
                  {cell.subject && (
                    <div className="h-100 d-flex flex-column justify-content-center">
                      <div className="fw-bold mb-1" 
                           style={{ fontSize: '1rem', lineHeight: '1.2' }}
                           title={cell.subject}>
                        {cell.subject.length > 25 ? cell.subject.substring(0, 25) + '...' : cell.subject}
                      </div>
                      {cell.room && (
                        <div className="text-muted mb-1" style={{ fontSize: '1rem', lineHeight: '1.2', fontWeight: '500' }}>
                          Phòng : {cell.room.replace('Ph ', '')}
                        </div>
                      )}
                      {cell.instructor && (
                        <div className="text-muted" 
                             style={{ fontSize: '1rem', lineHeight: '1.2', fontWeight: '500' }}
                             title={cell.instructor}>
                           {cell.instructor}     
                        </div>
                      )}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {subjects.length > 0 && (
        <div className="mt-4">
          <h5 className="d-flex align-items-center gap-2 mb-3" style={{ color: '#2c3e50', fontWeight: '700' }}>
            <i className="fa-solid fa-bookmark text-primary"></i> 
            Danh sách môn học đã chọn 
            <span className="badge bg-primary ms-2">{subjects.length} môn</span>
          </h5>
          <div className="d-flex flex-wrap gap-3">
            {subjects.map((subject) => (
              <span
                key={subject.ma_mon}
                className="badge fs-6 px-3 py-2"
                style={{ 
                  backgroundColor: subjectColors.get(subject.ma_mon),
                  color: '#000',
                  border: '1px solid #ddd'
                }}
              >
                {subject.ma_mon} - {subject.ten_mon}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
