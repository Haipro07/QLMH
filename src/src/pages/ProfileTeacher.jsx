import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Button,
  Form,
  Input,
  List,
  Spin,
  message,
  Space,
  Modal,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const { Title, Text } = Typography;
const API = "http://localhost:3002"; // JSON Server

export default function ProfileTeacher() {
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      fetchCourses();
      form.setFieldsValue(user);
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API}/courses`);
      const teaching = res.data.filter((c) => c.teacherId === user.id);
      setCourses(teaching);
    } catch {
      message.error("Không thể tải danh sách môn học");
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updated = {
        ...user,
        ...values,
        avatar: user.avatar, // Dùng avatar có sẵn
      };

      await axios.put(`${API}/users/${user.id}`, updated);
      message.success("Cập nhật thông tin thành công");
      setEditing(false);
    } catch {
      message.error("Lỗi khi cập nhật");
    }
  };

  if (loading || !user) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Card>
        <div style={{ display: "flex", gap: 16 }}>
          <Avatar size={100} 
            src={user.avatar || "/avatars/anime-poster.png"} 
            style={{ backgroundColor: "#87d068" }}
          />
          <div style={{ flex: 1 }}>
            <Title level={3}>{user.name}</Title>
            <Text>Email: {user.email}</Text>
            <br />
            <Text>SĐT: {user.phone || "Chưa cập nhật"}</Text>
          </div>
          <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
            Chỉnh sửa
          </Button>
        </div>
      </Card>

      <Title level={4} style={{ marginTop: 32 }}>
        Môn học đang dạy
      </Title>
      <List
        bordered
        dataSource={courses}
        renderItem={(course) => (
          <List.Item>
            <Space direction="vertical">
              <strong>
                {course.code} - {course.name}
              </strong>
              <Text>Học phí: {Number(course.fee).toLocaleString()} VNĐ</Text>
              <Text>Lịch học: {course.schedule}</Text>
              <Text>Trạng thái: {course.status || "Đang mở"}</Text>
            </Space>
          </List.Item>
        )}
      />

      <Modal
        title="Chỉnh sửa thông tin"
        open={editing}
        onCancel={() => setEditing(false)}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
