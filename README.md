# **P Store**

**P Store** là một dự án thương mại điện tử tập trung vào các sản phẩm bền vững và thân thiện với môi trường. Mục tiêu của chúng tôi là mang đến những sản phẩm chất lượng cao, giảm thiểu tác động xấu đến môi trường, và xây dựng thói quen tiêu dùng bền vững.

## **Mục lục**

<!-- AUTO-GENERATED-CONTENT:START (TOC:collapse=true&collapseText="Nhấn để xem mục lục") -->
<details>
<summary>Nhấn để xem mục lục</summary>

- [**1. Mục tiêu dự án**](#1-mục-tiêu-dự-án)
- [**2. Các tính năng chính**](#2-các-tính-năng-chính)
  - [2.1. Xác Thực & Phân Quyền Người Dùng](#21-xác-thực--phân-quyền-người-dùng)
  - [2.2. Quản Lý Sản Phẩm](#22-quản-lý-sản-phẩm)
  - [2.3. Quản Lý Giỏ Hàng](#23-quản-lý-giỏ-hàng)
  - [2.4. Quản Lý Đơn Hàng](#24-quản-lý-đơn-hàng)
  - [2.5. Quản Lý Mã Giảm Giá](#25-quản-lý-mã-giảm-giá)
  - [2.6. Quản Lý Địa Chỉ](#26-quản-lý-địa-chỉ)
  - [2.7. Quản Lý Giao Hàng](#27-quản-lý-giao-hàng)
  - [2.8. Tải Lên & Quản Lý Tập Tin](#28-tải-lên--quản-lý-tập-tin)
  - [2.9. Quản Lý Thanh Toán](#29-quản-lý-thanh-toán)
- [**3. Kiến trúc hệ thống**](#3-kiến-trúc-hệ-thống)
- [**4. Hình ảnh thực tế**](#4-hình-ảnh-thực-tế)
- [**5. Triển khai dự án**](#5-hướng-dẫn-cài-đặt-và-chạy-dự-án)

</details>
<!-- AUTO-GENERATED-CONTENT:END -->

## **1. Mục tiêu dự án**

- **Xây dựng nền tảng thương mại điện tử** chuyên bán các sản phẩm bền vững.
- **Mang lại trải nghiệm mua sắm trực quan và thân thiện** cho người tiêu dùng.
- **Tăng nhận thức cộng đồng** về tiêu dùng xanh và bền vững.

## **2. Các tính năng chính**

### 2.1. Xác Thực & Phân Quyền Người Dùng

- Đăng ký, đăng nhập bằng email và mật khẩu.
- Đăng nhập qua Google.
- Xác minh email, đặt lại mật khẩu.
- Quản lý vai trò và quyền hạn.

### 2.2. Quản Lý Sản Phẩm

- Tạo, cập nhật, xóa sản phẩm.
- Quản lý danh mục, thuộc tính, biến thể, và SKU.
- Xuất bản/gỡ xuất bản sản phẩm.

### 2.3. Quản Lý Giỏ Hàng

- Thêm, cập nhật, xóa sản phẩm trong giỏ.
- Xóa sạch giỏ hàng.
- Lấy thông tin chi tiết giỏ hàng.

### 2.4. Quản Lý Đơn Hàng

- Tạo, cập nhật, quản lý đơn hàng.
- Áp dụng mã giảm giá, tính phí giao hàng.
- Cập nhật trạng thái đơn hàng, điều chỉnh tồn kho.

### 2.5. Quản Lý Mã Giảm Giá

- Tạo, cập nhật, xóa mã giảm giá.
- Xác thực và áp dụng mã giảm giá, quản lý giới hạn và thời hạn sử dụng.

### 2.6. Quản Lý Địa Chỉ

- Thêm, cập nhật, xóa địa chỉ người dùng.
- Đặt địa chỉ giao hàng mặc định.
- Lấy gợi ý địa chỉ từ API bên ngoài.

### 2.7. Quản Lý Giao Hàng

- Tạo, cập nhật, xóa phương thức giao hàng.
- Tính phí dựa trên khoảng cách/phương thức.
- Kích hoạt hoặc vô hiệu hóa phương thức giao hàng.

### 2.8. Tải Lên & Quản Lý Tập Tin

- Tải lên/quản lý hình ảnh sản phẩm qua Cloudinary.
- Xóa tập tin cục bộ sau khi tải lên thành công.

### 2.9. Quản Lý Thanh Toán

- Hỗ trợ thanh toán qua MoMo với thẻ ATM.
- Thẻ ATM mẫu để test: `9704000000000018`, ngày hết hạn: `03/07`, tên chủ thẻ: `NGUYEN VAN A`, OTP (cần tạo khi test).

## **3. Kiến trúc hệ thống**

![Kiến trúc hệ thống](./docs/images/Architecture.jpg)

- **Backend**: Node.js/Express với các middleware như `cors`, `helmet`, `express-session`, và quản lý API qua `/v1/api`.
- **Frontend**: [React hoặc framework tương tự], tích hợp với backend qua API và hỗ trợ tải lên file.
- **Database**: [MongoDB hoặc PostgreSQL] cho quản lý sản phẩm, đơn hàng, và người dùng.
- **Deployment**: Frontend và backend được triển khai riêng biệt (xem phần [Triển khai](#6-triển-khai-deployment)).

## **4. Hình ảnh thực tế**

Dưới đây là một số ảnh chụp màn hình thể hiện các tính năng chính của P Store:

- **Architecture**: ![Kiến trúc hệ thống](./docs/images/Architecture.jpg)
- **Cart**: ![Giỏ hàng](./docs/images/cart.png)
- **Checkout**: ![Thanh toán](./docs/images/checkout.png)
- **Home**: ![Trang chủ](./docs/images/home.png)
- **Home 1**: ![Trang chủ 1](./docs/images/home1.png)
- **Home 2**: ![Trang chủ 2](./docs/images/home2.png)
- **Home 3**: ![Trang chủ 3](./docs/images/home3.png)
- **Login**: ![Đăng nhập](./docs/images/login.png)
- **Manage**: ![Quản lý](./docs/images/manage.png)
- **Product**: ![Sản phẩm](./docs/images/product.png)
- **Search**: ![Tìm kiếm](./docs/images/search.png)

## **5. Triển khai dự án**

P Store là nền tảng thương mại điện tử trực tuyến đầy đủ chức năng, tập trung vào các **sản phẩm bền vững** và **thân thiện với môi trường**. Dưới đây là thông tin chi tiết về các thành phần triển khai của hệ thống.

---

## 🔗 Link Triển Khai

- **Frontend:** [https://zerror-two-store-by95.vercel.app](https://zerror-two-store-by95.vercel.app)
- **Backend API:** [https://zerror-two-store.onrender.com](https://zerror-two-store.onrender.com)

---

## 🧩 Thành Phần Hệ Thống

### 📱 Frontend: P Store UI

- Sử dụng **React** để xây dựng giao diện người dùng thân thiện, tối ưu cho trải nghiệm mua sắm.
- Triển khai trên **Vercel**, đảm bảo:
  - Tốc độ tải nhanh.
  - Tương thích tốt trên mọi thiết bị.
  - Tự động triển khai và mở rộng linh hoạt.

### 🔧 Backend: P Store API

- Phát triển bằng **Node.js/Express**.
- Cung cấp các API endpoint để:
  - Xác thực người dùng.
  - Quản lý sản phẩm, giỏ hàng, đơn hàng.
  - Tích hợp thanh toán.
- Triển khai trên **Render** giúp quản lý hiệu quả và tích hợp liền mạch với frontend.

### 🗄️ Cơ Sở Dữ Liệu: MongoDB Atlas

- Dữ liệu người dùng, sản phẩm, đơn hàng... được lưu trữ trong **MongoDB Atlas**.
- Đảm bảo:
  - Độ tin cậy cao.
  - Bảo mật dữ liệu.
  - Khả năng mở rộng linh hoạt theo nhu cầu thực tế.

---

## 🚀 Hướng Dẫn Truy Cập

- **Frontend**: Truy cập giao diện người dùng để duyệt sản phẩm, thêm vào giỏ hàng và thanh toán.
- **Backend API**: Khám phá các endpoint API hoặc tích hợp với ứng dụng khác (liên hệ đội ngũ phát triển để nhận tài liệu chi tiết nếu cần).
- **Nhà phát triển**: Có thể kiểm tra cấu trúc dữ liệu thông qua các endpoint kết nối với MongoDB Atlas.

---

## ⚠️ Lưu Ý

- Đây là **phiên bản thử nghiệm**. Vui lòng gửi phản hồi nếu gặp sự cố hoặc có đề xuất cải thiện.
- Để **thử nghiệm thanh toán**, bạn có thể sử dụng thông tin thẻ mẫu sau:

Số thẻ: 9704000000000018  
Ngày hết hạn: 03/07  
Tên chủ thẻ: NGUYEN VAN A  
OTP: OTP
