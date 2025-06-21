import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Button,
  Input,
  Form,
  message,
  Typography,
  List,
  Spin,
  Select,
} from "antd";

const { Title } = Typography;
const { Option } = Select;
const API = "";

export default function UploadMaterial() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "teacher") {
        navigate("/login");
      } else {
        fetchCourses();
        fetchMaterials();
      }
    }
  }, [user, authLoading, navigate]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API}/courses`);
      const teacherCourses = res.data.filter((c) => c.teacherId === user.id);
      setCourses(teacherCourses);
    } catch {
      message.error("Không thể tải danh sách môn học");
    }
  };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/materials`);
      setMaterials(res.data);
      setFiltered(res.data);
    } catch {
      message.error("Lỗi khi tải danh sách tài liệu");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    const nextId = (
      materials.length > 0
        ? Math.max(...materials.map((m) => parseInt(m.id)))
        : 0
    ) + 1;

    const newMaterial = {
      id: nextId.toString(),
      ...values,
    };

    try {
      const res = await axios.post(`${API}/materials`, newMaterial);
      const updated = [...materials, res.data];
      setMaterials(updated);
      setFiltered(updated);
      form.resetFields();
      message.success("Tải lên thành công");
    } catch {
      message.error("Tải lên thất bại");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/materials/${id}`);
      const updated = materials.filter((m) => m.id !== id);
      setMaterials(updated);
      setFiltered(updated);
      message.success("Đã xoá tài liệu");
    } catch {
      message.error("Xoá thất bại!");
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filteredList = materials.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(filteredList);
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
      <Title level={2}>Quản lý Tài liệu</Title>

      <Card style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Nhập tiêu đề" }]}
          >
            <Input placeholder="VD: Giáo trình Cơ sở dữ liệu" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Nhập mô tả" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="link"
            label="Link"
            rules={[
              { required: true, message: "Link không được trống" },
              {
                pattern: /^https?:\/\/.+/,
                message: "Phải bắt đầu bằng http:// hoặc https://",
              },
            ]}
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại tài liệu"
            rules={[{ required: true, message: "Chọn loại tài liệu" }]}
          >
            <Select placeholder="Chọn loại tài liệu">
              <Option value="pdf">PDF</Option>
              <Option value="video">Video</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="courseId"
            label="Thuộc môn học"
            rules={[{ required: true, message: "Chọn môn học" }]}
          >
            <Select placeholder="Chọn môn học">
              {courses.map((course) => (
                <Option key={course.id} value={course.id}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tải lên
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Input.Search
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Tìm kiếm tài liệu theo tiêu đề"
        allowClear
        style={{ marginBottom: 24 }}
      />

      <List
        loading={loading}
        dataSource={filtered}
        bordered
        itemLayout="vertical"
        renderItem={(doc) => (
          <List.Item
            actions={[
              <a href={doc.link} target="_blank" rel="noopener noreferrer">
                Xem tài liệu
              </a>,
              <Button danger onClick={() => handleDelete(doc.id)}>
                Xoá
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={doc.title}
              description={
                <>
                  <div>{doc.description}</div>
                  <div>
                    <strong>Loại:</strong> {doc.type.toUpperCase()} |{" "}
                    <strong>Môn học ID:</strong> {doc.courseId}
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}
