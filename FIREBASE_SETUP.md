# 🔥 Firebase Setup Guide

## Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" hoặc "Create a project"
3. Nhập tên project (ví dụ: `tkb-schedule`)
4. Chọn tùy chọn phù hợp và tiếp tục

## Bước 2: Tạo Web App

1. Trong Firebase Console, chọn project vừa tạo
2. Click vào icon web (</>) để thêm Firebase vào web app
3. Nhập app nickname (ví dụ: `TKB Web`)
4. Không cần chọn Firebase Hosting (trừ khi bạn muốn)
5. Click "Register app"

## Bước 3: Lấy Configuration

1. Sau khi đăng ký app, bạn sẽ thấy cấu hình Firebase
2. Copy các giá trị sau:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## Bước 4: Cấu hình Firestore Database

1. Trong Firebase Console, vào mục "Firestore Database"
2. Click "Create database"
3. Chọn "Start in test mode" (hoặc production mode)
4. Chọn location phù hợp (asia-southeast1 cho VN)
5. Click "Done"

## Bước 5: Cấu hình Security Rules

1. Trong Firestore Console, vào tab "Rules"
2. Thay thế rules mặc định bằng nội dung trong file `firestore.rules`
3. Click "Publish"

## Bước 6: Cấu hình Local Environment

1. Copy file `.env.example` thành `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Mở `.env.local` và điền thông tin Firebase:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. Khởi động lại development server:
   ```bash
   npm run dev
   ```

## Bước 7: Test

1. Mở ứng dụng trong browser
2. Kiểm tra console cho errors
3. Visitor counter sẽ hiển thị và tự động tăng

## Troubleshooting

### Lỗi: "Firebase configuration is incomplete"
- Kiểm tra `.env.local` có đúng format không
- Đảm bảo tất cả biến môi trường được điền

### Lỗi: "Permission denied"
- Kiểm tra Firestore rules
- Đảm bảo rules cho phép read/write vào collection `stats`

### Fallback mode
- Nếu Firebase không hoạt động, ứng dụng sẽ tự động chuyển sang fallback mode
- Sử dụng localStorage và GitHub API backup

## Production Deployment

Khi deploy lên production (Vercel/Netlify), nhớ:
1. Thêm environment variables vào deployment platform
2. Cập nhật Firestore rules cho production
3. Kiểm tra CORS settings nếu cần
