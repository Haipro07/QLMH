// src/pages/CourseList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Typography,
  Input,
  Row,
  Col,
  message,
  Spin,
  Pagination,
  Empty,
} from "antd";
import CourseCard from "../components/CourseCard";

const { Title } = Typography;
const { Search } = Input;
const API = "http://localhost:3002";       // JSON Server

function CourseList() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    if (user) {
      Promise.all([
        axios.get(`${API}/courses`),
        axios.get(`${API}/users`),
        axios.get(`${API}/registrations?studentId=${user.id}`),
      ])
        .then(([courseRes, userRes, regRes]) => {
          const teachers = userRes.data
            .filter((u) => u.role === "teacher")
            .reduce((acc, t) => {
              acc[t.id] = t.name;
              return acc;
            }, {});

          const enrichedCourses = courseRes.data.map((c) => ({
            ...c,
            teacherName: teachers[c.teacherId] || "Chưa rõ",
          }));

          setCourses(enrichedCourses);
          setFiltered(enrichedCourses);
          setRegistrations(regRes.data);
        })
        .catch(() => message.error("Không thể tải danh sách môn học"))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const onSearch = (value) => {
    const keyword = value.trim().toLowerCase();
    const result = courses.filter(
      (c) =>
        c.name.toLowerCase().includes(keyword) ||
        c.code.toLowerCase().includes(keyword)
    );
    setFiltered(result);
    setCurrentPage(1);
  };

  const isRegistered = (courseId) =>
    registrations.some(
      (r) =>
        r.courseId === courseId &&
        Array.isArray(r.status) &&
        r.status.includes("registered")
    );

  const paginatedCourses = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleRegisterSuccess = (newReg) => {
    setRegistrations((prev) => [...prev, newReg]);
  };

  const handleUnregisterSuccess = (courseId) => {
    // Cập nhật trạng thái thành cancelled nếu có
    setRegistrations((prev) =>
      prev.map((r) =>
        r.courseId === courseId
          ? { ...r, status: ["cancelled"] }
          : r
      )
    );
  };

  if (!user || loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px" }}>
      <Title level={2}>Danh sách môn học</Title>

      <Search
        placeholder="Tìm kiếm theo tên hoặc mã môn học"
        onSearch={onSearch}
        allowClear
        enterButton
        style={{ marginBottom: 24, maxWidth: 400 }}
      />

      <Row gutter={[16, 16]}>
        {paginatedCourses.length === 0 ? (
          <Col span={24} style={{ textAlign: "center", marginTop: 40 }}>
            <Empty description="Không tìm thấy môn học phù hợp." />
          </Col>
        ) : (
          paginatedCourses.map((course) => (
            <Col xs={24} sm={12} md={8} key={course.id}>
              <CourseCard
                course={course}
                registered={isRegistered(course.id)}
                onRegisterSuccess={handleRegisterSuccess}
                onUnregisterSuccess={handleUnregisterSuccess}
              />
            </Col>
          ))
        )}
      </Row>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filtered.length}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export default CourseList;
