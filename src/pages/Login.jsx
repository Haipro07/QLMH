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
  const { login, loading } = useAuth(); // Lấy loading từ context nếu có
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
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "80px auto" }}>
      <Card>
        <Title level={3} style={{ textAlign: "center" }}>
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
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
            ]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Space
          direction="vertical"
          style={{ width: "100%", textAlign: "center" }}
        >
          <Text type="secondary">Chưa có tài khoản?</Text>
          <Link href="/register">Đăng ký</Link>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
