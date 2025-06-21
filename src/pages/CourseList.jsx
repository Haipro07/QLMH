import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Typography, Input, Row, Col, Card, message, Spin } from "antd";

const { Title } = Typography;
const { Search } = Input;
const API = "";

function CourseList() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axios
        .get(`${API}/courses`)
        .then((res) => {
          setCourses(res.data);
          setFiltered(res.data);
        })
        .catch(() => message.error("Không thể tải danh sách môn học"))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const onSearch = (value) => {
    const result = courses.filter((c) =>
      c.name.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(result);
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
        placeholder="Tìm kiếm môn học"
        onSearch={onSearch}
        allowClear
        enterButton
        style={{ marginBottom: 24, maxWidth: 400 }}
      />

      <Row gutter={[16, 16]}>
        {filtered.map((course) => (
          <Col xs={24} sm={12} md={8} key={course.id}>
            <Card
              title={course.name}
              bordered
              hoverable
              style={{ height: "100%" }}
            >
              <p>{course.description || "Chưa có mô tả."}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default CourseList;
