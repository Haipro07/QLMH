import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Card,
  Typography,
  Avatar,
  List,
  Spin,
  Form,
  Input,
  Button,
  message,
  Space,
  Row,
  Col,
} from "antd";

const { Title, Paragraph } = Typography;
const API = "http://localhost:3002"; // JSON Server

export default function ProfileStudent() {
  const { user, setUser, loading: authLoading } = useAuth();
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!authLoading && user?.role === "student") {
      fetchCourses();
      fetchTeachers();
      form.setFieldsValue(user);
    }
  }, [user, authLoading]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API}/registrations?studentId=${user.id}`);
      const courseIds = res.data.map((r) => r.courseId);

      const coursesRes = await axios.get(`${API}/courses`);
      const filteredCourses = coursesRes.data.filter((c) =>
        courseIds.includes(c.id)
      );

      setRegisteredCourses(filteredCourses);
    } catch {
      setRegisteredCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API}/users`);
      const teacherList = res.data.filter((u) => u.role === "teacher");
      setTeachers(teacherList);
    } catch {
      message.error("Không thể tải giảng viên");
    }
  };

  const handleSave = async (values) => {
    try {
      const updatedUser = { ...user, ...values };
      await axios.put(`${API}/users/${user.id}`, updatedUser);
      setUser(updatedUser);
      form.setFieldsValue(updatedUser);
      message.success("Cập nhật thông tin thành công!");
      setEditMode(false);
    } catch {
      message.error("Cập nhật thất bại!");
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher ? teacher.name : "Không rõ";
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          padding: 24,
          marginBottom: 32,
        }}
      >
        <Row gutter={32} align="middle">
          <Col xs={24} sm={8} style={{ textAlign: "center" }}>
            <Avatar
              size={120}
              src={user.avatar || "/avatars/meo.png"}
              style={{ marginBottom: 16 }}
            />
          </Col>

          <Col xs={24} sm={16}>
            {editMode ? (
              <Form
                layout="vertical"
                form={form}
                initialValues={user}
                onFinish={handleSave}
              >
                <Form.Item
                  label="Họ tên"
                  name="name"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Lưu
                  </Button>
                  <Button onClick={() => setEditMode(false)}>Hủy</Button>
                </Space>
              </Form>
            ) : (
              <>
                <Title level={3} style={{ marginBottom: 0 }}>
                  {user.name}
                </Title>
                <Paragraph>Email: {user.email}</Paragraph>
                <Paragraph>SĐT: {user.phone}</Paragraph>
                <Button type="default" onClick={() => setEditMode(true)}>
                  Chỉnh sửa
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Card>

      <Card
        title="📚 Môn học đã đăng ký"
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <List
          dataSource={registeredCourses}
          locale={{ emptyText: "Chưa đăng ký môn học nào." }}
          renderItem={(course) => (
            <List.Item>
              <List.Item.Meta
                title={course.name}
                description={
                  <>
                    <div><strong>Mã:</strong> {course.code}</div>
                    <div><strong>Lịch học:</strong> {course.schedule}</div>
                    <div><strong>Giảng viên:</strong> {getTeacherName(course.teacherId)}</div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
