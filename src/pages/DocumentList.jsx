import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Typography,
  List,
  Card,
  Input,
  message,
  Spin,
  Empty,
} from "antd";

const { Title } = Typography;
const API = "";

export default function DocumentList() {
  const { user, loading: authLoading } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMaterials();
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

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredDocs = materials.filter(
      (doc) =>
        doc.title.toLowerCase().includes(value) ||
        (doc.description?.toLowerCase() || "").includes(value)
    );
    setFiltered(filteredDocs);
  };

  if (authLoading || !user) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <Title level={2}>Tài liệu môn học</Title>

      <Input.Search
        placeholder="Tìm theo tiêu đề hoặc mô tả"
        onChange={handleSearch}
        allowClear
        style={{ marginBottom: 20, maxWidth: 400 }}
      />

      {loading ? (
        <Spin size="large" />
      ) : filtered.length === 0 ? (
        <Empty description="Không có tài liệu nào" />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={filtered}
          renderItem={(doc) => (
            <List.Item>
              <Card title={doc.title}>
                <p>{doc.description || "Không có mô tả."}</p>
                {doc.link && (
                  <a
                    href={doc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1890ff" }}
                  >
                    Xem tài liệu
                  </a>
                )}
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
