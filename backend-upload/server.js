const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

// Tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors());
app.use("/uploads", express.static("uploads")); // public access file

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // lưu trong thư mục uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // thêm timestamp để tránh trùng tên
  },
});

const upload = multer({ storage });

// API POST để upload file
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Start server
app.listen(3001, () => {
  console.log("Upload server running at http://localhost:3001");
});
