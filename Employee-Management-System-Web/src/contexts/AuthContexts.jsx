import React from "react";
import axios from "axios";

export const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  const [token, setToken] = React.useState(null);
  const [adminData, setAdminData] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const authAxios = React.useMemo(() => {
    const instance = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to attach token
    instance.interceptors.request.use(
      (config) => {
        const storedData = JSON.parse(localStorage.getItem("admin_data"));
        if (storedData?.adminToken) {
          config.headers.Authorization = `Bearer ${storedData.adminToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token expiration
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [API_URL]);

  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("admin_data"));
        if (storedData?.adminToken) {
          // Verify token is still valid
          try {
            const response = await axios.get(`${API_URL}/api/auth/me`, {
              headers: {
                Authorization: `Bearer ${storedData.adminToken}`,
              },
            });

            if (response.data?.success) {
              setToken(storedData.adminToken);
              setAdminData(storedData.admin || response.data.user);
              setIsAuthenticated(true);
            } else {
              logout();
            }
          } catch (error) {
            console.error("Token verification failed:", error);
            logout();
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [API_URL]);

  const login = React.useCallback((newToken, userData) => {
    const adminData = {
      id: userData.id,
      name: userData.name,
      role: userData.role,
      email: userData.email,
    };

    localStorage.setItem(
      "admin_data",
      JSON.stringify({
        adminToken: newToken,
        admin: adminData,
      })
    );

    setToken(newToken);
    setAdminData(adminData);
    setIsAuthenticated(true);
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem("admin_data");
    setToken(null);
    setAdminData(null);
    setIsAuthenticated(false);
  }, []);

  const fetchAdminProfile = React.useCallback(async () => {
    try {
      const response = await authAxios.get("/api/auth/me");
      if (response.data?.success) {
        setAdminData(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    }
  }, [authAxios]);

  const contextValue = React.useMemo(
    () => ({
      token,
      isAuthenticated,
      login,
      logout,
      adminData,
      loading,
      fetchAdminProfile,
      authAxios,
    }),
    [
      token,
      isAuthenticated,
      login,
      logout,
      adminData,
      loading,
      fetchAdminProfile,
      authAxios,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
