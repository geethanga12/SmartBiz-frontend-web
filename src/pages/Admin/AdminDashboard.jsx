// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Business, People, Insights } from "@mui/icons-material"; // Icons for admin UI
import { PieChart } from "@mui/x-charts/PieChart"; // PieChart for stats
import instance from "../../service/AxiosOrder";
import DashboardLayout from "../../common/DashboardLayout";
import { adminMenu } from "../../common/navigation/adminRoutes"; // Assume you have adminRoutes similar to owner

export default function AdminDashboard() {
  const [overview, setOverview] = useState({
    totalBusinesses: 0,
    totalUsers: 0,
    aiUsage: 0, // Placeholder for AI logs
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      // Assume backend has /api/v1/dashboard/admin-overview or reuse /business/all for count
      const [businessRes, userRes] = await Promise.all([
        instance.get("/api/business/all"),
        instance.get("/api/users"), // Assume endpoint for users; add if needed
      ]);
      setOverview({
        totalBusinesses: businessRes.data.length,
        totalUsers: userRes.data.length,
        aiUsage: 0, // Stub; add real AI log count later
      });
    } catch (err) {
      console.error("Failed to fetch admin overview", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard" menu={adminMenu}>
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography>Loading overview...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard" menu={adminMenu}>
      <Box sx={{ p: 3, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#d32f2f" }}>
          System Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card elevation={3} sx={{ borderRadius: 2, bgcolor: "#ffebee" }}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Business sx={{ fontSize: 40, color: "#d32f2f", mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Total Businesses</Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>{overview.totalBusinesses}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={3} sx={{ borderRadius: 2, bgcolor: "#e3f2fd" }}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <People sx={{ fontSize: 40, color: "#1976d2", mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Total Users</Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>{overview.totalUsers}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={3} sx={{ borderRadius: 2, bgcolor: "#e8f5e9" }}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Insights sx={{ fontSize: 40, color: "#4caf50", mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">AI Usage</Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>{overview.aiUsage} queries</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* PieChart for stats distribution */}
        <Box sx={{ mt: 4, p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" gutterBottom>Usage Distribution</Typography>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: overview.totalBusinesses, label: "Businesses", color: "#d32f2f" },
                  { id: 1, value: overview.totalUsers, label: "Users", color: "#1976d2" },
                  { id: 2, value: overview.aiUsage, label: "AI Queries", color: "#4caf50" },
                ],
              },
            ]}
            width={400}
            height={200}
          />
        </Box>
      </Box>
    </DashboardLayout>
  );
}