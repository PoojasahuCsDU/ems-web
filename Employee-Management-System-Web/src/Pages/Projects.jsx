import React, { useState, useEffect } from "react";
import { Card, Modal, Form, Input, Button, message, Spin, Alert } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { authAxios, login } = useAuth(); // ✅ added login

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.get("/api/projects/all-projects");
      if (response.data?.projects?.length > 0) {
        setProjects(response.data.projects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        circle: values.circle.trim(),
        division: values.division.trim(),
        description: values.description?.trim() || "",
      };

      const response = await authAxios.post(
        "/api/projects/create-project",
        payload
      );

      // ✅ Refresh token if backend sends it
      if (response.data && response.data.token && response.data.user) {
        login(response.data.token, response.data.user);
      }

      message.success("Project added successfully!");
      form.resetFields();
      setIsModalVisible(false);
      fetchProjects();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Failed to create project. Please try again.";
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-section">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>Projects</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
          className="admin-action-btn"
          style={{ backgroundColor: "#FB8500", borderColor: "#FB8500" }}
        >
          Add Project
        </Button>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {loading ? (
        <div className="spinner-container">
          <Spin />
        </div>
      ) : (
        <div
          className="cards-container"
          style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          }}
        >
          {projects.map((project, index) => (
            <Card
              key={project._id || project.projectId}
              title={`Project ${index + 1}`}
              className="card project-card"
              variant="borderless"
              onClick={() =>
                navigate(`/dashboard/projects/${project.projectId}`)
              }
              style={{
                borderRadius: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                cursor: "pointer",
              }}
            >
              <p>
                <strong>Division :</strong> {project.division}
              </p>
              <p>
                <strong>Circle :</strong> {project.circle}
              </p>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title="Add Project Details"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        maskClosable={false}
        styles={{
          body: { borderRadius: 12 },
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="division"
            label="Division"
            rules={[{ required: true, message: "Please enter division" }]}
          >
            <Input placeholder="Enter Division" />
          </Form.Item>

          <Form.Item
            name="circle"
            label="Circle"
            rules={[{ required: true, message: "Please enter circle" }]}
          >
            <Input placeholder="Enter Circle" />
          </Form.Item>

          <Form.Item name="description" label="Project Description (If Any)">
            <Input.TextArea placeholder="Enter Project Description" rows={3} />
          </Form.Item>

          <Form.Item className="form-actions">
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              style={{ backgroundColor: "#FB8500", borderColor: "#FB8500" }}
            >
              Save Details
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;
