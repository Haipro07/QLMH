// src/pages/Register.jsx
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
  const [role, setRole] = useState("");

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      return message.error("Mật khẩu và xác nhận không khớp");
    }

    if (values.role === "teacher" && values.teacherCode !== "GV2025") {
      return message.error("Mã xác thực giảng viên không đúng");
    }

    try {
      setLoading(true);
      const { confirmPassword, teacherCode, ...userData } = values;
      await registerAPI(userData);
      message.success("Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      message.error(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

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
          maxWidth: 500,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          borderRadius: 12,
          background: "#fff",
        }}
        bodyStyle={{ padding: 32 }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Đăng ký tài khoản
        </Title>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input size="large" placeholder="Nguyễn Văn A" />
          </Form.Item>

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
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" },
            ]}
          >
            <Input size="large" placeholder="0123456789" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
            ]}
            hasFeedback
          >
            <Input.Password size="large" placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp"));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password size="large" placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: "Chọn vai trò" }]}
          >
            <Select
              placeholder="Chọn vai trò"
              onChange={(value) => setRole(value)}
              size="large"
            >
              <Option value="student">Sinh viên</Option>
              <Option value="teacher">Giảng viên</Option>
            </Select>
          </Form.Item>

          {role === "teacher" && (
            <Form.Item
              label="Mã xác thực giảng viên"
              name="teacherCode"
              rules={[{ required: true, message: "Vui lòng nhập mã xác thực" }]}
            >
              <Input size="large" placeholder="Nhập mã xác thực (VD: GV2024)" />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              disabled={loading}
              style={{ borderRadius: 6 }}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <Space
          direction="vertical"
          style={{ width: "100%", textAlign: "center", marginTop: 16 }}
        >
          <Text type="secondary">Đã có tài khoản?</Text>
          <Link href="/login">Đăng nhập ngay</Link>
        </Space>
      </Card>
    </div>
  );
}
