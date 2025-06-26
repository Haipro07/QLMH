// src/pages/TeacherDashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Typography,
  Card,
  Row,
  Col,
} from "antd";
import {
  BookOutlined,
  CloudUploadOutlined,
  IdcardOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function TeacherDashboard() {
  const { user } = useAuth();

  const features = [
    {
      title: "Quản lý môn học",
      description: "Thêm, xoá và cập nhật thông tin môn học bạn đang giảng dạy.",
      icon: <BookOutlined style={{ fontSize: 40, color: "#1890ff" }} />,
      link: "/manage-courses",
    },
    {
      title: "Tải lên tài liệu",
      description: "Chia sẻ tài liệu học tập cho sinh viên một cách dễ dàng.",
      icon: <CloudUploadOutlined style={{ fontSize: 40, color: "#52c41a" }} />,
      link: "/upload-material",
    },
    {
      title: "Thông tin cá nhân",
      description: "Xem và cập nhật hồ sơ giảng viên của bạn.",
      icon: <IdcardOutlined style={{ fontSize: 40, color: "#faad14" }} />,
      link: "/profile-teacher",
    },
    {
      title: "Danh sách sinh viên",
      description: "Xem danh sách sinh viên đã đăng ký học phần của bạn.",
      icon: <TeamOutlined style={{ fontSize: 40, color: "#722ed1" }} />,
      link: "/student-list",
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 24px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        🎓 Chào mừng, {user?.name || "Giảng viên"}!
      </Title>

      <Paragraph style={{ textAlign: "center", fontSize: 16 }}>
        Hãy chọn chức năng bên dưới để bắt đầu quản lý môn học, tài liệu và sinh viên.
      </Paragraph>

      <Row gutter={[24, 24]} justify="center" style={{ marginTop: 40 }}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={12} lg={12} key={index}>
            <Link to={feature.link}>
              <Card
                hoverable
                bordered
                style={{
                  textAlign: "center",
                  height: 220,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "16px",
                }}
              >
                {feature.icon}
                <Title level={4} style={{ marginTop: 16 }}>{feature.title}</Title>
                <Paragraph style={{ margin: 0 }}>{feature.description}</Paragraph>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
