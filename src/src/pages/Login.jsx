// src/pages/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Typography,
  Form,
  Input,
  Button,
  Card,
  message,
  Space,
  Spin,
} from "antd";

const { Title, Text, Link } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const user = await login(values.email, values.password);

      if (!user) {
        message.error("Email hoặc mật khẩu không đúng");
        return;
      }

      if (user.role === "teacher") {
        navigate("/teacher");
      } else if (user.role === "student") {
        navigate("/student");
      } else {
        message.warning("Không rõ vai trò người dùng.");
      }
    } catch (err) {
      message.error(err.message || "Đăng nhập thất bại");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f2f5, #e6f7ff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          borderRadius: 12,
          background: "#fff",
        }}
        bodyStyle={{ padding: 32 }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Đăng nhập
        </Title>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input size="large" placeholder="abc@example.com" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{ borderRadius: 6 }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Space
          direction="vertical"
          style={{ width: "100%", textAlign: "center", marginTop: 16 }}
        >
          <Text type="secondary">Chưa có tài khoản?</Text>
          <Link href="/register">Đăng ký ngay</Link>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
