import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Typography,
  Form,
  Input,
  Button,
  Card,
  List,
  Popconfirm,
  message,
  Space,
  Spin,
} from "antd";

const { Title } = Typography;
const API = "";

export default function CourseManage() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/courses`);
      setCourses(res.data.filter((c) => c.teacherId === user.id)); // chỉ hiện course do GV đó tạo
    } catch (err) {
      message.error("Không thể tải danh sách môn học");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    const isDuplicate = courses.some(
      (c) => c.code.toLowerCase() === values.code.toLowerCase()
    );

    if (isDuplicate) {
      message.warning("Mã môn học đã tồn tại!");
      return;
    }

    const newCourse = {
      ...values,
      id: Date.now(), // hoặc dùng uuid nếu muốn
      teacherId: user.id, // ✅ gắn người tạo
    };

    try {
      await axios.post(`${API}/courses`, newCourse);
      setCourses([...courses, newCourse]);
      form.resetFields();
      message.success("Thêm môn học thành công");
    } catch (err) {
      message.error("Thêm môn học thất bại");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/courses/${id}`);
      setCourses(courses.filter((c) => c.id !== id));
      message.success("Xoá môn học thành công");
    } catch (err) {
      message.error("Xoá thất bại");
    }
  };

  if (authLoading || !user) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Title level={2}>Quản lý môn học</Title>

      <Card title="Thêm môn học mới" style={{ marginBottom: 24 }}>
        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="code"
            label="Mã môn học"
            rules={[{ required: true, message: "Vui lòng nhập mã môn học" }]}
          >
            <Input placeholder="VD: IT001" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên môn học"
            rules={[{ required: true, message: "Vui lòng nhập tên môn học" }]}
          >
            <Input placeholder="VD: Nhập môn lập trình" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm môn
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Title level={4}>Danh sách môn học</Title>
      <List
        loading={loading}
        dataSource={courses}
        bordered
        renderItem={(course) => (
          <List.Item
            actions={[
              <Popconfirm
                title="Xác nhận xoá môn học?"
                onConfirm={() => handleDelete(course.id)}
                okText="Xoá"
                cancelText="Huỷ"
              >
                <Button danger>Xoá</Button>
              </Popconfirm>,
            ]}
          >
            <Space direction="vertical">
              <strong>{course.code}</strong>
              <span>{course.name}</span>
            </Space>
          </List.Item>
        )}
      />
    </div>
  );
}
