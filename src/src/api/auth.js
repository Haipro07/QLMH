import axios from "axios";

const API = "http://localhost:3002";       // JSON Server
const UPLOAD_API = "http://localhost:3001"; // Node Upload Server

// 🔐 API đăng nhập
export const loginAPI = async (email, password) => {
  if (!email || !password) {
    throw new Error("Vui lòng nhập đầy đủ email và mật khẩu");
  }

  try {
    const res = await axios.get(`${API}/users`, {
      params: { email: email.trim().toLowerCase() },
    });

    const user = res.data[0];

    if (!user) {
      throw new Error("Email không tồn tại");
    }

    if (user.password !== password.trim()) {
      throw new Error("Sai mật khẩu");
    }

    return user;
  } catch (err) {
    throw new Error(err?.response?.data?.message || err.message || "Lỗi khi đăng nhập");
  }
};

// 📝 API đăng ký
export const registerAPI = async ({ name, email, password, role, phone }) => {
  if (!name || !email || !password || !role) {
    throw new Error("Vui lòng nhập đầy đủ thông tin");
  }

  try {
    // Kiểm tra email trùng
    const check = await axios.get(`${API}/users`, {
      params: { email: email.trim().toLowerCase() },
    });

    if (check.data.length > 0) {
      throw new Error("Email đã tồn tại");
    }

    const newUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role,             // ✅ giữ đúng vai trò truyền vào (student / teacher)
      phone: phone?.trim() || "", // ✅ thêm số điện thoại nếu có
    };

    const res = await axios.post(`${API}/users`, newUser);
    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || err.message || "Lỗi khi đăng ký");
  }
};
