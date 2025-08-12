// src/pages/Login/Login.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Paper,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../service/AxiosOrder";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    severity: "info",
    msg: "",
  });

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // POST /auth/login expects { email, password } and returns AuthResponse {token, email, role}
      const res = await instance.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      const { token } = res.data;
      if (!token) throw new Error("No token received");

      // Save token & simple user info (if you want)
      localStorage.setItem("user-token", token);
      localStorage.setItem("user-email", res.data.email || "");
      localStorage.setItem("user-role", res.data.role || "OWNER");

      // ROLE-based redirect:
      const role = res.data.role || "OWNER";
      if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        // OWNER -> check business page will handle "no business" flow
        navigate("/owner/dashboard", { replace: true });
      }

      // setSnack({ open: true, severity: "success", msg: "Login successful" });
      // navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Login failed. Check credentials.";
      setSnack({ open: true, severity: "error", msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)", // deep purple → vibrant blue
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: { xs: "95%", sm: 450 },
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <LockOutlined sx={{ fontSize: 40 }} />
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Welcome back — login to access your SmartBiz panel
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              name="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="email"
            />
            <TextField
              name="password"
              label="Password"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPass((s) => !s)}
                      edge="end"
                      size="large"
                    >
                      {showPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{ textDecoration: "none", color: "#1976d2" }}
                >
                  Register
                </Link>
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
