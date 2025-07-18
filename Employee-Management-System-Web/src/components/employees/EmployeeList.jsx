import React from "react";
import { Button, Spin, Empty, Table, Avatar } from "antd";
import { useWindowSize } from "../../hooks/useWindow";
import placeholderAvatar from "../../assets/png/default_profile_photo.png";
import { useNavigate } from "react-router-dom";

const EmployeeList = ({
  employees,
  loading,
  onEdit,
  pagination,
  simplified = false,
}) => {
  const windowSize = useWindowSize();
  const navigate = useNavigate();

  const handleRowClick = (employee) => {
    navigate(`/dashboard/employees?action=view&id=${employee.empId}`);
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <Spin />
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <Empty
        description="No employees found"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ margin: "40px 0" }}
      />
    );
  }

  // For simplified view with pagination (table format)
  if (simplified) {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar
              src={record.image || placeholderAvatar}
              alt={text}
              size="large"
            />
            <span>{text}</span>
          </div>
        ),
      },
      {
        title: "Employee ID",
        dataIndex: "empId",
        key: "empId",
      },
      {
        title: "Actions",
        key: "actions",
        align: "center",
        render: (_, record) => (
          <Button
            type="primary"
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click event
              onEdit(record.empId);
            }}
            style={{ backgroundColor: "#FB8500", borderColor: "#FB8500" }}
          >
            Edit
          </Button>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={employees}
        rowKey={(record) => record._id || record.empId}
        pagination={pagination}
        locale={{ emptyText: "No employees found" }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: "pointer" },
        })}
      />
    );
  }

  // For desktop, render as a table-like layout (original display)
  if (windowSize.width >= 768) {
    return (
      <div className="employee-table">
        <div className="table-header">
          <div className="table-cell" style={{ flex: 3 }}>
            Name
          </div>
          <div className="table-cell" style={{ flex: 2 }}>
            Employee ID
          </div>
          <div className="table-cell" style={{ flex: 3 }}>
            Email
          </div>
          <div className="table-cell" style={{ flex: 2 }}>
            Contact
          </div>
          <div className="table-cell" style={{ flex: 1, textAlign: "center" }}>
            Actions
          </div>
        </div>

        {employees.map((employee) => (
          <div
            className="table-row"
            key={employee._id || employee.empId}
            onClick={() => handleRowClick(employee)}
            style={{ cursor: "pointer" }}
          >
            <div className="table-cell" style={{ flex: 3 }}>
              <div className="employee-info">
                <div className="avatar-container">
                  {employee.image ? (
                    <img
                      src={employee.image}
                      alt={employee.name}
                      className="employee-avatar"
                    />
                  ) : (
                    <img
                      src={placeholderAvatar}
                      alt={employee.name}
                      className="employee-avatar"
                    />
                  )}
                </div>
                <span>{employee.name}</span>
              </div>
            </div>
            <div className="table-cell" style={{ flex: 2 }}>
              {employee.empId}
            </div>
            <div className="table-cell" style={{ flex: 3 }}>
              {employee.email}
            </div>
            <div className="table-cell" style={{ flex: 2 }}>
              {employee.mobileNo || "N/A"}
            </div>
            <div
              className="table-cell"
              style={{ flex: 1, textAlign: "center" }}
            >
              <Button
                type="primary"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row click event
                  onEdit(employee.empId);
                }}
                style={{ backgroundColor: "#FB8500", borderColor: "#FB8500" }}
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // For mobile, render as cards
  return (
    <div className="employee-cards">
      {employees.map((employee) => (
        <div
          className="employee-card"
          key={employee._id || employee.empId}
          onClick={() => handleRowClick(employee)}
          style={{ cursor: "pointer" }}
        >
          <div className="employee-card-header">
            <div className="employee-info">
              <div className="avatar-container">
                {employee.image ? (
                  <img
                    src={employee.image}
                    alt={employee.name}
                    className="employee-avatar"
                  />
                ) : (
                  <img
                    src={placeholderAvatar}
                    alt={employee.name}
                    className="employee-avatar"
                  />
                )}
              </div>
              <div className="employee-details">
                <h3>{employee.name}</h3>
                <p>{employee.empId}</p>
              </div>
            </div>
            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click event
                onEdit(employee.empId);
              }}
              style={{ backgroundColor: "#FB8500", borderColor: "#FB8500" }}
              size="small"
            >
              Edit
            </Button>
          </div>
          <div className="employee-card-content">
            {!simplified && (
              <>
                <p>
                  <strong>Email:</strong> {employee.email}
                </p>
                <p>
                  <strong>Contact:</strong> {employee.mobileNo || "N/A"}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeList;
