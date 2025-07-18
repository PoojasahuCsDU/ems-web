import React, { useState, useEffect } from "react";
import { Button, Spin, Typography, Card, Row, Col, Divider } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import placeholderAvatar from "../../assets/png/default_profile_photo.png";

const { Title, Text } = Typography;

const EmployeeDetail = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authAxios } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const empId = searchParams.get("id");

  useEffect(() => {
    if (!empId) {
      navigate("/dashboard/employees");
      return;
    }

    const fetchEmployeeData = async () => {
      setLoading(true);
      try {
        const response = await authAxios.get(`/api/users/${empId}`);
        setEmployee(response.data.user);
      } catch (error) {
        console.error("Failed to fetch employee details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [authAxios, empId, navigate]);

  const handleEditProfile = () => {
    if (employee?.empId) {
      navigate(`/dashboard/employees?action=edit&id=${employee.empId}`);
    }
  };

  const handleBack = () => {
    navigate("/dashboard/employees");
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={4}>Employee not found</Title>
        <Button onClick={handleBack} icon={<ArrowLeftOutlined />}>
          Back to Employee List
        </Button>
      </div>
    );
  }

  return (
    <div className="content-section">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Back to Employee List
        </Button>
        <Button
          icon={<EditOutlined />}
          type="primary"
          style={{ backgroundColor: "#FB8500", borderColor: "#FB8500" }}
          onClick={handleEditProfile}
        >
          Edit Profile
        </Button>
      </div>

      <Card
        style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}
        styles={{
          body: { padding: 32 },
        }}
      >
        <Row gutter={[32, 24]} align="middle">
          <Col xs={24} md={6} style={{ textAlign: "center" }}>
            <img
              src={employee.image || placeholderAvatar}
              alt={employee.name || "Employee"}
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
              {employee.name || "Unnamed"}
            </Title>
            <Text type="secondary">
              {employee.role?.toUpperCase() || "N/A"}
            </Text>
          </Col>

          <Col xs={24} md={18}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <Title level={5} style={{ marginBottom: 8 }}>
                  Personal Information
                </Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>Email:</Text>
                    <div>{employee.email || "N/A"}</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Phone:</Text>
                    <div>{employee.mobileNo || "N/A"}</div>
                  </Col>
                </Row>
              </Col>

              <Divider />

              <Col span={24}>
                <Title level={5} style={{ marginBottom: 8 }}>
                  Employment Details
                </Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>Employee ID:</Text>
                    <div>{employee.empId || "N/A"}</div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default EmployeeDetail;
