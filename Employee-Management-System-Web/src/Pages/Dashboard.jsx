import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiFolder,
  FiUsers,
  FiUserCheck,
  FiChevronDown,
  FiLogOut,
} from "react-icons/fi";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "../App.css";
import logo from "../assets/png/LogoImage.png";
import projectsIcon from "../assets/png/projects-icon.png";
import employeesIcon from "../assets/png/employees-icon.png";
import { useAuth } from "../contexts/useAuth";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [errorProjects, setErrorProjects] = useState(null);
  const [errorEmployees, setErrorEmployees] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const {
    adminData,
    logout,
    isAuthenticated,
    authAxios,
    loading: authLoading,
  } = useAuth();

  // Check authentication status
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Sync active tab with current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/admin")) {
      setActiveTab("admins");
    } else if (path.includes("/projects")) {
      setActiveTab("projects");
    } else if (path.includes("/employees")) {
      setActiveTab("employees");
    } else {
      setActiveTab("home");
    }
  }, [location]);

  // Fetch total projects count
  useEffect(() => {
    const fetchProjectsCount = async () => {
      if (authLoading || !isAuthenticated) return;

      try {
        setLoadingProjects(true);
        const response = await authAxios.get("/api/projects/all-projects");
        setTotalProjects(response.data.count || 0);
        setErrorProjects(null);
      } catch (err) {
        setErrorProjects("Failed to fetch projects");
        console.error("Error fetching projects:", err);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjectsCount();
  }, [isAuthenticated, authAxios, authLoading]);

  // Fetch total employees count
  useEffect(() => {
    const fetchEmployeesCount = async () => {
      if (authLoading || !isAuthenticated) return;

      try {
        setLoadingEmployees(true);
        const response = await authAxios.get("/api/auth/employees");
        const employees = response.data?.employees;
        if (Array.isArray(employees)) {
          setTotalEmployees(employees.length);
          setErrorEmployees(null);
        } else {
          setErrorEmployees("Invalid employee data format.");
        }
      } catch (err) {
        setErrorEmployees("Failed to fetch employees");
        console.error("Error fetching employees:", err);
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployeesCount();
  }, [isAuthenticated, authAxios, authLoading]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "admins":
        navigate("/dashboard/admin");
        break;
      case "projects":
        navigate("/dashboard/projects");
        break;
      case "employees":
        navigate("/dashboard/employees");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const renderHomeContent = () => (
    <div className="content-section">
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">
            <img src={projectsIcon} alt="Projects" className="custom-icon" />
          </div>
          <div className="stat-content">
            <h5>Total Projects</h5>
            {loadingProjects ? (
              <p className="stat-number loading">Loading...</p>
            ) : errorProjects ? (
              <p className="stat-number error">Error</p>
            ) : (
              <p className="stat-number">{totalProjects}</p>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <img src={employeesIcon} alt="Employees" className="custom-icon" />
          </div>
          <div className="stat-content">
            <h5>Total Employees</h5>
            {loadingEmployees ? (
              <p className="stat-number loading">Loading...</p>
            ) : errorEmployees ? (
              <p className="stat-number error">Error</p>
            ) : (
              <p className="stat-number">{totalEmployees}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (authLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-left">
          <img src={logo} alt="Company Logo" className="company-logo" />
          <h1>AARY INNOVATIVE DESIGNER</h1>
        </div>
        <div className="header-right">
          <div
            className="user-profile"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{adminData ? adminData.name : "Admin User"}</span>
            <FiChevronDown
              className={`dropdown-icon ${isDropdownOpen ? "open" : ""}`}
            />

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={handleLogout}>
                  <FiLogOut className="dropdown-icon" />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <nav className="sidebar">
          <ul>
            <li
              className={activeTab === "home" ? "active" : ""}
              onClick={() => handleTabChange("home")}
            >
              <FiHome className="nav-icon" />
              <span>Home</span>
            </li>
            <li
              className={activeTab === "projects" ? "active" : ""}
              onClick={() => handleTabChange("projects")}
            >
              <FiFolder className="nav-icon" />
              <span>Projects</span>
            </li>
            <li
              className={activeTab === "employees" ? "active" : ""}
              onClick={() => handleTabChange("employees")}
            >
              <FiUsers className="nav-icon" />
              <span>Employees</span>
            </li>
            <li
              className={activeTab === "admins" ? "active" : ""}
              onClick={() => handleTabChange("admins")}
            >
              <FiUserCheck className="nav-icon" />
              <span>Admins</span>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          {location.pathname === "/dashboard" ? (
            renderHomeContent()
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
