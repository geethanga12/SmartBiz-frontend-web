// src/app/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import OwnerDashboard from "../pages/Owner/OwnerDashboard";
import RegisterBusiness from "../pages/Owner/RegisterBusiness";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ProtectedRoute from "../common/ProtectedRoute";
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import instance from "../service/AxiosOrder";

/*
  App behavior:
  - On mount, if token exists, validate it (GET /api/profile)
  - If valid: role-based redirect
    - ADMIN -> /admin/dashboard
    - OWNER -> check GET /api/business/my
        - has business -> /owner/dashboard
        - no business -> /owner/register-business
  - If invalid token -> clear storage and show auth routes
*/

export default function App() {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const token = localStorage.getItem("user-token");
      if (!token) {
        if (mounted) setChecking(false);
        return;
      }

      try {
        // validate token by calling protected profile endpoint
        await instance.get("/api/profile");

        const role = localStorage.getItem("user-role") || "OWNER";

        // Only auto-redirect if user is on login/register/root
        const shouldAuto = ["/", "/login", "/register"].includes(location.pathname);

        if (role === "ADMIN") {
          if (shouldAuto) navigate("/admin/dashboard", { replace: true });
        } else {
          // OWNER: check business existence
          try {
            await instance.get("/api/business/my");
            if (shouldAuto) navigate("/owner/dashboard", { replace: true });
          } catch (err) {
            // if owner doesn't have business, redirect to register page
            if (shouldAuto) navigate("/owner/register-business", { replace: true });
          }
        }
      } catch (err) {
        // invalid token -> clear storage and leave on login
        localStorage.removeItem("user-token");
        localStorage.removeItem("user-role");
        localStorage.removeItem("user-email");
        if (location.pathname !== "/login") navigate("/login", { replace: true });
      } finally {
        if (mounted) setChecking(false);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [navigate, location]);

  if (checking) {
    return (
      <>
        <CssBaseline />
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Owner routes */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute roles={["OWNER"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/register-business"
          element={
            <ProtectedRoute roles={["OWNER"]}>
              <RegisterBusiness />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
