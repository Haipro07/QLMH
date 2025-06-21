// src/api/auth.js
import axios from "axios";

const API = "";

export const loginAPI = async (email, password) => {
  if (!email || !password) {
    throw new Error("Vui lòng nhập đầy đủ email và mật khẩu");
  }

  try {
    const res = await axios.get(`${API}/users`, {
      params: { email: email.trim().toLowerCase() },
    });

    const user = res.data[0];

    if (!user) throw new Error("Email không tồn tại");

    if (user.password !== password.trim()) {
      throw new Error("Sai mật khẩu");
    }

    return user;
  } catch (err) {
    throw new Error(err.message || "Lỗi kết nối máy chủ");
  }
};

export const registerAPI = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error("Vui lòng nhập đầy đủ thông tin");
  }

  try {
    const check = await axios.get(`${API}/users`, {
      params: { email: email.trim().toLowerCase() },
    });

    if (check.data.length > 0) {
      throw new Error("Email đã tồn tại");
    }

    const newUser = {
      name,
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role: "student",
    };

    const res = await axios.post(`${API}/users`, newUser);
    return res.data;
  } catch (err) {
    throw new Error(err.message || "Lỗi khi đăng ký");
  }
};
