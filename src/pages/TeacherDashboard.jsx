import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Typography,
  Card,
  Space,
  Row,
  Col,
} from "antd";
import {
  BookOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 24px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        🎓 Chào mừng, {user?.name || "Giảng viên"}!
      </Title>

      <Paragraph style={{ textAlign: "center", fontSize: 16 }}>
        Hãy chọn chức năng bên dưới để bắt đầu quản lý môn học và tài liệu giảng dạy.
      </Paragraph>

      <Row gutter={[24, 24]} justify="center" style={{ marginTop: 40 }}>
        <Col xs={24} sm={12} md={10}>
          <Link to="/manage-courses">
            <Card
              hoverable
              bordered
              style={{ textAlign: "center", minHeight: 180 }}
            >
              <BookOutlined style={{ fontSize: 40, color: "#1890ff" }} />
              <Title level={4} style={{ marginTop: 16 }}>Quản lý môn học</Title>
              <Paragraph>Thêm, xoá và cập nhật thông tin môn học bạn đang giảng dạy.</Paragraph>
            </Card>
          </Link>
        </Col>

        <Col xs={24} sm={12} md={10}>
          <Link to="/upload-material">
            <Card
              hoverable
              bordered
              style={{ textAlign: "center", minHeight: 180 }}
            >
              <CloudUploadOutlined style={{ fontSize: 40, color: "#52c41a" }} />
              <Title level={4} style={{ marginTop: 16 }}>Tải lên tài liệu</Title>
              <Paragraph>Chia sẻ tài liệu học tập cho sinh viên một cách dễ dàng.</Paragraph>
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
}
