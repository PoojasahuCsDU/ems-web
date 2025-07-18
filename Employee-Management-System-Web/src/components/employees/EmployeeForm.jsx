import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Spin, Upload } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/useAuth";
import placeholderAvatar from "../../assets/png/default_profile_photo.png";

const EmployeeForm = ({ employee, onBack, onSuccess }) => {
  const isEditMode = Boolean(employee?.empId);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { authAxios, login } = useAuth();

  useEffect(() => {
    if (isEditMode) {
      authAxios
        .get(`/api/users/${employee.empId}`)
        .then((res) => {
          const data = res.data.user;
          form.setFieldsValue({
            name: data.name || "",
            email: data.email || "",
            mobileNo: data.mobileNo || "",
            empId: data.empId || "",
          });
          setImagePreview(data.image || null);
        })
        .catch(() => {
          message.error("Failed to fetch employee data.");
        })
        .finally(() => setLoading(false));
    }
  }, [employee, isEditMode, form, authAxios]);

  const handleImageChange = (info) => {
    if (info.file.status === "done" || info.file.originFileObj) {
      const file = info.file.originFileObj || info.file;
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("mobileNo", values.mobileNo || "");
      formData.append("empId", values.empId || "");
      formData.append("role", "employee");

      if (values.password && values.password.trim() !== "") {
        formData.append("password", values.password);
      }

      const uploadFile = form.getFieldValue("image") || [];
      if (uploadFile.length > 0 && uploadFile[0].originFileObj) {
        formData.append("image", uploadFile[0].originFileObj);
      }

      let response;
      if (isEditMode) {
        const empId = values.empId;
        response = await authAxios.patch(
          `/api/users/update/${encodeURIComponent(empId)}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        message.success("Employee profile updated successfully!");
      } else {
        response = await authAxios.post("/api/auth/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Employee added successfully!");
      }

      // ✅ Refresh token if backend sends it
      if (response.data && response.data.token && response.data.user) {
        login(response.data.token, response.data.user);
      }

      onSuccess?.();
      onBack?.();
    } catch (error) {
      console.error("Submit error:", error);
      if (error.response?.status === 409) {
        message.error("An employee with the same email or ID already exists.");
      } else {
        message.error("Operation failed. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="form-header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          style={{ marginBottom: 16 }}
        >
          Back to Employees
        </Button>
        <h2>{isEditMode ? "Edit Employee Profile" : "Add New Employee"}</h2>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <div className="form-layout">
          <div className="form-left">
            <div className="image-upload-container">
              <div className="avatar-preview">
                <img
                  src={imagePreview || placeholderAvatar}
                  alt="Avatar"
                  className="avatar-image"
                />
              </div>
              <Form.Item
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              >
                <Upload
                  name="image"
                  listType="text"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleImageChange}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </div>
          </div>

          <div className="form-right">
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input placeholder="Enter Full name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>

            <Form.Item
              name="empId"
              label="Employee ID"
              rules={[{ required: true, message: "Please enter employee ID" }]}
            >
              <Input placeholder="Enter employee ID" disabled={isEditMode} />
            </Form.Item>

            <Form.Item
              name="mobileNo"
              label="Contact Number"
              rules={[
                {
                  pattern: /^\d{10}$/,
                  message: "Please enter a valid 10-digit mobile number",
                },
              ]}
            >
              <Input placeholder="Enter contact number" maxLength={10} />
            </Form.Item>

            <Form.Item
              name="password"
              label={isEditMode ? "New Password" : "Password"}
              rules={
                !isEditMode
                  ? [{ required: true, message: "Please enter password" }]
                  : []
              }
            >
              <Input.Password
                placeholder={isEditMode ? "Optional" : "Enter password"}
              />
            </Form.Item>

            <Form.Item className="form-actions">
              <Button onClick={onBack} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                className="admin-action-btn"
              >
                {isEditMode ? "Update" : "Add"}
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default EmployeeForm;
