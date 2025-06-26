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
  Upload,
  Modal,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;
const API = "http://localhost:3002";       // JSON Server
const UPLOAD_API = "http://localhost:3001"; // Node Upload Server

export default function UploadMaterial() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [fileList, setFileList] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm] = Form.useForm();
  const [materialType, setMaterialType] = useState("");

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
    let uploadedUrl = "";
    let uploadedFileName = "";

    if (materialType !== "link" && fileList.length > 0) {
      const formData = new FormData();
      formData.append("file", fileList[0]);

      try {
        const res = await axios.post(`${UPLOAD_API}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedUrl = res.data.url;
        uploadedFileName = fileList[0].name;
      } catch {
        return message.error("Tải file lên máy chủ thất bại");
      }
    }

    const nextId =
      (materials.length > 0
        ? Math.max(...materials.map((m) => parseInt(m.id)))
        : 0) + 1;

    const newMaterial = {
      id: nextId.toString(),
      ...values,
      date: new Date().toISOString(),
      fileName: uploadedFileName,
      link: materialType === "link" ? values.link : uploadedUrl,
    };

    try {
      await axios.post(`${API}/materials`, newMaterial);
      const updated = [...materials, newMaterial];
      setMaterials(updated);
      setFiltered(updated);
      form.resetFields();
      setFileList([]);
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
    const filteredList = materials.filter((item) => {
      const courseName = courses.find((c) => c.id === item.courseId)?.name || "";
      return (
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        courseName.toLowerCase().includes(value.toLowerCase())
      );
    });
    setFiltered(filteredList);
  };

  const handleEdit = (material) => {
    setEditing(material);
    editForm.setFieldsValue(material);
    setEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      const updated = { ...editing, ...values };
      await axios.put(`${API}/materials/${editing.id}`, updated);
      setMaterials(materials.map((m) => (m.id === editing.id ? updated : m)));
      setFiltered(filtered.map((m) => (m.id === editing.id ? updated : m)));
      setEditModal(false);
      setEditing(null);
      message.success("Cập nhật thành công");
    } catch {
      message.error("Cập nhật thất bại");
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
      <Title level={2}>Quản lý Tài liệu</Title>

      <Card style={{ marginBottom: 24 }}>
        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
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
            name="type"
            label="Loại tài liệu"
            rules={[{ required: true, message: "Chọn loại tài liệu" }]}
          >
            <Select placeholder="Chọn loại tài liệu" onChange={setMaterialType}>
              <Option value="link">Link</Option>
              <Option value="pdf">PDF</Option>
              <Option value="video">Video</Option>
            </Select>
          </Form.Item>

          {materialType === "link" ? (
            <Form.Item
              name="link"
              label="Link"
              rules={[{ required: true, message: "Link không được trống" }]}
            >
              <Input placeholder="https://..." />
            </Form.Item>
          ) : (
            <Form.Item label="Tệp tài liệu" required>
              <Upload
                beforeUpload={(file) => {
                  setFileList([file]);
                  return false;
                }}
                fileList={fileList}
                onRemove={() => setFileList([])}
              >
                <Button icon={<UploadOutlined />}>Chọn file</Button>
              </Upload>
            </Form.Item>
          )}

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
        placeholder="Tìm kiếm theo tài liệu hoặc môn học"
        allowClear
        style={{ marginBottom: 24 }}
      />

      <List
        loading={loading}
        dataSource={filtered}
        bordered
        itemLayout="vertical"
        pagination={{ pageSize: 5, showSizeChanger: false }}
        renderItem={(doc) => {
          const course = courses.find((c) => c.id === doc.courseId);
          return (
            <List.Item
              actions={[
                doc.link && (
                  <a href={doc.link} target="_blank" rel="noopener noreferrer">
                    Xem tài liệu
                  </a>
                ),
                <Button onClick={() => handleEdit(doc)}>Sửa</Button>,
                <Button danger onClick={() => handleDelete(doc.id)}>Xoá</Button>,
              ]}
            >
              <List.Item.Meta
                title={doc.title}
                description={
                  <>
                    <div>{doc.description}</div>
                    <div><strong>Loại:</strong> {doc.type.toUpperCase()}</div>
                    <div><strong>Môn học:</strong> {course?.name || doc.courseId}</div>
                    <div><strong>Ngày đăng:</strong> {new Date(doc.date).toLocaleDateString("vi-VN")}</div>
                    {doc.fileName && <div><strong>Tệp:</strong> {doc.fileName}</div>}
                  </>
                }
              />
            </List.Item>
          );
        }}
      />

      <Modal
        title="Chỉnh sửa tài liệu"
        open={editModal}
        onCancel={() => setEditModal(false)}
        onOk={handleUpdate}
        okText="Cập nhật"
        cancelText="Huỷ"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="link" label="Link"><Input /></Form.Item>
          <Form.Item name="type" label="Loại tài liệu" rules={[{ required: true }]}><Select><Option value="link">Link</Option><Option value="pdf">PDF</Option><Option value="video">Video</Option></Select></Form.Item>
          <Form.Item name="courseId" label="Môn học" rules={[{ required: true }]}><Select>{courses.map((c) => <Option key={c.id} value={c.id}>{c.name}</Option>)}</Select></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
