import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Flex,
  message,
  Alert,
} from "antd";
import { useNavigate } from "react-router-dom";
import LoginImage from "../assets/png/Login_pageBG.png";
import Logo from "../assets/png/LogoImage.png";
import axios from "axios";
import { useAuth } from "../contexts/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const secureAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [securityAlert, setSecurityAlert] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (values) => {
    setLoading(true);
    setErrorMessage("");
    setSecurityAlert(false);

    try {
      const response = await secureAxios.post("/api/auth/login-admin", {
        empId: values.empId.trim(),
        password: values.password,
      });

      if (response.data?.success) {
        login(response.data.token, response.data.user);
        message.success("Login successful!");
        navigate("/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 10) {
        setSecurityAlert(true);
      }

      if (error.response) {
        const errorMsg =
          error.response.data?.message ||
          `Login failed (${error.response.status})`;
        setErrorMessage(errorMsg);
      } else if (error.request) {
        setErrorMessage(
          "No response from server. Please check your connection."
        );
      } else {
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="form-container">
        <Flex gap="large" align="center" wrap="wrap">
          <Flex flex={1} className="image-container">
            <img
              src={LoginImage}
              className="login-image"
              alt="Login Background"
            />
          </Flex>
          <Flex vertical flex={1} className="form-content">
            <Flex vertical align="center" gap="medium">
              <img src={Logo} className="Logo-icon" alt="Logo Icon" />
              <Typography.Title level={3} className="title">
                Welcome Back
              </Typography.Title>
            </Flex>
            <Typography.Text type="secondary" className="title-text">
              Please Login to Your Account
            </Typography.Text>

            {securityAlert && (
              <Alert
                message="Security Notice"
                description="Multiple failed login attempts detected"
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            {errorMessage && (
              <div
                className="error-message"
                style={{ color: "#ff4d4f", marginBottom: 16 }}
              >
                {errorMessage}
              </div>
            )}

            <Form
              form={form}
              layout="vertical"
              onFinish={handleLogin}
              autoComplete="off"
            >
              <Form.Item
                label="Email ID"
                name="empId"
                rules={[
                  { required: true, message: "Please input your Email ID!" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                  { max: 50, message: "Email must be less than 50 characters" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter your email"
                  autoComplete="username"
                  maxLength={50}
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters long!",
                  },
                  {
                    max: 100,
                    message: "Password must be less than 100 characters",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Password"
                  autoComplete="current-password"
                  maxLength={100}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="login-btn"
                  loading={loading}
                  disabled={loading || attempts >= 5}
                >
                  {loading ? "Authenticating..." : "Login"}
                </Button>
              </Form.Item>
            </Form>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
};

export default Login;
