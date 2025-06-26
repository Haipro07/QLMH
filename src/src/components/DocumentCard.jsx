// src/components/DocumentCard.jsx
import React from "react";
import { Card } from "antd";

export default function DocumentCard({ doc, courseName, formatDate }) {
  return (
    <Card title={doc.title}>
      <p>{doc.description || "Không có mô tả."}</p>
      <p>
        <strong>Loại:</strong> {doc.type?.toUpperCase() || "Không rõ"}
      </p>
      <p>
        <strong>Môn học:</strong> {courseName || "Không xác định"}
      </p>
      <p>
        <strong>Ngày đăng:</strong> {doc.date ? formatDate(doc.date) : "Không rõ"}
      </p>
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
  );
}
