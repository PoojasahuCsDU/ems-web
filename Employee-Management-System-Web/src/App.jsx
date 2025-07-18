import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import RegisterAdmin from "./Auth/RegisterAdmin";
import Login from "./Auth/Login";
import Dashboard from "./Pages/Dashboard.jsx";
import AdminPage from "./Pages/Admin.jsx";
import Projects from "./Pages/Projects.jsx";
import EmployeesPage from "./Pages/EmployeesPage.jsx";
import ProjectDetail from "./Pages/ProjectDetail.jsx";
import NotFound from "./Pages/NotFoundPage.jsx";
import { AuthProvider } from "./contexts/AuthContexts";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<div>Welcome to Dashboard</div>} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="register-admin" element={<RegisterAdmin />} />
        </Route>
      </Route>

      {/* Default Redirect from "/" to "/dashboard" */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Route for 404 */}
      <Route path="/404" element={<NotFound />} />

      {/* Catch-all wildcard route for unknown paths redirects to /404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
