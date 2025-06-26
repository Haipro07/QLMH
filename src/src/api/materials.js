import axios from "axios";
const API = "http://localhost:3002";       // JSON Server
const UPLOAD_API = "http://localhost:3001"; // Node Upload Server

// Danh sách tài liệu giả lập (mock)
const mockMaterials = [
  {
    id: "1",
    title: "Tài liệu React",
    description: "PDF cơ bản về React.",
    type: "pdf",
    link: "https://example.com/react.pdf",
  },
  {
    id: "2",
    title: "Bài giảng RESTful API",
    description: "Video giới thiệu REST.",
    type: "video",
    link: "https://youtube.com/example",
  },
];

// Bật mock mode nếu muốn test offline (true = dùng mock data)
const USE_MOCK = false;

/**
 * Lấy danh sách tài liệu học tập
 * @returns {Promise<Array>} Mảng tài liệu
 */
export async function getMaterialsAPI() {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockMaterials), 300);
    });
  }

  try {
    const res = await axios.get(`${API}/materials`);
    return res.data.map((item) => ({
      ...item,
      id: String(item.id ?? ""), // đảm bảo id là chuỗi, tránh lỗi key khi render
    }));
  } catch (err) {
    console.error("Lỗi khi tải tài liệu:", err);
    throw new Error(
      err.response?.data?.message || "Không thể tải danh sách tài liệu"
    );
  }
}
