import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Typography,
  Table,
  Card,
  Button,
  message,
  Modal,
  Collapse,
  List,
} from "antd";

const { Title } = Typography;
const { Panel } = Collapse;
const API = "http://localhost:3002";       // JSON Server
const UPLOAD_API = "http://localhost:3001"; // Node Upload Server

export default function Tuition() {
  const { user } = useAuth();
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [allTuition, setAllTuition] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [regRes, courseRes, tuitionRes] = await Promise.all([
        axios.get(`${API}/registrations?studentId=${user.id}`),
        axios.get(`${API}/courses`),
        axios.get(`${API}/tuition?studentId=${user.id}`),
      ]);

      const registeredIds = regRes.data.map((r) => r.courseId);
      const paidCourseIds = tuitionRes.data.flatMap((t) => t.courseIds || []);

      const unpaidCourses = courseRes.data.filter(
        (c) => registeredIds.includes(c.id) && !paidCourseIds.includes(c.id)
      );

      setRegisteredCourses(unpaidCourses);
      setAllCourses(courseRes.data);
      setAllTuition(tuitionRes.data);
    } catch {
      message.error("Không thể tải dữ liệu học phí");
    } finally {
      setLoading(false);
    }
  };

  const totalFee = registeredCourses.reduce((sum, c) => sum + Number(c.fee), 0);

  const handlePay = async () => {
    try {
      const newTuition = {
        id: Date.now().toString(),
        studentId: user.id,
        total: totalFee,
        dueDate: "2025-07-31",
        status: "paid",
        courseIds: registeredCourses.map((c) => c.id),
      };

      await axios.post(`${API}/tuition`, newTuition);

      Modal.success({
        title: "Thanh toán thành công",
        content: `Bạn đã thanh toán ${totalFee.toLocaleString()} VNĐ.`,
      });

      setRegisteredCourses([]);
      setAllTuition([...allTuition, newTuition]);
    } catch {
      message.error("Thanh toán thất bại");
    }
  };

  const columns = [
    {
      title: "Mã môn",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên môn học",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Lịch học",
      dataIndex: "schedule",
      key: "schedule",
    },
    {
      title: "Học phí (VNĐ)",
      dataIndex: "fee",
      key: "fee",
      render: (fee) => Number(fee).toLocaleString(),
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <Title level={2}>💸 Học phí học kỳ</Title>

      <Card loading={loading} style={{ marginBottom: 24 }}>
        <Table
          dataSource={registeredCourses}
          columns={columns}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: "Không có môn học cần thanh toán." }}
        />

        <div style={{ marginTop: 24, textAlign: "right" }}>
          <Title level={4}>Tổng học phí: {totalFee.toLocaleString()} VNĐ</Title>
          <p>Hạn chót đóng tiền: 31/07/2025</p>

          <Button
            type="primary"
            disabled={registeredCourses.length === 0}
            onClick={handlePay}
          >
            Chuyển khoản
          </Button>
        </div>
      </Card>

      {/* Lịch sử thanh toán */}
      <Card title="🧾 Lịch sử thanh toán" loading={loading}>
        {allTuition.length === 0 ? (
          <p>Chưa có lịch sử thanh toán.</p>
        ) : (
          <Collapse accordion>
            {allTuition.map((t) => (
              <Panel
                header={`Thanh toán ngày: ${new Date(Number(t.id)).toLocaleString()} | Tổng: ${Number(t.total).toLocaleString()} VNĐ`}
                key={t.id}
              >
                <List
                  dataSource={t.courseIds.map((cid) =>
                    allCourses.find((c) => c.id === cid)
                  )}
                  renderItem={(course) =>
                    course ? (
                      <List.Item>
                        {course.name} ({course.code}) -{" "}
                        {Number(course.fee).toLocaleString()} VNĐ
                      </List.Item>
                    ) : (
                      <List.Item>Môn học không còn tồn tại</List.Item>
                    )
                  }
                />
              </Panel>
            ))}
          </Collapse>
        )}
      </Card>
    </div>
  );
}
