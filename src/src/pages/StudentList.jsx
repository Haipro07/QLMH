import React, { useEffect, useState } from "react";
import { List, Typography, Card, Spin, message } from "antd";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const { Title } = Typography;
const API = "http://localhost:3002";       // JSON Server
const UPLOAD_API = "http://localhost:3001"; // Node Upload Server

export default function StudentList() {
  const { user, loading: authLoading } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.role === "teacher") {
      fetchData();
    }
  }, [authLoading, user]);

  // ✅ Đăng ký listener để lắng nghe sự kiện cập nhật
  useEffect(() => {
    const handleUpdate = () => {
      if (!authLoading && user?.role === "teacher") {
        fetchData();
      }
    };

    window.addEventListener("registrationUpdated", handleUpdate);
    return () => window.removeEventListener("registrationUpdated", handleUpdate);
  }, [authLoading, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [enrollRes, userRes, courseRes] = await Promise.all([
        axios.get(`${API}/enrollments`),
        axios.get(`${API}/users`),
        axios.get(`${API}/courses`)
      ]);

      const teacherCourses = courseRes.data.filter(c => c.teacherId === user.id);
      const teacherCourseIds = teacherCourses.map(c => c.id);

      const filtered = enrollRes.data.filter(e => {
        const status = e.status;
        const isRegistered = (typeof status === "string" && status === "registered") ||
                             (Array.isArray(status) && status.includes("registered"));
        return teacherCourseIds.includes(e.courseId) && isRegistered;
      });

      setEnrollments(filtered);
      setStudents(userRes.data.filter(u => u.role === "student"));
      setCourses(teacherCourses);
    } catch (err) {
      message.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const renderStudentInfo = (enr) => {
    const student = students.find(s => s.id === enr.studentId);
    const course = courses.find(c => c.id === enr.courseId);

    if (!student || !course) {
      return <Card>Lỗi dữ liệu: sinh viên hoặc môn học không tồn tại.</Card>;
    }

    return (
      <Card>
        <Typography.Paragraph>
          <strong>Họ và tên:</strong> {student.name}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>Email:</strong> {student.email}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>Số điện thoại:</strong> {student.phone || "Chưa cập nhật"}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>Đăng ký môn:</strong> {course.name}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>Học phí:</strong> {Number(course.fee).toLocaleString()} VNĐ
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>Trạng thái:</strong>{" "}
          {Array.isArray(enr.status) ? enr.status.join(", ") : enr.status}
        </Typography.Paragraph>
      </Card>
    );
  };

  if (authLoading || loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <Title level={2}>Danh sách sinh viên đã đăng ký</Title>

      <List
        itemLayout="vertical"
        dataSource={enrollments}
        renderItem={(enr) => (
          <List.Item>{renderStudentInfo(enr)}</List.Item>
        )}
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "Không có sinh viên đăng ký nào." }}
      />
    </div>
  );
}
