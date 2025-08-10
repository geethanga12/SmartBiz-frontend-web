// src/pages/Register/Register.jsx
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
import { PersonAddAlt, Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../service/AxiosOrder";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "OWNER",
  });
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
      // POST /auth/register expects { name, email, password, role }
      const res = await instance.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      setSnack({
        open: true,
        severity: "success",
        msg: res.data || "Registered successfully",
      });

      // Optionally redirect to login
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Registration failed.";
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
        background: "linear-gradient(135deg, #7b2ff7 0%, #3a7bd5 100%)", // softer purple → soft blue
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: { xs: "95%", sm: 520 },
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <PersonAddAlt sx={{ fontSize: 40 }} />
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
            Register
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Create a new account to start using SmartBiz
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              name="name"
              label="Full name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="name"
            />
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
              {loading ? "Registering..." : "Register"}
            </Button>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2">
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "#1976d2" }}
                >
                  Login
                </Link>
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={4500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
