import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

import { Result, Spin } from "antd";

const ProtectedRoute = ({
  requiredRole = null,
  redirectPath = "/login", // Changed to redirect to login by default
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Loading..." fullscreen />
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<a href="/dashboard">Return to Dashboard</a>}
      />
    );
  }

  // If authenticated and has required role, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
