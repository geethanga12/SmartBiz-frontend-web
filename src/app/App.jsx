// src/app/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import { Box, Typography, CssBaseline } from "@mui/material";

/*
  App behavior:
  - If token exists in localStorage -> show a simple "Logged in" view (you will replace it later with Dashboard)
  - If no token -> show auth routes
*/

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user-token");
    setLoggedIn(!!token);
  }, []);

  return (
    <>
      <CssBaseline />
      <Box>
        {loggedIn ? (
          // placeholder for dashboard — per your request: do NOT create Dashboard.jsx now
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <Typography variant="h4">Logged in — replace this with your Dashboard</Typography>
          </Box>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </Box>
    </>
  );
}
