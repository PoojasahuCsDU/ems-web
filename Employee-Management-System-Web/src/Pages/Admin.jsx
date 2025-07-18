import React, { useState, useEffect } from "react";
import { Button, Input, Table, Typography, message, Spin } from "antd";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

const { Title } = Typography;

const AdminPage = () => {
  const { authAxios } = useAuth(); // get axios instance from context
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await authAxios.get("/api/auth/admins");
      setAdmins(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
      message.error("Failed to load administrators");
      setLoading(false);
    }
  };

  const handleAddAdmin = () => {
    navigate("/dashboard/register-admin");
  };

  const filteredAdmins = admins.filter((admin) => {
    const searchLower = searchText.toLowerCase();
    return (
      admin.name?.toLowerCase().includes(searchLower) ||
      admin.email?.toLowerCase().includes(searchLower) ||
      admin.mobileNo?.toLowerCase().includes(searchLower) ||
      admin.empId?.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Employee ID",
      dataIndex: "empId",
      key: "empId",
    },
    {
      title: "Phone Number",
      dataIndex: "mobileNo",
      key: "mobileNo",
      render: (text) => text || "N/A",
    },
  ];

  return (
    <div className="content-section">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Title level={4}>Administrators</Title>
        <div style={{ display: "flex", gap: 16 }}>
          <Input
            placeholder="Search admins..."
            prefix={<FiSearch />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            icon={<FiPlus />}
            onClick={handleAddAdmin}
            className="admin-action-btn"
          >
            Add Admin
          </Button>
        </div>
      </div>

      {loading && admins.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
          <p style={{ marginTop: "20px" }}>Loading administrators...</p>
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredAdmins}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "No administrators found" }}
        />
      )}
    </div>
  );
};

export default AdminPage;
