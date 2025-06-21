// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Typography, Button, Space } from "antd";
import { useAuth } from "../context/AuthContext";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AntHeader
      style={{
        backgroundColor: "#001529",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 100,
      }}
    >
      <Link to="/" style={{ textDecoration: "none" }}>
        <Title level={4} style={{ color: "#fff", margin: 0 }}>
          📘 Quản lý học tập
        </Title>
      </Link>

      {user && (
        <Space size="middle">
          <span style={{ color: "#fff", fontWeight: 500 }}>
            👋 Xin chào, {user.name}
          </span>
          <Button danger type="primary" size="middle" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Space>
      )}
    </AntHeader>
  );
}
