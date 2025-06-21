// src/pages/CourseList.jsx
import React, { useEffect, useState } from "react";
import { Typography, Spin, Input, List, Empty } from "antd";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";

const { Title } = Typography;
const API = "";

function CourseList() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "student") {
        navigate("/login");
      } else {
        fetchCourses();
      }
    }
  }, [authLoading, user, navigate]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API}/courses`);
      setCourses(res.data);
    } catch {
      alert("Lỗi khi tải danh sách môn học");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || !user) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <Title level={2}>Danh sách môn học</Title>

      <Input.Search
        placeholder="Tìm kiếm môn học"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        allowClear
        style={{ marginBottom: 24, maxWidth: 400 }}
      />

      {loading ? (
        <Spin size="large" />
      ) : filteredCourses.length === 0 ? (
        <Empty description="Không tìm thấy môn học nào" />
      ) : (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={filteredCourses}
          renderItem={(course) => (
            <List.Item key={course.id}>
              <CourseCard course={course} />
            </List.Item>
          )}
        />
      )}
    </div>
  );
}

export default CourseList;
