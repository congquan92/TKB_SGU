import { useEffect, useState } from "react";
import SubjectSelector from "./components/SubjectSelector";
import Timetable from "./components/Timetable";
import DonateModal from "./components/DonateModal";
import VisitorCounter from "./components/VisitorCounter";
import { useTheme } from "./hooks/useTheme";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Subject } from "./types";
import data from "./data/dsCustom.json";

export default function App() {
  // Khôi phục dữ liệu từ localStorage khi khởi tạo
  const [selected, setSelected] = useState<Subject[]>(() => {
    try {
      const savedSubjects = localStorage.getItem('tkb-selected-subjects');
      if (savedSubjects) {
        const parsed = JSON.parse(savedSubjects);
        
        // Validate dữ liệu cơ bản
        if (Array.isArray(parsed)) {
          // Import tất cả môn, không lọc theo sl_cl
          return parsed.filter((savedSubject: Subject) => {
            const originalSubject = data.find(d => 
              d.ma_mon === savedSubject.ma_mon && 
              d.nhom_to === savedSubject.nhom_to &&
              d.to === savedSubject.to
            );
            
            // Giữ lại môn nếu tìm thấy trong data gốc (không quan tâm sl_cl)
            return originalSubject !== undefined;
          });
        }
      }
    } catch (error) {
      console.error('Lỗi khi khôi phục dữ liệu từ localStorage:', error);
    }
    return [];
  });
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  
  // Toggle để bỏ qua kiểm tra sl_cl - Mặc định luôn bỏ qua kiểm tra
  const [ignoreSlotLimit, setIgnoreSlotLimit] = useState(true); // Luôn mặc định true
  
  const { theme, toggleTheme } = useTheme();

  // Xử lý khi toggle thay đổi
  useEffect(() => {
    if (!ignoreSlotLimit && selected.length > 0) {
      // Khi tắt toggle, loại bỏ các môn hết chỗ
      const validSubjects = selected.filter(subject => {
        const originalSubject = data.find(d => 
          d.ma_mon === subject.ma_mon && 
          d.nhom_to === subject.nhom_to &&
          d.to === subject.to
        );
        return !originalSubject || originalSubject.sl_cl === undefined || originalSubject.sl_cl > 0;
      });
      
      const removedCount = selected.length - validSubjects.length;
      if (removedCount > 0) {
        setSelected(validSubjects);
        toast.warning(`Đã loại bỏ ${removedCount} môn hết chỗ khi bật kiểm tra SL`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  }, [ignoreSlotLimit, selected]); // Chạy khi toggle thay đổi

  // Lưu dữ liệu vào localStorage mỗi khi selected thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('tkb-selected-subjects', JSON.stringify(selected));
      // if (selected.length > 0) {
      //   console.log('Đã lưu thời khóa biểu vào localStorage:', selected.length, 'môn học');
      // }
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu vào localStorage:', error);
    }
  }, [selected]);

  // Hiển thị thông báo khi khôi phục dữ liệu thành công
  useEffect(() => {
    const savedSubjects = localStorage.getItem('tkb-selected-subjects');
    if (savedSubjects && selected.length > 0) {
      try {
        if (selected.length > 0) {
          toast.success(`Đã khôi phục ${selected.length} môn học từ lần trước`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra dữ liệu saved:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy một lần khi component mount

  const addSubject = (mon: Subject) => {
    // Kiểm tra môn đã được chọn chưa
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

    // Kiểm tra số lượng chỗ còn lại (chỉ khi không bỏ qua kiểm tra)
    if (!ignoreSlotLimit && mon.sl_cl !== undefined && mon.sl_cl <= 0) {
      toast.error(`Môn ${mon.ma_mon} đã hết chỗ! Không thể chọn môn này.`, {
        position: "top-center",
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
          autoClose: 3000,
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
      autoClose: 1000,
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
            // Parse time - hỗ trợ cả hai định dạng
            let newStart = -1, newEnd = -1, existStart = -1, existEnd = -1;
            
            // Kiểm tra định dạng "tiết X->Y" cho session mới
            const newTietMatch = newSession.thoi_gian.match(/tiết (\d+)->(\d+)/);
            if (newTietMatch) {
              newStart = parseInt(newTietMatch[1]);
              newEnd = parseInt(newTietMatch[2]);
            } else {
              // Kiểm tra định dạng "từ HH:mm đến HH:mm"
              const newMatch = newSession.thoi_gian.match(/từ (\d{2}:\d{2}) đến (\d{2}:\d{2})/);
              if (newMatch) {
                newStart = parseTime(newMatch[1]);
                newEnd = parseTime(newMatch[2]);
              }
            }
            
            // Kiểm tra định dạng "tiết X->Y" cho session hiện có
            const existTietMatch = session.thoi_gian.match(/tiết (\d+)->(\d+)/);
            if (existTietMatch) {
              existStart = parseInt(existTietMatch[1]);
              existEnd = parseInt(existTietMatch[2]);
            } else {
              // Kiểm tra định dạng "từ HH:mm đến HH:mm"
              const existMatch = session.thoi_gian.match(/từ (\d{2}:\d{2}) đến (\d{2}:\d{2})/);
              if (existMatch) {
                existStart = parseTime(existMatch[1]);
                existEnd = parseTime(existMatch[2]);
              }
            }
            
            // Kiểm tra overlap nếu cả hai đều được parse thành công
            if (newStart !== -1 && newEnd !== -1 && existStart !== -1 && existEnd !== -1) {
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

  const clearAll = () => {
    setSelected([]);
    // Xóa luôn dữ liệu trong localStorage
    localStorage.removeItem('tkb-selected-subjects');
    toast.info("Đã xóa tất cả môn học và dữ liệu lưu trữ", {
      position: "top-right",
      autoClose: 1000,
    });
  };

  const removeSubject = (ma_mon: string) => {
    const removedSubject = selected.find(m => m.ma_mon === ma_mon);
    setSelected(selected.filter((m) => m.ma_mon !== ma_mon));
    if (removedSubject) {
      toast.info(`Đã xóa môn ${removedSubject.ma_mon} - ${removedSubject.ten_mon}`, {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const exportJson = () => {
    selected.map(subject => { subject.id_to_hoc = undefined; }); // Xóa id_to_hoc trước khi xuất
    const blob = new Blob([JSON.stringify(selected, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, `thoikhoabieu_${new Date().toISOString().split('T')[0]}.json`);
    toast.success("Đã xuất file JSON thành công!", {
      position: "top-right",
      autoClose: 1000,
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
            // Import tất cả môn, không lọc theo sl_cl
            const importedSubjects = arr as Subject[];
            const validSubjects: Subject[] = [];
            
            importedSubjects.forEach(importedSubject => {
              const originalSubject = data.find(d => 
                d.ma_mon === importedSubject.ma_mon && 
                d.nhom_to === importedSubject.nhom_to &&
                d.to === importedSubject.to
              );
              
              // Import tất cả môn tìm thấy trong data gốc
              if (originalSubject) {
                validSubjects.push(importedSubject);
              }
            });
            
            // Kiểm tra trùng lịch trong danh sách hợp lệ
            const conflicts = findConflictsInList(validSubjects);
            
            if (conflicts.length > 0) {
              toast.error(
                `File JSON có trùng lịch! Các môn bị trùng: ${conflicts.join(", ")}`,
                {
                  position: "top-center",
                  autoClose: 3000,
                }
              );
              return;
            }
            
            // Kiểm tra trùng lịch với môn học hiện tại
            const existingConflicts: string[] = [];
            validSubjects.forEach(newSubject => {
              const hasConflict = checkScheduleConflict(newSubject, selected);
              if (hasConflict.length > 0) {
                existingConflicts.push(newSubject.ma_mon);
              }
            });
            
            if (existingConflicts.length > 0) {
              toast.error(
                `Một số môn trong file bị trùng lịch với môn đã chọn: ${existingConflicts.join(", ")}`,
                {
                  position: "top-center",
                  autoClose: 3000,
                }
              );
              return;
            }
            
            setSelected(validSubjects);
            // localStorage sẽ được cập nhật tự động qua useEffect
            const successMessage = `Đã nhập file JSON thành công! ${validSubjects.length} môn học đã được lưu`;
              
            toast.success(successMessage, {
              position: "top-right",
              autoClose: 3000,
            });
          } else {
            toast.error("File không đúng định dạng dữ liệu môn học!", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        } else {
          toast.error("File phải chứa một mảng dữ liệu!", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("JSON parse error:", error);
        toast.error("File JSON lỗi hoặc không hợp lệ!", {
          position: "top-right",
          autoClose: 3000,
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
      autoClose: 1000,
    });
    
    // Prepare variables for hiding slot info
    let slotInfoElements: NodeListOf<Element> | null = null;
    let originalDisplayValues: string[] = [];
    
    try {
      // Add screenshot mode class for better quality and hide count info
      el.classList.add('screenshot-mode');
      document.body.classList.add('capturing');
      
      // Hide all slot info elements directly
      slotInfoElements = document.querySelectorAll('.print-hide, .subject-count-badge, .subject-count-header');
      originalDisplayValues = [];
      
      slotInfoElements.forEach((element, index) => {
        const htmlElement = element as HTMLElement;
        originalDisplayValues[index] = htmlElement.style.display;
        htmlElement.style.display = 'none';
      });
      
      // Wait for DOM update to apply capturing class
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Scroll to table and ensure it's visible
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Wait for scroll and rendering to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.info(" Đang chụp ảnh...", {
        position: "top-right",
        autoClose: 1000,
      });
      
      const canvas = await html2canvas(el, {
        background: '#ffffff',
        useCORS: true,
        allowTaint: true,
        width: el.scrollWidth,
        height: el.scrollHeight,
        logging: false
      });
      
      // Remove screenshot mode class and restore slot info
      el.classList.remove('screenshot-mode');
      document.body.classList.remove('capturing');
      
      // Restore original display values
      if (slotInfoElements) {
        slotInfoElements.forEach((element, index) => {
          const htmlElement = element as HTMLElement;
          htmlElement.style.display = originalDisplayValues[index] || '';
        });
      }
      
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const now = new Date();
          const dateStr = now.toLocaleDateString('vi-VN').replace(/\//g, '-');
          const timeStr = now.toLocaleTimeString('vi-VN', { hour12: false }).replace(/:/g, '-');
          const filename = `ThoiKhoaBieu_${dateStr}_${timeStr}.png`;
          saveAs(blob, filename);

          toast.success(<><i className="fa-solid fa-face-smile-beam mx-2"></i> Đã chụp ảnh thời khóa biểu thành công!</>, {
            position: "top-center",
            autoClose: 2000,
            style: {
              fontSize: '16px',
              fontWeight: 'bold'
            }
          });
        } else {
          toast.error(<><i className="fa-solid fa-circle-xmark mx-2"></i> Không thể tạo file ảnh!</>, {
            position: "top-right",
            autoClose: 2000,
          });
        }
        setIsCapturing(false);
      }, 'image/png', 1.0); // Tăng quality lên 100%
      
    } catch (error) {
      // Remove screenshot mode class in case of error
      el.classList.remove('screenshot-mode');
      document.body.classList.remove('capturing');
      
      // Restore original display values in case of error
      if (slotInfoElements) {
        slotInfoElements.forEach((element) => {
          const htmlElement = element as HTMLElement;
          htmlElement.style.display = '';
        });
      }
      
      setIsCapturing(false);
      console.error("Capture error:", error);

      toast.error(<><i className="fa-solid fa-circle-xmark mx-2"></i> Lỗi khi chụp ảnh! Vui lòng thử lại sau.</>, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };
  // Thông báo mới 
  useEffect(() => {
    const toastMessage = "Dữ liệu trên được cập nhật lần cuối vào 18:00pm 1/8/2025.";
    toast.info(toastMessage, {
      position: "top-center",
      autoClose: 3000,
      closeOnClick: true,
      draggable: true,  
       style: {
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--surface-color)',
            }
    });
    // Thông báo về tính năng mới
    // setTimeout(() => {
    //   toast.info("Tính năng mới: Bật/tắt kiểm tra số lượng chỗ bằng nút toggle ở góc phải!", {
    //     position: "bottom-right",
    //     autoClose: 8000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     draggable: true,
    //   });
    // }, 8000);
    
  }, []);

  // Tính tổng tín chỉ
  const totalCredits = selected.reduce((total, subject) => {
    return total + parseInt(subject.so_tc || '0');
  }, 0);

  return (
    <div className="container-fluid px-2 py-3">
      {/* Header */}
      <div className="mb-4" style={{
        backgroundColor: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '16px 20px'
      }}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <h1 className="mb-0 d-flex align-items-center gap-2">
              <i className="fa-solid fa-graduation-cap" style={{ color: 'var(--text-primary)' }}></i>
              <span style={{ color: 'var(--text-primary)' }}>Thời Khóa Biểu SGU</span>
            </h1>
            <span className="badge subject-count-badge" style={{ 
              background: 'var(--text-primary)', 
              color: 'var(--background-color)',
              borderRadius: '16px',
              padding: '6px 12px'
            }}>
              {selected.length} môn học
            </span>
            <span className="badge subject-count-badge" style={{ 
              background: 'var(--text-primary)', 
              color: 'var(--background-color)',
              borderRadius: '16px',
              padding: '6px 12px'
            }}>
              {totalCredits} tín chỉ
            </span>
            {/* Visitor Counter - Ẩn khi chụp ảnh */}
            {!isCapturing && <VisitorCounter />}
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* Theme Toggle */}
            <div 
              onClick={toggleTheme}
              title={theme === 'light' ? 'Chuyển sang dark mode' : 'Chuyển sang light mode'}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--text-primary)',
                color: 'var(--background-color)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              {theme === 'light' ? (
                <i className="fa-solid fa-moon" style={{ fontSize: '16px', color: 'var(--background-color)' }}></i>
              ) : (
                <i className="fa-solid fa-sun" style={{ fontSize: '16px', color: 'var(--background-color)' }}></i>
              )}
            </div>
            
            {/* Donate Button */}
            <button 
              onClick={() => setShowDonateModal(true)}
              title="Ủng hộ dự án"
              style={{
                backgroundColor: 'var(--text-primary)',
                color: 'var(--background-color)',
                border: 'none',
                borderRadius: '24px',
                padding: '8px 20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="fa-solid fa-heart"></i> Donate
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-3 col-md-4 mb-4">
          <div className="card shadow-sm" style={{
            backgroundColor: 'var(--surface-color)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}>
            <div className="card-header py-2" style={{
              backgroundColor: 'var(--surface-color)',
              borderBottomColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0"><i className="fa-solid fa-magnifying-glass"></i> Tìm kiếm môn học</h6>
                <div className="d-flex align-items-center gap-2">          
                  <span 
                    style={{ 
                      fontSize: '12px', 
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                      onClick={() => setIgnoreSlotLimit(!ignoreSlotLimit)}
                  >
                    {ignoreSlotLimit ? "Bỏ qua SL" : "Kiểm tra SL"}
                  </span>
                  <div 
                    onClick={() => setIgnoreSlotLimit(!ignoreSlotLimit)}
                    title={ignoreSlotLimit ? "Đang bỏ qua kiểm tra số lượng chỗ - có thể chọn môn đã hết chỗ" : "Bật để kiểm tra số lượng chỗ - loại bỏ môn hết chỗ"}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      fontSize: '14px'
                    }}
                    // onMouseEnter={(e) => {
                    //   e.currentTarget.style.transform = 'scale(1.1)';
                    //   e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                    // }}
                    // onMouseLeave={(e) => {
                    //   e.currentTarget.style.transform = 'scale(1)';
                    //   e.currentTarget.style.boxShadow = 'none';
                    // }}
                  >
                    
                    {ignoreSlotLimit ? (
                      <i className="fa-solid fa-lock-open" style={{ fontSize: '14px' }}></i>
                    ) : (
                      <i className="fa-solid fa-lock" style={{ fontSize: '14px' }}></i>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-3">
              <SubjectSelector 
                data={data as Subject[]} 
                onSelect={addSubject} 
                ignoreSlotLimit={ignoreSlotLimit}
              />
            </div>
          </div>

          {selected.length > 0 && (
            <div className="card shadow-sm mt-3" style={{
              backgroundColor: 'var(--surface-color)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}>
              <div className="card-header py-2" style={{
                backgroundColor: 'var(--surface-color)',
                borderBottomColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}>
                <h6 className="mb-0 subject-count-header"><i className="fa-solid fa-book"></i> Môn học đã chọn ({selected.length})</h6>
              </div>
              <div className="card-body p-3">
                <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {selected.map((mon) => (
                    <div
                      key={mon.ma_mon}
                      className="btn btn-sm text-start d-flex justify-content-between align-items-center"
                      style={{
                        backgroundColor: 'var(--background-color)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600' }}>
                          {mon.ma_mon} - {mon.ten_mon}
                        </div>
                        <small style={{ opacity: 0.8 }}>
                          {mon.so_tc} TC - Nhóm {mon.nhom_to} {mon.to ? `- Tổ ${mon.to}` : ""}
                        </small>
                        
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSubject(mon.ma_mon);
                        }}
                        className="btn btn-sm ms-2"
                        title={`Click để xóa ${mon.ten_mon}`}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: 'var(--error-color)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--error-color)';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--error-color)';
                        }}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="card shadow-sm mt-3" style={{
            backgroundColor: 'var(--surface-color)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}>
            <div className="card-header py-2" style={{
              backgroundColor: 'var(--surface-color)',
              borderBottomColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}>
              <h6 className="mb-0"><i className="fa-solid fa-gear"></i> Công cụ</h6>
            </div>
            <div className="card-body p-3">
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-success btn-sm" 
                  onClick={captureImage}
                  disabled={selected.length === 0 || isCapturing}
                  style={{ 
                    backgroundColor: selected.length === 0 || isCapturing ? 'var(--text-disabled)' : 'var(--success-color)',
                    borderColor: selected.length === 0 || isCapturing ? 'var(--text-disabled)' : 'var(--success-color)',
                    color: 'white'
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
                    </>
                  )}
                </button>
                <button 
                  className="btn btn-sm" 
                  onClick={exportJson}
                  disabled={selected.length === 0}
                  style={{ 
                    backgroundColor: selected.length === 0 ? 'var(--text-disabled)' : 'var(--warning-color)',
                    borderColor: selected.length === 0 ? 'var(--text-disabled)' : 'var(--warning-color)',
                    color: selected.length === 0 ? 'var(--text-secondary)' : 'var(--background-color)'
                  }}
                >
                  <i className="fa-solid fa-file-export"></i> Xuất JSON
                </button>
                <button 
                  className="btn btn-sm" 
                  onClick={clearAll}
                  disabled={selected.length === 0}
                  style={{ 
                    backgroundColor: selected.length === 0 ? 'var(--text-disabled)' : 'var(--error-color)',
                    borderColor: selected.length === 0 ? 'var(--text-disabled)' : 'var(--error-color)',
                    color: 'white'
                  }}
                >
                  <i className="fa-solid fa-trash"></i> Xóa tất cả ({selected.length})
                </button>
                <div>
                  <label className="form-label small" style={{ color: 'var(--text-primary)' }}>
                    <i className="fa-solid fa-file-import"></i> Nhập JSON:
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    className="form-control form-control-sm"
                    onChange={importJson}
                    style={{
                      backgroundColor: 'var(--background-color)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                
              
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-9 col-md-8">
          <div className="card shadow-sm" style={{
            backgroundColor: 'var(--surface-color)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}>
            <div className="card-header py-2" style={{
              backgroundColor: 'var(--surface-color)',
              borderBottomColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}>
              <h6 className="mb-0"><i className="fa-solid fa-calendar"></i> Thời khóa biểu ({selected.length} môn - {totalCredits} tín chỉ)</h6>
            </div>
            <div className="card-body p-2">
              <div id="timetable" className="table-container">
                <Timetable subjects={selected} />
              </div>
              {selected.length === 0 && (
                <div className="text-center py-5" style={{ color: 'var(--text-secondary)' }}>
                  <h5><i className="fa-solid fa-bookmark"></i> Chưa có môn học nào</h5>
                  <p>Hãy tìm kiếm và chọn môn học từ danh sách bên trái</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    
      
      {/* Donate Modal */}
      <DonateModal 
        show={showDonateModal} 
        onHide={() => setShowDonateModal(false)} 
      />
      
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
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
}
