import { useState } from "react";
import type { Subject } from "../types";

interface SubjectSelectorProps {
  data: Subject[];
  onSelect: (mon: Subject) => void;
}

export default function SubjectSelector({ data, onSelect }: SubjectSelectorProps) {
  const [keyword, setKeyword] = useState("");

  const results = data.filter(
    (mon) =>
      mon.ma_mon.toLowerCase().includes(keyword.toLowerCase()) ||
      mon.ten_mon.toLowerCase().includes(keyword.toLowerCase())
  );

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSubjectClick = (mon: Subject) => {
    onSelect(mon);
    setKeyword(""); // Clear search after selection
  };

  return (
    <div className="mb-4">
      <input
        className="form-control mb-2"
        placeholder="Nhập mã hoặc tên môn học"
        value={keyword}
        onChange={handleKeywordChange}
        autoComplete="off"
      />
      {keyword && (
        <div className="card">
          <ul className="list-group list-group-flush">
            {results.slice(0, 10).map((mon) => (
              <li
                key={mon.ma_mon}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                onClick={() => handleSubjectClick(mon)}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <strong>{mon.ma_mon}</strong> – {mon.ten_mon}
                  <br />
                  <small className="text-muted">
                    Nhóm {mon.nhom_to} {mon.to ? `- Tổ ${mon.to}` : ""} • {mon.tkb[0]?.giang_vien || "Chưa có GV"} • {mon.so_tc} tín chỉ
                  </small>
                </div>
              </li>
            ))}
            {results.length === 0 && (
              <li className="list-group-item text-muted text-center">
                Không tìm thấy môn học nào
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
