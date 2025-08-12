// src/pages/Owner/RegisterBusiness.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  Typography,
  Avatar,
  Container,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useNavigate } from "react-router-dom";
import instance from "../../service/AxiosOrder";

export default function RegisterBusiness() {
  const [form, setForm] = useState({ businessName: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: "info", msg: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await instance.post("/api/business/register", form);
      setSnack({
        open: true,
        severity: "success",
        msg: "🎉 Business registered successfully!",
      });
      setTimeout(() => navigate("/owner/dashboard", { replace: true }), 1000);
    } catch (err) {
      setSnack({
        open: true,
        severity: "error",
        msg: err.response?.data || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={6}
        sx={{
          p: 5,
          mt: 8,
          borderRadius: 4,
          textAlign: "center",
          overflow: "hidden",
          bgcolor: "background.paper",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 60,
            height: 60,
            mx: "auto",
            mb: 2,
            boxShadow: 3,
          }}
        >
          <StorefrontIcon fontSize="large" />
        </Avatar>

        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Register Your Business
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Get started with SmartBiz and manage your business efficiently.
        </Typography>

        <Box component="form" onSubmit={submit}>
          <Stack spacing={3}>
            <TextField
              name="businessName"
              label="Business Name"
              placeholder="e.g., SmartTech Solutions"
              value={form.businessName}
              onChange={handleChange}
              required
              fullWidth
              autoFocus
            />
            <TextField
              name="address"
              label="Business Address"
              placeholder="123 Main St, Colombo"
              value={form.address}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={3}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, fontSize: "1.1rem", borderRadius: 3 }}
            >
              {loading ? "Registering..." : "Register Business 🚀"}
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snack.severity} sx={{ width: "100%" }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}