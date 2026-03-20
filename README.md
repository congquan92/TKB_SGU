# TKB SGU

> Ứng dụng web hỗ trợ sinh viên SGU chọn nhóm tổ và xây dựng thời khóa biểu nhanh, trực quan, tránh trùng lịch.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)

---

## 1) Overview: TKB SGU

**TKB SGU** là công cụ hỗ trợ sinh viên lập kế hoạch học tập, giải quyết bài toán dữ liệu môn học rời rạc. Ứng dụng tập trung vào trải nghiệm "chọn nhanh - nhìn rõ - check trùng tự động" trên Desktop.

> **Demo:** [tkb-sgu.vercel.app](https://tkb-sgu.vercel.app)

- **Tech Stack:** React (Vite), Tailwind CSS, Lucide Icons, Firebase Firestore, HTML-to-Image.
- **Tính năng cốt lõi:**
    - **Smart Booking:** Tìm kiếm môn/mã học phần, tự động phát hiện xung đột (overlap) và giới hạn một nhóm tổ trên mỗi mã môn.
    - **Visual Schedule:** Render TKB dạng Calendar Grid (Tiết 1 - 13), hỗ trợ Light/Dark mode.
    - **Management:** Lưu 5 phiên bản TKB so sánh, xuất/nhập file JSON hoặc chụp ảnh PNG chia sẻ nhanh.
    - **System:** Đếm lượt truy cập qua Firebase với cơ chế cooldown chống spam.
- **Luồng xử lý dữ liệu (Data Flow):**
    1.  **Input:** Người dùng search và chọn môn từ combobox.
    2.  **Logic:** Hệ thống convert dữ liệu thô sang `TimetableEvent`, kiểm tra trùng tiết (Conflict-check) theo ngày/giờ.
    3.  **Output:** Nếu hợp lệ, event được render lên grid và tự động đồng bộ vào LocalStorage theo từng phiên bản (Version).
- **Kỹ năng trọng tâm:**
    - **Frontend Architecture:** Tổ chức code theo Domain (`components`, `features`, `hooks`, `lib`).
    - **State Management:** Quản lý workflow phức tạp (Search -> Select -> Conflict-check -> Render) bằng Custom Hooks.
    - **UI/UX:** Thiết kế trạng thái đầy đủ (Empty state, loading, toast) và đảm bảo tính đồng bộ dữ liệu an toàn.

---

## 2) Setup & Run

Tạo file `.env` ở root dự án: `cp .env.example .env`

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### - Option 1: Chạy Local

```bash

npm install && npm run dev

npm run build && npm run preview

npm run lint
```

Mở trình duyệt tại: **[http://localhost:5173](http://localhost:5173)**

### - Option 2: Chạy với Docker

```bash
docker compose up -d --build
```

Mở trình duyệt tại: **[http://localhost:8080](http://localhost:8080)**

---
