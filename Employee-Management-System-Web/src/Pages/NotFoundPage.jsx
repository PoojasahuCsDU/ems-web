// src/pages/NotFound.jsx
import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        color: "#333",
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      <img
        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif" // Replace with your preferred 404 image
        alt="404 - Page Not Found"
        style={{
          width: "300px",
          maxWidth: "80%",
          marginBottom: "24px",
        }}
      />
      <h1 style={{ fontSize: "2.5rem", margin: "16px 0 8px" }}>
        Oops! Page Not Found
      </h1>
      <p
        style={{
          maxWidth: 500,
          margin: "0 auto 32px",
          fontSize: "1.1rem",
          color: "#555",
        }}
      >
        It looks like the page you’re looking for doesn’t exist. Let’s get you
        back on track!
      </p>
      <Button
        type="primary"
        size="large"
        onClick={() => navigate("/login")}
        style={{
          backgroundColor: "#FB8500",
          borderColor: "#FB8500",
          borderRadius: "30px",
          fontSize: "1rem",
          padding: "0 32px",
          height: "48px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transition: "all 0.3s",
        }}
      >
        Go to Login
      </Button>
    </div>
  );
};

export default NotFound;
