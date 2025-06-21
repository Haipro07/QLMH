import axios from "axios";

const API = "";

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

// Bật/tắt chế độ mock
const USE_MOCK = false;

export async function getMaterialsAPI() {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMaterials);
      }, 300);
    });
  }

  try {
    const res = await axios.get(`${API}/materials`);
    // map đảm bảo id là chuỗi, phòng trường hợp id là số hoặc null
    const materials = res.data.map((item) => ({
      ...item,
      id: String(item.id ?? ""), // nếu id null hoặc undefined, chuyển thành chuỗi rỗng
    }));
    return materials;
  } catch (err) {
    console.error("Lỗi khi tải tài liệu:", err.response?.data?.message || err.message);
    throw new Error(err.response?.data?.message || "Không thể tải danh sách tài liệu");
  }
}
