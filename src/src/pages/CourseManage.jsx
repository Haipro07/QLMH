// CourseManage.jsx
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
  Modal,
  InputNumber,
  Select,
} from "antd";

const { Title } = Typography;
const { Option } = Select;
const API = "http://localhost:3002"; // JSON Server

export default function CourseManage() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    if (user) fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/courses`);
      setCourses(res.data.filter((c) => c.teacherId === user.id));
    } catch {
      message.error("Không thể tải danh sách môn học");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    const isDuplicate = courses.some(
      (c) => c.code.toLowerCase() === values.code.toLowerCase()
    );
    if (isDuplicate) return message.warning("Mã môn học đã tồn tại!");

    const newCourse = {
      ...values,
      id: Date.now(),
      teacherId: user.id,
      registered: 0,
    };

    try {
      await axios.post(`${API}/courses`, newCourse);
      setCourses([...courses, newCourse]);
      form.resetFields();
      message.success("Thêm môn học thành công");
    } catch {
      message.error("Thêm môn học thất bại");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/courses/${id}`);
      setCourses(courses.filter((c) => c.id !== id));
      message.success("Xoá môn học thành công");
    } catch {
      message.error("Xoá thất bại");
    }
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    editForm.setFieldsValue(course);
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      const updated = { ...editingCourse, ...values, teacherId: user.id };
      await axios.put(`${API}/courses/${editingCourse.id}`, updated);
      setCourses(courses.map((c) => (c.id === updated.id ? updated : c)));
      setEditingCourse(null);
      message.success("Cập nhật thành công");
    } catch {
      message.error("Cập nhật thất bại");
    }
  };

  const paginatedCourses = courses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
            <Input placeholder="VD: Cơ sở dữ liệu" />
          </Form.Item>

          <Form.Item
            name="fee"
            label="Học phí (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập học phí" }]}
          >
            <InputNumber
              min={0}
              step={50000}
              style={{ width: "100%" }}
              placeholder="VD: 1000000"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/,/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="schedule"
            label="Lịch học"
            rules={[{ required: true, message: "Vui lòng nhập lịch học" }]}
          >
            <Input placeholder="VD: Thứ 2, 13h-15h" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="open">Mở đăng ký</Option>
              <Option value="closed">Đóng đăng ký</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="max"
            label="Số lượng SV tối đa"
            rules={[{ required: true, message: "Nhập số lượng tối đa" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
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
        dataSource={paginatedCourses}
        bordered
        pagination={{
          current: currentPage,
          pageSize,
          total: courses.length,
          onChange: (page) => setCurrentPage(page),
          showSizeChanger: false,
        }}
        renderItem={(course) => (
          <List.Item
            actions={[
              <Button onClick={() => openEdit(course)}>Sửa</Button>,
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
              <span>Học phí: {Number(course.fee).toLocaleString()} VNĐ</span>
              <span>Lịch học: {course.schedule}</span>
              <span>Trạng thái: {course.status === "open" ? "Open" : "Closed"}</span>
              <span>
                Số SV: {course.registered || 0} / {course.max || "Chưa đặt"}
              </span>
            </Space>
          </List.Item>
        )}
      />

      <Modal
        open={!!editingCourse}
        title="Chỉnh sửa môn học"
        onCancel={() => setEditingCourse(null)}
        onOk={handleUpdate}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="name"
            label="Tên môn học"
            rules={[{ required: true, message: "Vui lòng nhập tên môn học" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="fee"
            label="Học phí (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập học phí" }]}
          >
            <InputNumber
              min={0}
              step={50000}
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/,/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="schedule"
            label="Lịch học"
            rules={[{ required: true, message: "Vui lòng nhập lịch học" }]}
          >
            <Input placeholder="VD: Thứ 2, 13h-15h" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Chọn trạng thái" }]}
          >
            <Select>
              <Option value="open">Mở đăng ký</Option>
              <Option value="closed">Đóng đăng ký</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="max"
            label="Số lượng SV tối đa"
            rules={[{ required: true, message: "Nhập số lượng tối đa" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
