// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API = "http://localhost:3002";       // JSON Server
const UPLOAD_API = "http://localhost:3001"; // Node Upload Server


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading khi khởi động

  // Khi app load lần đầu
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Cập nhật user vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Đăng nhập
  const login = async (email, password) => {
    try {
      const res = await axios.get(`${API}/users`, {
        params: {
          email: email.trim(),
          password: password.trim(),
        },
      });

      if (res.data.length === 0) {
        throw new Error("Email hoặc mật khẩu không đúng");
      }

      const loggedInUser = res.data[0];
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  // Đăng xuất
  const logout = () => {
    setUser(null);
  };

  // ✅ Hàm cập nhật thông tin user (dùng cho chỉnh sửa)
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,      // ✅ Cho phép component khác chỉnh sửa
        updateUser,   // ✅ Tuỳ chọn nếu muốn tách logic cập nhật
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
