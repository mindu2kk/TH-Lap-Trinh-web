# Báo Cáo Thực Hiện Photo Sharing App

## Lab 1 — Xây dựng giao diện React (photo-sharing-v1)

### Yêu cầu & Thực hiện

#### Problem 1: Xây dựng ứng dụng React (40 điểm)

**Yêu cầu:**
- Hiển thị danh sách người dùng ở sidebar (UserList)
- Hiển thị thông tin chi tiết người dùng (UserDetail)
- Hiển thị ảnh và bình luận của người dùng (UserPhotos)
- TopBar hiển thị tên sinh viên bên trái, context bên phải
- Hỗ trợ deep-linking (refresh trang vẫn giữ đúng view)

**Thực hiện:**
- `components/UserList/index.jsx` — Danh sách user, click chuyển sang UserDetail, highlight user đang xem
- `components/UserDetail/index.jsx` — Hiển thị đầy đủ thông tin (tên, địa điểm, nghề nghiệp, mô tả), nút "View Photos"
- `components/UserPhotos/index.jsx` — Hiển thị tất cả ảnh, ngày giờ format đẹp, comments với link đến trang user
- `components/TopBar/index.jsx` — Tên "Minh" bên trái, context động bên phải (tên user hoặc "Photos of ...")
- Sử dụng React Router v6 với `useParams`, `useNavigate`, `useLocation`

#### Problem 2: Fetch dữ liệu từ server (20 điểm)

**Yêu cầu:**
- Implement hàm `fetchModel` trong `lib/fetchModelData.js`
- Các component dùng `fetchModel` thay vì local model data
- API: `/user/list`, `/user/:id`, `/photosOfUser/:id`, `/test/info`

**Thực hiện:**
- `lib/fetchModelData.js` — Dùng `fetch()` gọi API server, reject nếu HTTP error
- Backend `server.js` chạy ở port 3001, serve API và ảnh
- Frontend gọi trực tiếp `http://localhost:3001`

#### Extra Credit: Stepper (5 điểm)

**Yêu cầu:**
- Checkbox "Enable Advanced Features" trong TopBar
- Khi bật: xem từng ảnh một với nút Prev/Next
- Nút bị disable ở ảnh đầu/cuối
- URL deep-linkable cho từng ảnh

**Thực hiện:**
- State `advancedFeatures` quản lý ở `App.js`, truyền xuống qua props
- Route `/photos/:userId/stepper/:photoIndex` cho deep-linking
- Nút Previous/Next disable đúng ở đầu/cuối danh sách

---

## Lab 2 — Backend với MongoDB (photo-sharing-server_v2)

### Yêu cầu & Thực hiện

#### Problem 1: Xây dựng backend dùng MongoDB (40 điểm)

**Yêu cầu:**
- `GET /user/list` — Trả `_id, first_name, last_name`
- `GET /user/:id` — Trả `_id, first_name, last_name, location, description, occupation`, HTTP 400 nếu id không hợp lệ
- `GET /photosOfUser/:id` — Trả photos với comments đã có thông tin user, HTTP 400 nếu id không hợp lệ
- Không được thay đổi database schema
- Dùng Mongoose để query MongoDB Atlas

**Thực hiện:**
- `routes/UserRouter.js`:
  - `GET /user/list` — `User.find({}, "_id first_name last_name")`
  - `GET /user/:id` — Validate ObjectId, `User.findById()` với projection
- `routes/PhotoRouter.js`:
  - `GET /photosOfUser/:id` — Validate ObjectId, fetch photos, dùng `Promise.all` để populate user info cho từng comment concurrently
  - Tạo object mới từ Mongoose model (không trả thẳng Mongoose object)
- `db/dbLoad.js` — Fix bug `first` → `first_name` khi load data
- Server chạy ở port 3002, kết nối MongoDB Atlas

#### Problem 2: Frontend dùng backend mới (10 điểm)

**Yêu cầu:**
- `fetchModel` gọi API từ backend MongoDB
- UserList, UserDetail, UserPhotos dùng `fetchModel`

**Thực hiện:**
- `lib/fetchModelData.js` — Gọi `http://localhost:3002`
- Tất cả 3 component đều fetch từ server MongoDB

#### Extra Credit: Count bubbles & UserComments (10 điểm)

**Yêu cầu:**
- Sidebar hiển thị bubble xanh (số ảnh) và bubble đỏ (số comment) cạnh tên user
- Click bubble đỏ → view mới hiển thị tất cả comment của user
- Mỗi comment có thumbnail ảnh, click → chuyển đến photo detail

**Thực hiện:**
- `GET /user/counts` — Trả `{ _id, photoCount, commentCount }` cho tất cả users
- `GET /user/comments/:id` — Trả tất cả comments của user kèm thông tin ảnh
- `components/UserList/index.jsx` — Hiển thị 2 Chip (xanh/đỏ), click đỏ → `/comments/:userId`
- `components/UserComments/index.jsx` — Hiển thị danh sách comment với thumbnail, click → photo detail

---

## Cách chạy

### Lab 1
```bash
# Terminal 1 - Backend
cd photo-sharing-v1
node server.js

# Terminal 2 - Frontend
cd photo-sharing-v1
npm start
```

### Lab 2
```bash
# Load data (chạy 1 lần)
cd photo-sharing-server_v2
node ./db/dbLoad.js

# Terminal 1 - Backend MongoDB
cd photo-sharing-server_v2
npm start

# Terminal 2 - Frontend
cd photo-sharing-v1
npm start
```

Truy cập: **http://localhost:3000**
