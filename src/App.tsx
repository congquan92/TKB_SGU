import { useState } from "react";
import SubjectSelector from "./components/SubjectSelector";
import Timetable from "./components/Timetable";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import data from "./data/dsCustom.json";
import type { Subject } from "./types";

export default function App() {
  const [selected, setSelected] = useState<Subject[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  const addSubject = (mon: Subject) => {
    if (selected.some((m) => m.ma_mon === mon.ma_mon)) {
      toast.error(`Môn ${mon.ma_mon} đã được chọn!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Kiểm tra trùng lịch trước khi thêm
    const hasConflict = checkScheduleConflict(mon, selected);
    if (hasConflict.length > 0) {
      toast.error(
        ` Môn ${mon.ma_mon} bị trùng lịch với: ${hasConflict.join(", ")}`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }

    setSelected([...selected, mon]);
    toast.success(`Đã thêm môn ${mon.ma_mon} - ${mon.ten_mon}`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Hàm kiểm tra trùng lịch
  const checkScheduleConflict = (newSubject: Subject, currentSubjects: Subject[]): string[] => {
    const conflicts: string[] = [];
    
    newSubject.tkb.forEach((newSession) => {
      currentSubjects.forEach((subject) => {
        subject.tkb.forEach((session) => {
          if (session.thu === newSession.thu) {
            // Parse time
            const newMatch = newSession.thoi_gian.match(/từ (\d{2}:\d{2}) đến (\d{2}:\d{2})/);
            const existMatch = session.thoi_gian.match(/từ (\d{2}:\d{2}) đến (\d{2}:\d{2})/);
            
            if (newMatch && existMatch) {
              const newStart = parseTime(newMatch[1]);
              const newEnd = parseTime(newMatch[2]);
              const existStart = parseTime(existMatch[1]);
              const existEnd = parseTime(existMatch[2]);
              
              // Check overlap
              if (!(newEnd <= existStart || newStart >= existEnd)) {
                if (!conflicts.includes(subject.ma_mon)) {
                  conflicts.push(subject.ma_mon);
                }
              }
            }
          }
        });
      });
    });
    
    return conflicts;
  };

  // Helper function to parse time
  const parseTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Hàm kiểm tra trùng lịch trong cùng một danh sách
  const findConflictsInList = (subjects: Subject[]): string[] => {
    const conflicts: string[] = [];
    
    for (let i = 0; i < subjects.length; i++) {
      for (let j = i + 1; j < subjects.length; j++) {
        const subject1 = subjects[i];
        const subject2 = subjects[j];
        
        const hasConflict = checkScheduleConflict(subject1, [subject2]);
        if (hasConflict.length > 0) {
          if (!conflicts.includes(subject1.ma_mon)) {
            conflicts.push(subject1.ma_mon);
          }
          if (!conflicts.includes(subject2.ma_mon)) {
            conflicts.push(subject2.ma_mon);
          }
        }
      }
    }
    
    return conflicts;
  };

  const removeSubject = (ma_mon: string) => {
    const removedSubject = selected.find(m => m.ma_mon === ma_mon);
    setSelected(selected.filter((m) => m.ma_mon !== ma_mon));
    if (removedSubject) {
      toast.info(`Đã xóa môn ${removedSubject.ma_mon} - ${removedSubject.ten_mon}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const clearAll = () => {
    setSelected([]);
    toast.info("Đã xóa tất cả môn học", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(selected, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, `thoikhoabieu_${new Date().toISOString().split('T')[0]}.json`);
    toast.success("Đã xuất file JSON thành công!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const importJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const arr = JSON.parse(content);
        
        if (Array.isArray(arr)) {
          // Validate data structure
          const isValidData = arr.every((item: unknown) => {
            if (typeof item !== 'object' || item === null) return false;
            const obj = item as Record<string, unknown>;
            return obj.ma_mon && obj.ten_mon && Array.isArray(obj.tkb);
          });
          
          if (isValidData) {
            // Kiểm tra trùng lịch trong danh sách nhập vào
            const importedSubjects = arr as Subject[];
            const conflicts = findConflictsInList(importedSubjects);
            
            if (conflicts.length > 0) {
              toast.error(
                `❌ File JSON có trùng lịch! Các môn bị trùng: ${conflicts.join(", ")}`,
                {
                  position: "top-center",
                  autoClose: 6000,
                }
              );
              return;
            }
            
            // Kiểm tra trùng lịch với môn học hiện tại
            const existingConflicts: string[] = [];
            importedSubjects.forEach(newSubject => {
              const hasConflict = checkScheduleConflict(newSubject, selected);
              if (hasConflict.length > 0) {
                existingConflicts.push(newSubject.ma_mon);
              }
            });
            
            if (existingConflicts.length > 0) {
              toast.error(
                `❌ Một số môn trong file bị trùng lịch với môn đã chọn: ${existingConflicts.join(", ")}`,
                {
                  position: "top-center",
                  autoClose: 6000,
                }
              );
              return;
            }
            
            setSelected(importedSubjects);
            toast.success(
              `✅ Đã nhập file JSON thành công! ${importedSubjects.length} môn học`,
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
          } else {
            toast.error("❌ File không đúng định dạng dữ liệu môn học!", {
              position: "top-right",
              autoClose: 4000,
            });
          }
        } else {
          toast.error("❌ File phải chứa một mảng dữ liệu!", {
            position: "top-right",
            autoClose: 4000,
          });
        }
      } catch (error) {
        console.error("JSON parse error:", error);
        toast.error("❌ File JSON lỗi hoặc không hợp lệ!", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    };
    reader.readAsText(file);
    // Clear the input after processing
    e.target.value = '';
  };

  const captureImage = async () => {
    const el = document.querySelector(".timetable-custom") as HTMLElement;
    if (!el) {
      toast.error("Không tìm thấy bảng thời khóa biểu!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    setIsCapturing(true);
    
    toast.info("Đang chuẩn bị chụp ảnh...", {
      position: "top-right",
      autoClose: 1500,
    });
    
    try {
      // Add screenshot mode class for better quality
      el.classList.add('screenshot-mode');
      
      // Scroll to table and ensure it's visible
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Wait for scroll and rendering to complete
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.info(" Đang chụp ảnh...", {
        position: "top-right",
        autoClose: 1000,
      });
      
      const canvas = await html2canvas(el, {
        background: '#ffffff',
        useCORS: true,
        allowTaint: true,
        width: el.scrollWidth,
        height: el.scrollHeight
      });
      
      // Remove screenshot mode class
      el.classList.remove('screenshot-mode');
      
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const now = new Date();
          const dateStr = now.toLocaleDateString('vi-VN').replace(/\//g, '-');
          const timeStr = now.toLocaleTimeString('vi-VN', { hour12: false }).replace(/:/g, '-');
          const filename = `ThoiKhoaBieu_${dateStr}_${timeStr}.png`;
          saveAs(blob, filename);

          toast.success(<><i className="fa-solid fa-face-smile-beam mx-2"></i> Đã chụp ảnh thời khóa biểu thành công!</>, {
            position: "top-center",
            autoClose: 3000,
            style: {
              fontSize: '16px',
              fontWeight: 'bold'
            }
          });
        } else {
          toast.error(<><i className="fa-solid fa-circle-xmark mx-2"></i> Không thể tạo file ảnh!</>, {
            position: "top-right",
            autoClose: 3000,
          });
        }
        setIsCapturing(false);
      }, 'image/png', 0.95);
      
    } catch (error) {
      // Remove screenshot mode class in case of error
      el.classList.remove('screenshot-mode');
      setIsCapturing(false);
      console.error("Capture error:", error);

      toast.error(<><i className="fa-solid fa-circle-xmark mx-2"></i> Lỗi khi chụp ảnh! Vui lòng thử lại sau.</>, {
        position: "top-center",
        autoClose: 4000,
      });
    }
  };

  // Tính tổng tín chỉ
  const totalCredits = selected.reduce((total, subject) => {
    return total + parseInt(subject.so_tc || '0');
  }, 0);

  return (
    <div className="container-fluid px-2 py-3">
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center mb-4">
            <h1 className="mb-0 me-3 text-dark"><i className="fa-solid fa-calendar-days"></i> Thời Khóa Biểu</h1>
            <span className="badge bg-info fs-6 me-2">
              {selected.length} môn học
            </span>
            <span className="badge bg-success fs-6">
              {totalCredits} tín chỉ
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-2 col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-white py-2">
              <h6 className="mb-0 text-dark"><i className="fa-solid fa-magnifying-glass"></i> Tìm kiếm môn học</h6>
            </div>
            <div className="card-body p-3">
              <SubjectSelector data={data as Subject[]} onSelect={addSubject} />
            </div>
          </div>

          {selected.length > 0 && (
            <div className="card shadow-sm mt-3">
              <div className="card-header bg-dark text-white py-2">
                <h6 className="mb-0 text-light"><i className="fa-solid fa-book"></i> Môn học đã chọn</h6>
                <small className="d-block mt-1 mx-4">
                  {selected.length} môn - {totalCredits} tín chỉ
                </small>
              </div>
              <div className="card-body p-3">
                <div className="d-flex flex-column gap-2 mb-3">
                  {selected.map((mon) => (
                    <div key={mon.ma_mon} className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <button
                          className="btn btn-outline-danger btn-sm w-100"
                          onClick={() => removeSubject(mon.ma_mon)}
                          title={`Xóa ${mon.ten_mon}`}
                        >
                          <i className="fa-solid fa-xmark"></i> {mon.ma_mon} - {mon.ten_mon} - {mon.so_tc} tín chỉ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  className="btn btn-danger btn-sm w-100" 
                  onClick={clearAll}
                >
                  <i className="fa-solid fa-trash"></i> Xóa tất cả
                </button>
              </div>
            </div>
          )}

          <div className="card shadow-sm mt-3">
            <div className="card-header bg-warning text-dark py-2">
              <h6 className="mb-0"><i className="fa-solid fa-gear"></i> Công cụ</h6>
            </div>
            <div className="card-body p-3">
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-success btn-sm position-relative" 
                  onClick={captureImage}
                  disabled={selected.length === 0 || isCapturing}
                  style={{ 
                    background: isCapturing 
                      ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                      : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    border: 'none',
                    fontWeight: '600',
                    boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3)',
                    opacity: isCapturing ? 0.7 : 1
                  }}
                >
                  {isCapturing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang chụp...
                    </>
                  ) : (
                    <>
                      <i className="fa-regular fa-camera"></i> Chụp ảnh TKB
                      {selected.length > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                          {selected.length}
                        </span>
                      )}
                    </>
                  )}
                </button>
                <button 
                  className="btn btn-warning btn-sm" 
                  onClick={exportJson}
                  disabled={selected.length === 0}
                >
                  <i className="fa-solid fa-file-export"></i> Xuất JSON
                </button>
                <div>
                  <label className="form-label small"><i className="fa-solid fa-file-import"></i> Nhập JSON:</label>
                  <input
                    type="file"
                    accept=".json"
                    className="form-control form-control-sm"
                    onChange={importJson}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-10 col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white py-2">
              <h6 className="mb-0"><i className="fa-solid fa-calendar"></i> Thời khóa biểu</h6>
            </div>
            <div className="card-body p-2">
              <div id="timetable" className="table-container">
                <Timetable subjects={selected} />
              </div>
              {selected.length === 0 && (
                <div className="text-center py-5 text-muted">
                  <h5><i className="fa-solid fa-bookmark"></i> Chưa có môn học nào</h5>
                  <p>Hãy tìm kiếm và chọn môn học từ danh sách bên trái</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
