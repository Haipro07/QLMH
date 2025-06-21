// src/components/DocumentCard.jsx
import React from "react";
import { Card, Typography, Space, Button } from "antd";
import { FileTextOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function DocumentCard({ doc }) {
  return (
    <Card
      hoverable
      style={{ marginBottom: 16 }}
      bodyStyle={{ padding: 16 }}
    >
      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        <Title level={5} style={{ margin: 0 }}>
          <FileTextOutlined style={{ marginRight: 8 }} />
          {doc.title}
        </Title>

        <Paragraph type="secondary" style={{ margin: 0 }}>
          {doc.description || "Không có mô tả."}
        </Paragraph>

        {doc.link && (
          <Button
            type="link"
            href={doc.link}
            target="_blank"
            style={{ paddingLeft: 0 }}
          >
            📎 Xem tài liệu
          </Button>
        )}
      </Space>
    </Card>
  );
}

export default DocumentCard;
