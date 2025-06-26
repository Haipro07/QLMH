// DocumentList.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Typography,
  Input,
  message,
  Spin,
  Empty,
  Select,
  Row,
  Col,
  List,
} from "antd";
import DocumentCard from "../components/DocumentCard";

const { Title } = Typography;
const { Option } = Select;
const API = "http://localhost:3002";       // JSON Server

export default function DocumentList() {
  const { user, loading: authLoading } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMaterials();
      fetchCourses();
    }
  }, [user]);

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

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API}/courses`);
      setCourses(res.data);
    } catch {
      message.error("Không thể tải danh sách môn học");
    }
  };

  const filterData = (text, courseId) => {
    const value = text.toLowerCase();
    const filteredDocs = materials.filter((doc) => {
      const matchesTitle =
        doc.title.toLowerCase().includes(value) ||
        (doc.description?.toLowerCase() || "").includes(value);
      const matchesCourse = courseId ? doc.courseId === courseId : true;
      return matchesTitle && matchesCourse;
    });

    setFiltered(filteredDocs);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterData(value, selectedCourse);
  };

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    filterData(searchTerm, value);
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Không rõ";
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
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <Title level={2}>Tài liệu môn học</Title>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} md={10}>
          <Input
            placeholder="Tìm theo tiêu đề hoặc mô tả"
            value={searchTerm}
            onChange={handleSearchChange}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder="Chọn môn học"
            value={selectedCourse || undefined}
            onChange={handleCourseChange}
            allowClear
            style={{ width: "100%" }}
          >
            {courses.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      {loading ? (
        <Spin size="large" />
      ) : filtered.length === 0 ? (
        <Empty description="Không có tài liệu nào" />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={filtered}
          pagination={{
            pageSize: 5,
            showTotal: (total, range) =>
              `${range[0]} - ${range[1]} trong tổng ${total} tài liệu`,
          }}
          renderItem={(doc) => {
            const courseName = courses.find((c) => c.id === doc.courseId)?.name;
            return (
              <List.Item>
                <DocumentCard doc={doc} courseName={courseName} formatDate={formatDate} />
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );
}
