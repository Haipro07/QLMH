import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "../api/auth";
import {
  Typography,
  Form,
  Input,
  Button,
  Card,
  message,
  Space,
  Select,
} from "antd";

const { Title, Text, Link } = Typography;
const { Option } = Select;

export default function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await registerAPI(values);
      message.success("Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      message.error(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: "80px auto" }}>
      <Card>
        <Title level={3} style={{ textAlign: "center" }}>
          Đăng ký tài khoản
        </Title>

        <Form layout="vertical" form={form} onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="abc@example.com" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: "Chọn vai trò" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="student">Sinh viên</Option>
              <Option value="teacher">Giảng viên</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              disabled={loading}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <Space direction="vertical" style={{ width: "100%", textAlign: "center" }}>
          <Text type="secondary">Đã có tài khoản?</Text>
          <Link href="/login">Đăng nhập</Link>
        </Space>
      </Card>
    </div>
  );
}
