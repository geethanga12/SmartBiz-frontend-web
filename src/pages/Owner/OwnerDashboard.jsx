// src/pages/Owner/OwnerDashboard.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import instance from "../../service/AxiosOrder";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../common/DashboardLayout";
import { ownerMenu } from "../../common/navigation/ownerRoutes";

export default function OwnerDashboard() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let canceled = false;
    const fetchBusiness = async () => {
      try {
        const res = await instance.get("/api/business/my");
        if (!canceled) setBusiness(res.data);
      } catch (err) {
        console.error("Failed to fetch business:", err);
        if (!canceled) {
          setBusiness(null);
          navigate("/owner/register-business", { replace: true });
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    fetchBusiness();
    return () => {
      canceled = true;
    };
  }, [navigate]);

  if (loading) return <Typography sx={{ p: 3 }}>Loading...</Typography>;

  return (
    <DashboardLayout title="Owner Dashboard" menu={ownerMenu}>
      {!business ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">No business found</Typography>
          <Typography sx={{ mb: 2 }}>
            You don't have a registered business yet.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/owner/register-business")}
          >
            Register My Business
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {business.businessName}
          </Typography>
          <Typography>Address: {business.address}</Typography>
          <Typography>Owner: {business.ownerEmail}</Typography>
          <Typography>Status: {business.status}</Typography>
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/owner/products")}
            >
              Manage Products
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/owner/customers")}
            >
              Manage Customers
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/owner/suppliers")}
            >
              Manage Suppliers
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/owner/employees")}
            >
              Manage Employees
            </Button>
          </Box>
        </Paper>
      )}
    </DashboardLayout>
  );
}
