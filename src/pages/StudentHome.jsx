import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Typography, Card, Space, Spin } from "antd";

const { Title, Paragraph } = Typography;

export default function StudentHome() {
  const { user, loading } = useAuth(); // ✅ thêm loading để tránh redirect sớm
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "student") {
        navigate("/login");
      }
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <Card>
        <Title level={3}>Chào mừng, {user?.name || "Sinh viên"}!</Title>
        <Paragraph>Hãy chọn chức năng bên dưới để tiếp tục học tập.</Paragraph>

        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Card hoverable>
            <Link to="/courses">
              <Title level={5}>📘 Danh sách môn học</Title>
              <Paragraph>Xem và truy cập các môn học hiện có.</Paragraph>
            </Link>
          </Card>

          <Card hoverable>
            <Link to="/documents">
              <Title level={5}>📄 Quản lý tài liệu</Title>
              <Paragraph>Xem các tài liệu liên quan đến môn học.</Paragraph>
            </Link>
          </Card>
        </Space>
      </Card>
    </div>
  );
}
