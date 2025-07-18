import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  message,
  Typography,
  Spin,
  Avatar,
  Space,
  Row,
  Col,
  Modal,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import {
  UserOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { authAxios } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [empId, setEmpId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const fetchEmployeeDetails = async (employeeIds) => {
    try {
      const results = await Promise.all(
        employeeIds.map((id) =>
          authAxios.get(`/api/users/${id}`).then((res) => res.data.user)
        )
      );
      setEmployees(results.filter(Boolean));
    } catch (err) {
      console.error("❌ Failed to load employee details", err);
      setEmployees([]);
      message.error("❌ Could not load employee details.");
    }
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await authAxios.get("/api/projects/all-projects");
      const projectData = res.data.projects.find(
        (p) => p.projectId === projectId
      );

      if (!projectData) throw new Error("Project not found");

      setProject(projectData);

      const employeeIds = (projectData.employees || []).map((emp) =>
        typeof emp === "object" ? emp.empId : emp
      );

      await fetchEmployeeDetails(employeeIds);
    } catch (err) {
      console.error("❌ Error fetching project:", err);
      setProject(null);
      setEmployees([]);
      setError("❌ Failed to load project details.");
    } finally {
      setLoading(false);
    }
  };

  const assignEmployee = async () => {
    if (!empId.trim()) {
      message.warning("⚠️ Please enter a valid Employee ID");
      return;
    }

    setAssigning(true);
    try {
      const empRes = await authAxios.get(`/api/users/${empId.trim()}`);
      const employee = empRes.data.user;

      const assignRes = await authAxios.post(
        `/api/projects/${projectId}/assign`,
        { empId: empId.trim() }
      );

      if (
        assignRes.data &&
        (assignRes.data.success || assignRes.data.message)
      ) {
        message.success(
          assignRes.data.message || `Assigned ${employee.name} successfully`
        );
        setEmpId("");
        await fetchProject();
        return;
      }

      throw new Error(assignRes.data?.message || "Assignment failed");
    } catch (err) {
      console.error("❌ Assignment error:", err);
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "❌ Failed to assign employee";
      message.error(msg);
    } finally {
      setAssigning(false);
    }
  };

  const handleDownload = async (type) => {
    try {
      setDownloading(true);

      let downloadUrl = "";
      if (type === "map") {
        downloadUrl = `/api/downloads/kmz/${projectId}/${selectedEmployee.empId}`;
      } else if (type === "excel") {
        downloadUrl = `/api/downloads/excel/${projectId}/${selectedEmployee.empId}`;
      } else if (type === "pdf") {
        downloadUrl = `/api/downloads/pdf/${projectId}/${selectedEmployee.empId}`;
      } else {
        downloadUrl = `/api/employees/${selectedEmployee.empId}/download/${type}`;
      }

      const response = await authAxios.get(downloadUrl, {
        responseType: "blob",
      });

      let fileName = "";
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (fileNameMatch?.[1]) {
          fileName = fileNameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      message.success(`✅ ${type.toUpperCase()} file downloaded successfully.`);
    } catch (err) {
      if (err.response?.status === 400) {
        message.error("⚠️ Missing project ID or employee ID.");
      } else if (err.response?.status === 403) {
        message.error("⛔ You are not authorized to download this file.");
      } else if (err.response?.status === 404) {
        message.error("❌ Project, employee, or waypoints not found.");
        navigate("/NotFound");
      } else if (err.response?.status === 500) {
        message.error("❌ Internal Server Error.");
      } else {
        message.error("❌ Failed to download the file.");
      }
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-section">
        <Card>
          <Text type="danger">{error}</Text>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="content-section">
        <Card>
          <Text>Project not found</Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="content-section">
      <Card style={{ borderRadius: 12, marginBottom: 24 }}>
        <Title level={4}>Project ID: {project.projectId}</Title>
        <Text strong>Division:</Text> {project.division} <br />
        <Text strong>Circle:</Text> {project.circle}
      </Card>

      {project.description && (
        <Card style={{ borderRadius: 12, marginBottom: 24 }}>
          <Title level={4}>Project Description</Title>
          <Text>{project.description}</Text>
        </Card>
      )}

      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4}>Employees</Title>
        </Col>
        <Col>
          <Space>
            <Input
              placeholder="Enter Employee ID"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              type="primary"
              loading={assigning}
              onClick={assignEmployee}
              style={{ backgroundColor: "#FB8500", borderColor: "#FB8500" }}
            >
              Assign Employee
            </Button>
          </Space>
        </Col>
      </Row>

      {employees.length === 0 ? (
        <Card style={{ borderRadius: 12 }}>
          <Text>No employees assigned yet.</Text>
        </Card>
      ) : (
        <Space direction="vertical" style={{ display: "flex" }}>
          {employees.map((emp) => (
            <Card key={emp.empId} style={{ borderRadius: 12 }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <Avatar
                      src={emp.image || null}
                      icon={!emp.image && <UserOutlined />}
                      size={48}
                    />
                    <Space direction="vertical" size={0}>
                      <Text strong style={{ fontSize: 16 }}>
                        {emp.name}
                      </Text>
                      <Text type="secondary">{emp.empId}</Text>
                    </Space>
                  </Space>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    ghost
                    style={{ color: "#FB8500", borderColor: "#FB8500" }}
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setLogModalVisible(true);
                    }}
                  >
                    View Logs
                  </Button>
                </Col>
              </Row>
            </Card>
          ))}
        </Space>
      )}

      <Modal
        title={`Activity Logs`}
        open={logModalVisible}
        onCancel={() => setLogModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedEmployee && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Avatar
                src={selectedEmployee.image || null}
                size={64}
                icon={!selectedEmployee.image && <UserOutlined />}
              />
              <div style={{ marginLeft: 16 }}>
                <Title level={4} style={{ margin: 0 }}>
                  {selectedEmployee.name}
                </Title>
                <Text type="secondary">
                  Employee ID: {selectedEmployee.empId}
                </Text>
              </div>
            </div>

            <Card>
              <Row gutter={16}>
                <Col span={8}>
                  <Button
                    type="text"
                    icon={<DownloadOutlined style={{ color: "#FB8500" }} />}
                    onClick={() => handleDownload("map")}
                    block
                    loading={downloading}
                  >
                    Download Map
                  </Button>
                </Col>
                <Col span={8}>
                  <Button
                    type="text"
                    icon={<FileExcelOutlined style={{ color: "#FB8500" }} />}
                    onClick={() => handleDownload("excel")}
                    block
                    loading={downloading}
                  >
                    Export Excel
                  </Button>
                </Col>
                <Col span={8}>
                  <Button
                    type="text"
                    icon={<FilePdfOutlined style={{ color: "#FB8500" }} />}
                    onClick={() => handleDownload("pdf")}
                    block
                    loading={downloading}
                  >
                    Export PDF
                  </Button>
                </Col>
              </Row>
            </Card>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ProjectDetail;
