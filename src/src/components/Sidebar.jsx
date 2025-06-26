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
  UserOutlined,
  DollarOutlined,
  IdcardOutlined,
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
        {
          key: "/profile-teacher",
          icon: <IdcardOutlined />,
          label: <Link to="/profile-teacher">Thông tin cá nhân</Link>,
        },
        {
          key: "/student-list",
          icon: <UserOutlined />,
          label: <Link to="/student-list">Danh sách sinh viên</Link>,
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
          label: <Link to="/courses">Đăng ký môn học</Link>,
        },
        {
          key: "/documents",
          icon: <FileTextOutlined />,
          label: <Link to="/documents">Tài liệu</Link>,
        },
        {
          key: "/tuition",
          icon: <DollarOutlined />,
          label: <Link to="/tuition">Học phí</Link>,
        },
        {
          key: "/profile-student",
          icon: <IdcardOutlined />,
          label: <Link to="/profile-student">Trang cá nhân</Link>,
        },
      ];

  return (
    <Sider
      width={220}
      style={{
        backgroundColor: "#001529", // đồng bộ với Header
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 10,
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
          color: "#fff",
          borderBottom: "1px solid #003a8c",
        }}
      >
        🎓 Học tập
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{
          backgroundColor: "#001529",
          borderRight: 0,
        }}
      />
    </Sider>
  );
};

export default Sidebar;
