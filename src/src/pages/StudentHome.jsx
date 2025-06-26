// src/pages/StudentHome.jsx
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Typography, Card, Spin, Row, Col } from "antd";

const { Title, Paragraph } = Typography;

export default function StudentHome() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  const features = [
    {
      title: "Danh sách môn học",
      description: "Xem và đăng ký các môn học.",
      icon: "📘",
      link: "/courses",
    },
    {
      title: "Tài liệu học tập",
      description: "Truy cập tài liệu từ các môn học đã đăng ký.",
      icon: "📄",
      link: "/documents",
    },
    {
      title: "Trang cá nhân",
      description: "Xem và chỉnh sửa thông tin sinh viên.",
      icon: "👤",
      link: "/profile-student",
    },
    {
      title: "Học phí",
      description: "Xem thông tin và trạng thái học phí.",
      icon: "💵",
      link: "/tuition",
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 24px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 16 }}>
        🎓 Chào mừng, {user?.name || "Sinh viên"}!
      </Title>

      <Paragraph style={{ textAlign: "center", fontSize: 16 }}>
        Hãy chọn chức năng bên dưới để bắt đầu học tập 👇
      </Paragraph>

      <Row gutter={[24, 24]} justify="center" style={{ marginTop: 40 }}>
        {features.map((feature, index) => (
          <Col
            key={index}
            xs={24}
            sm={12}
            md={12}
            lg={6}
            xl={6}
          >
            <Link to={feature.link}>
              <Card
                hoverable
                bordered={false}
                style={{
                  textAlign: "center",
                  borderRadius: 12,
                  height: 200,
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                  transition: "transform 0.2s ease",
                }}
                bodyStyle={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  padding: 24,
                }}
              >
                <div style={{ fontSize: 40 }}>{feature.icon}</div>
                <Title level={5} style={{ marginTop: 16, marginBottom: 8 }}>
                  {feature.title}
                </Title>
                <Paragraph style={{ margin: 0, color: "#666" }}>
                  {feature.description}
                </Paragraph>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
