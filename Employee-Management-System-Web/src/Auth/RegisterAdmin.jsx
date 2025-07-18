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
import AddAdminImage from "../assets/png/AddAdminImage.png";
import { useAuth } from "../contexts/useAuth";
import { FiArrowLeft } from "react-icons/fi";

const RegisterAdmin = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, authAxios } = useAuth();

  useEffect(() => {
    // Verify admin session on mount
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleRegistration = async (values) => {
    setLoading(true);
    setError("");

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("empId", values.email); // Using email as empId
      formData.append("password", values.password);
      formData.append("email", values.email);
      formData.append("mobileNo", values.phone);
      formData.append("role", "admin");

      // If there's an image file, append it
      // if (values.image && values.image.file) {
      //   formData.append("image", values.image.file);
      // }

      const response = await authAxios.post(`/api/auth/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        message.success("New admin created successfully!");
        form.resetFields();
        setTimeout(() => {
          navigate("/dashboard/admin");
        }, 2000);
      } else {
        throw new Error(response.data.message || "Failed to create admin");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create admin. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard/admin");
  };

  return (
    <div className="login-container">
      <Card className="form-container">
        <Flex gap="large" align="center">
          <Flex flex={1}>
            <img
              src={AddAdminImage}
              className="add-admin-image"
              alt="Add Admin Background"
            />
          </Flex>
          <Flex vertical flex={1}>
            <Button
              type="link"
              icon={<FiArrowLeft />}
              onClick={handleBackToDashboard}
              style={{ alignSelf: "flex-start", marginBottom: 16 }}
            >
              Back to Dashboard
            </Button>

            <Flex vertical align="center" gap="medium">
              <Typography.Title level={3} className="title">
                Register New Admin
              </Typography.Title>
            </Flex>

            {error && (
              <Alert
                message="Registration Error"
                description={error}
                type="error"
                showIcon
                closable
                style={{ marginBottom: 24 }}
              />
            )}

            <Form
              form={form}
              layout="vertical"
              onFinish={handleRegistration}
              autoComplete="off"
            >
              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  { required: true, message: "Please input full name!" },
                  { min: 3, message: "Minimum 3 characters" },
                  { max: 50, message: "Maximum 50 characters" },
                ]}
              >
                <Input size="large" placeholder="Full Name" />
              </Form.Item>
              <Form.Item
                label="Email (Will be used as Admin ID)"
                name="email"
                rules={[
                  { required: true, message: "Please input email!" },
                  { type: "email", message: "Invalid email format" },
                  { max: 100, message: "Maximum 100 characters" },
                ]}
              >
                <Input size="large" placeholder="Email" />
              </Form.Item>
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: "Please input phone number!" },
                  { pattern: /^\d{10}$/, message: "10 digits required" },
                ]}
              >
                <Input size="large" placeholder="Phone Number" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input password!" },
                  { min: 8, message: "Minimum 8 characters" },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                    message: "Requires uppercase, lowercase, and number",
                  },
                ]}
              >
                <Input.Password size="large" placeholder="Password" />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password size="large" placeholder="Confirm Password" />
              </Form.Item>
              {/* Add image upload later if needed */}
              {/* <Form.Item
                label="Profile Image"
                name="image"
              >
                <Upload 
                  maxCount={1}
                  listType="picture-card"
                  beforeUpload={() => false}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item> */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="login-btn" // Using the same class as login button for styling
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? "Registering Admin..." : "Register Admin"}
                </Button>
              </Form.Item>
            </Form>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
};

export default RegisterAdmin;
