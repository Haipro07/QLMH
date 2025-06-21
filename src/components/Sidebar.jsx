// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Layout } from "antd";
import {
  HomeOutlined,
  BookOutlined,
  FileTextOutlined,
  UploadOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const { Sider } = Layout;

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const menuItems = user.role === "teacher"
    ? [
        {
          key: "/teacher",
          icon: <TeamOutlined />,
          label: <Link to="/teacher">Trang giảng viên</Link>,
        },
        {
          key: "/manage-courses",
          icon: <SettingOutlined />,
          label: <Link to="/manage-courses">Quản lý môn học</Link>,
        },
        {
          key: "/upload-material",
          icon: <UploadOutlined />,
          label: <Link to="/upload-material">Tải lên tài liệu</Link>,
        },
      ]
    : [
        {
          key: "/student",
          icon: <HomeOutlined />,
          label: <Link to="/student">Trang sinh viên</Link>,
        },
        {
          key: "/courses",
          icon: <BookOutlined />,
          label: <Link to="/courses">Môn học</Link>,
        },
        {
          key: "/documents",
          icon: <FileTextOutlined />,
          label: <Link to="/documents">Tài liệu</Link>,
        },
      ];

  return (
    <Sider
      width={220}
      style={{
        background: "#f9f9f9",
        minHeight: "100vh",
        borderRight: "1px solid #ddd",
        boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          fontSize: 18,
          color: "#1890ff",
          borderBottom: "1px solid #eee",
          letterSpacing: 0.5,
        }}
      >
        🎓 Hệ thống học tập
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{ paddingTop: 8 }}
      />
    </Sider>
  );
};

export default Sidebar;
