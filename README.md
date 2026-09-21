# Gotek | Công Nghệ Việt, Vươn Tầm Quốc Tế

> Website giới thiệu giải pháp phần mềm, chuyển đổi số và phát triển nền tảng công nghệ cao cấp của **Gotek**. Xây dựng theo tiêu chuẩn **Clean Architecture** dành cho Pure Vanilla Web (HTML5, CSS3, JavaScript ES6+), đảm bảo tải trang siêu tốc, bảo mật và tương thích mượt mà trên mọi thiết bị.

---

## 🏛️ Cấu Trúc Kiến Trúc Dự Án (Project Architecture)

Dự án được phân tách module rõ ràng, hoàn toàn không phụ thuộc framework cồng kềnh, dễ dàng bảo trì và mở rộng:

```text
gotek/
├── index.html                      # Trang chủ chính thức (kết nối toàn bộ CSS, JS và Data)
│
├── assets/                         # 📸 TÀI NGUYÊN TĨNH (STATIC ASSETS)
│   ├── images/
│   │   ├── banners/                # Ảnh banner lớn & nhân vật kỹ sư (hero-engineer-nobg.png)
│   │   ├── brands/                 # Logo thương hiệu Gotek và các phiên bản nhận diện
│   │   ├── icons/                  # Hệ thống biểu tượng SVG vector công nghệ
│   │   ├── partners/               # Logo đối tác hệ sinh thái (Go Media, GoNetwork, BytePlus, HILAB, CloudFly)
│   │   ├── projects/               # Ảnh chụp mockup thực tế các dự án tiêu biểu
│   │   ├── services/               # Hình ảnh minh họa chuyên sâu cho các dịch vụ
│   │   └── team/                   # Ảnh chụp đội ngũ kỹ sư và lãnh đạo Gotek
│   └── fonts/                      # Font chữ Plus Jakarta Sans tối ưu hiển thị tiếng Việt
│
├── css/                            # 🎨 HỆ THỐNG STYLESHEET (PURE VANILLA CSS)
│   ├── variables.css               # Design Tokens: Bảng màu thương hiệu (#0A1F68, #0055FF), typography, spacing
│   ├── reset.css                   # CSS Reset chuẩn hóa hiển thị đồng nhất đa trình duyệt
│   ├── components.css              # Các UI components tái sử dụng (Buttons, Cards, Badges, Modals...)
│   ├── footer.css                  # CSS chuyên biệt cho Footer đa tầng chuẩn gotek.asia
│   ├── responsive.css              # Tối ưu giao diện trên Laptop, Tablet (iPad) và Mobile
│   └── style.css                   # Stylesheet trung tâm quản lý bố cục và toàn bộ hiệu ứng chuyển động
│
├── js/                             # ⚡ LOGIC JAVASCRIPT MODULAR
│   ├── components/
│   │   ├── header.js               # Sticky navigation bar, Mega Menu, Drawer mobile menu
│   │   ├── footer.js               # Logic điều khiển Accordion và tương tác Footer
│   │   ├── form.js                 # Validation form tư vấn và xử lý gửi dữ liệu
│   │   ├── counter.js              # Hiệu ứng số đếm tăng dần (KPI metrics)
│   │   ├── magneticBtn.js          # Hiệu ứng hút chuột từ tính cho các nút CTA chính
│   │   ├── tabs.js                 # Chuyển đổi tab danh mục dự án và bảng giá
│   │   └── scrollAnimations.js     # Intersection Observer kích hoạt animation cuộn mượt mà
│   ├── utils/
│   │   └── helpers.js              # Hàm bổ trợ: debounce, format tiền tệ, xử lý fallback hình ảnh
│   ├── app.js                      # Controller nạp data tự động và render động ra DOM
│   └── main.js                     # Entry point khởi tạo toàn bộ ứng dụng khi DOM sẵn sàng
│
└── data/                           # 💾 DỮ LIỆU ĐỘC LẬP DẠNG JSON
    ├── site-config.json            # Cấu hình chung: Tên công ty, Hotline, Email, Chi nhánh, Social links
    ├── services.json               # Dữ liệu 7 nhóm giải pháp công nghệ trọng tâm
    ├── projects.json               # Danh sách dự án thực tế kèm chỉ số tăng trưởng KPIs
    ├── pricing.json                # Bảng báo giá các gói giải pháp doanh nghiệp
    ├── testimonials.json           # Đánh giá chứng thực từ khách hàng và đối tác
    └── data-store.js               # Module nạp dữ liệu thông minh (hỗ trợ cả HTTP Fetch lẫn file://)
```