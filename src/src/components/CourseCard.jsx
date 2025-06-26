// src/components/CourseCard.jsx
import React from "react";
import { Card, Button, message } from "antd";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API = "http://localhost:3002";       // JSON Server


export default function CourseCard({
  course,
  registered,
  onRegisterSuccess,
  onUnregisterSuccess,
}) {
  const { user } = useAuth();

  const handleRegister = async () => {
    try {
      const newReg = {
        id: Date.now().toString(),
        courseId: course.id,
        studentId: user.id,
        status: ["registered"],
      };
      await axios.post(`${API}/registrations`, newReg);
      message.success("Đăng ký thành công");
      onRegisterSuccess(newReg);
    } catch {
      message.error("Lỗi khi đăng ký");
    }
  };

  const handleUnregister = async () => {
    try {
      const res = await axios.get(
        `${API}/registrations?studentId=${user.id}&courseId=${course.id}`
      );
      const reg = res.data[0];
      if (reg) {
        // 🔁 Cập nhật status thành "cancelled" thay vì xóa
        await axios.put(`${API}/registrations/${reg.id}`, {
          ...reg,
          status: ["cancelled"],
        });
        message.success("Huỷ đăng ký thành công");
        onUnregisterSuccess(course.id);
      }
    } catch {
      message.error("Lỗi khi huỷ đăng ký");
    }
  };

  return (
    <Card
      title={course.name}
      bordered
      hoverable
      style={{
        height: "100%",
        borderRadius: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <p>
        <strong>Mã môn học:</strong> {course.code}
      </p>
      <p>
        <strong>Giảng viên:</strong> {course.teacherName}
      </p>
      <p>
        <strong>Học phí:</strong> {Number(course.fee || 0).toLocaleString()} VNĐ
      </p>
      <p>
        <strong>Lịch học:</strong> {course.schedule || "Chưa cập nhật"}
      </p>

      {registered ? (
        <Button danger block onClick={handleUnregister}>
          Huỷ đăng ký
        </Button>
      ) : (
        <Button type="primary" block onClick={handleRegister}>
          Đăng ký
        </Button>
      )}
    </Card>
  );
}
