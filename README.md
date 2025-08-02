# 📚 Ứng dụng Thời Khóa Biểu (TKB)

Ứng dụng web hiện đại để quản lý và trực quan hóa thời khóa biểu học tập, được xây dựng bằng React + TypeScript + Vite.

## ✨ Tính năng

- 🔍 **Tìm kiếm môn học**: Tìm kiếm nhanh theo mã môn hoặc tên môn học
- ➕ **Thêm/Xóa môn học**: Quản lý danh sách môn học dễ dàng
- 🗓️ **Hiển thị thời khóa biểu**: Bảng thời khóa biểu trực quan với màu sắc phân biệt
- ⚠️ **Phát hiện trùng lịch**: Cảnh báo khi có môn học trùng thời gian
- 📸 **Xuất ảnh**: Chụp ảnh thời khóa biểu để lưu trữ
- 💾 **Xuất/Nhập JSON**: Lưu và khôi phục thời khóa biểu
- � **Đếm lượt truy cập**: Thống kê visitor với Firebase Firestore
- �📱 **Responsive design**: Tương thích trên mọi thiết bị

## 🛠️ Công nghệ sử dụng

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Bootstrap 5** - CSS Framework
- **Firebase/Firestore** - Database cho visitor counter
- **html2canvas** - Screenshot functionality
- **file-saver** - File download

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js >= 20.19.0
- npm hoặc yarn

### Cài đặt Firebase (Optional)
1. Tạo project Firebase tại [Firebase Console](https://console.firebase.google.com/)
2. Tạo Firestore Database
3. Copy `.env.example` thành `.env.local`
4. Điền thông tin Firebase vào `.env.local`

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd TKB

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## 📁 Cấu trúc thư mục

```
TKB/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── SubjectSelector.tsx
│   │   └── Timetable.tsx
│   ├── data/              # Data files
│   │   └── test10.json    # Sample subject data
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx            # Main app component
│   ├── App.css            # App-specific styles
│   ├── index.css          # Global styles
│   └── main.tsx           # Entry point
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md             # This file
```

## 💻 Hướng dẫn sử dụng

### 1. Tìm kiếm và thêm môn học
- Nhập mã môn hoặc tên môn vào ô tìm kiếm
- Click vào môn học để thêm vào thời khóa biểu
- Hệ thống sẽ cảnh báo nếu môn học đã được chọn

### 2. Quản lý môn học đã chọn
- Xem danh sách môn học đã chọn ở sidebar
- Click vào nút ❌ để xóa từng môn
- Sử dụng "Xóa tất cả" để xóa toàn bộ

### 3. Xem thời khóa biểu
- Bảng thời khóa biểu hiển thị theo tuần (Thứ 2 - Thứ 7)
- Mỗi môn học có màu sắc riêng biệt
- Hiển thị thông tin: Tên môn, Phòng học, Giảng viên
- Cảnh báo ⚠️ khi có trùng lịch

### 4. Xuất dữ liệu
- **Chụp ảnh**: Tạo file PNG của thời khóa biểu
- **Xuất JSON**: Lưu dữ liệu để backup hoặc chia sẻ
- **Nhập JSON**: Khôi phục thời khóa biểu từ file đã lưu

## 🎨 Customization

### Thêm dữ liệu môn học
Chỉnh sửa file `src/data/test10.json` với cấu trúc:

```json
[
  {
    "ma_mon": "801024",
    "ten_mon": "Tên môn học",
    "nhom_to": "01",
    "so_tc": "3",
    "tkb": [
      {
        "thu": "Thứ 2",
        "thoi_gian": "từ 07:00 đến 09:50",
        "phong": "Ph C.B106",
        "giang_vien": "GV Tên giảng viên",
        "ngay": "08/09/25 đến 03/11/25"
      }
    ]
  }
]
```

### Thay đổi màu sắc
Chỉnh sửa mảng `COLORS` trong `src/components/Timetable.tsx`:

```typescript
const COLORS = [
  '#FFE5E5', '#E5F3FF', '#E5FFE5', // Thêm màu mới
  // ...
];
```

## 🐛 Xử lý lỗi thường gặp

### Lỗi import modules
```bash
npm install html2canvas file-saver
npm install --save-dev @types/html2canvas @types/file-saver
```

### Lỗi TypeScript
Đảm bảo tất cả types được import đúng cách:
```typescript
import type { Subject } from "./types";
```

### Lỗi build
```bash
npm run lint  # Kiểm tra lỗi ESLint
npm run build # Build lại project
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Tác giả

- **Developer**: [`Quan`](https://www.facebook.com/cucngau.quan)


## 🙏 Acknowledgments

- Bootstrap team for the CSS framework
- React team for the amazing library
- Vite team for the fast build tool
