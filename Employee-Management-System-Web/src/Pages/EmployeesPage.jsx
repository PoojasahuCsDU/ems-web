import React, { useState, useEffect } from "react";
import { Button, Input, message, Spin, Typography, Alert } from "antd";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import EmployeeList from "../components/employees/EmployeeList";
import EmployeeForm from "../components/employees/EmployeeForm";
import EmployeeDetail from "../components/employees/EmployeeDetail";
import { useWindowSize } from "../hooks/useWindow";
import { useAuth } from "../contexts/useAuth";

const { Title } = Typography;

const EmployeesPage = () => {
  const [view, setView] = useState("list");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const windowSize = useWindowSize();
  const { authAxios } = useAuth(); // ✅ use the `authAxios` from context

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const action = params.get("action");
    const id = params.get("id");

    if (action === "add") {
      setView("form");
      setSelectedEmployee({});
    } else if (action === "edit" && id) {
      setView("form");
      fetchEmployeeById(id);
    } else if (action === "view" && id) {
      setView("detail");
      setSelectedEmployee({ empId: id });
    } else {
      setView("list");
      fetchEmployees();
    }
  }, [location.search]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.get("/api/auth/employees");
      const data = response.data;
      if (data && data.employees) {
        setEmployees(data.employees);
        setPagination((prev) => ({
          ...prev,
          total: data.employees.length,
        }));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to load employees:", error);
      setError("Failed to load employees. Please try again later.");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeById = async (empId) => {
    setLoading(true);
    try {
      const response = await authAxios.get(`/api/users/${empId}`);
      const user = response.data.user;
      setSelectedEmployee({ ...user, lookupId: user.empId });
    } catch (error) {
      console.error("Failed to load employee details:", error);
      message.error("Failed to load employee details.");
      navigate("/dashboard/employees");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    navigate("/dashboard/employees?action=add");
  };

  const handleEditEmployee = (empId) => {
    navigate(`/dashboard/employees?action=edit&id=${empId}`);
  };

  const handleBackToList = () => navigate("/dashboard/employees");

  const filteredEmployees = employees.filter((employee) => {
    const searchLower = searchText.toLowerCase();
    return (
      employee.name?.toLowerCase().includes(searchLower) ||
      employee.empId?.toLowerCase().includes(searchLower)
    );
  });

  const handlePaginationChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
    }));
  };

  const getCurrentPageData = () => {
    const start = (pagination.current - 1) * pagination.pageSize;
    return filteredEmployees.slice(start, start + pagination.pageSize);
  };

  const renderContent = () => {
    if (loading && view === "list" && employees.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      );
    }

    if (view === "form") {
      return (
        <EmployeeForm
          employee={selectedEmployee}
          onBack={handleBackToList}
          onSuccess={fetchEmployees}
        />
      );
    }

    if (view === "detail") {
      return (
        <EmployeeDetail
          employeeId={selectedEmployee?.empId}
          onBack={handleBackToList}
        />
      );
    }

    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Title level={4}>Employee List</Title>
          <div style={{ display: "flex", gap: 16 }}>
            <Input
              placeholder="Search Employee ID or Name"
              prefix={<FiSearch />}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: windowSize.width < 768 ? "100%" : "250px" }}
            />
            <Button
              type="primary"
              icon={<FiPlus />}
              onClick={handleAddEmployee}
              style={{ backgroundColor: "#FB8500", borderColor: "#FB8500" }}
            >
              Add Employee
            </Button>
          </div>
        </div>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
            action={
              <Button size="small" type="primary" onClick={fetchEmployees}>
                Retry
              </Button>
            }
          />
        )}

        <EmployeeList
          employees={getCurrentPageData()}
          loading={loading}
          onEdit={handleEditEmployee}
          onView={() => {}}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filteredEmployees.length,
            onChange: handlePaginationChange,
            showSizeChanger: false,
          }}
          simplified={true}
        />
      </>
    );
  };

  return <div className="content-section">{renderContent()}</div>;
};

export default EmployeesPage;
