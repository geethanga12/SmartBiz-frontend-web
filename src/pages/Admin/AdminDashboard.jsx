// File: src/pages/Admin/AdminDashboard.jsx (UPDATE - Replace your existing file)
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Business, People, Psychology, TrendingUp } from "@mui/icons-material";
import DashboardLayout from "../../common/DashboardLayout";
import { adminMenu } from "../../common/navigation/adminRoutes";
import { adminService } from "../../service/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminService.getSystemStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch admin stats", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard" menu={adminMenu}>
        <Box sx={{ p: 2, textAlign: "center" }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading system statistics...</Typography>
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
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ borderRadius: 2, bgcolor: "#ffebee" }}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Business sx={{ fontSize: 40, color: "#d32f2f", mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Total Businesses</Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>{stats?.totalBusinesses || 0}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ borderRadius: 2, bgcolor: "#e3f2fd" }}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <People sx={{ fontSize: 40, color: "#1976d2", mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Total Users</Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>{stats?.totalUsers || 0}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ borderRadius: 2, bgcolor: "#e8f5e9" }}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Psychology sx={{ fontSize: 40, color: "#4caf50", mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">AI Requests</Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>{stats?.totalAIRequests || 0}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ borderRadius: 2, bgcolor: "#fff3e0" }}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <TrendingUp sx={{ fontSize: 40, color: "#ff9800", mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">AI Costs</Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>${stats?.totalAICosts?.toFixed(2) || '0.00'}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Business Status Breakdown */}
        {stats?.businessesByStatus && (
          <Paper sx={{ mt: 4, p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Business Status Breakdown</Typography>
            <Grid container spacing={2}>
              {Object.entries(stats.businessesByStatus).map(([status, count]) => (
                <Grid item xs={12} sm={4} key={status}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="primary">{count}</Typography>
                    <Typography variant="body2" color="text.secondary">{status}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* AI Usage Breakdown */}
        {stats?.aiRequestsByType && Object.keys(stats.aiRequestsByType).length > 0 && (
          <Paper sx={{ mt: 4, p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>AI Usage by Type</Typography>
            <Grid container spacing={2}>
              {Object.entries(stats.aiRequestsByType).map(([type, count]) => (
                <Grid item xs={12} sm={4} key={type}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="secondary">{count}</Typography>
                    <Typography variant="body2" color="text.secondary">{type}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* Recent Activity */}
        {stats?.recentLogs && stats.recentLogs.length > 0 && (
          <Paper sx={{ mt: 4, p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            {stats.recentLogs.slice(0, 5).map((log, index) => (
              <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>{log.userEmail}</strong> - {log.action} ({new Date(log.timestamp).toLocaleString()})
                </Typography>
              </Box>
            ))}
          </Paper>
        )}
      </Box>
    </DashboardLayout>
  );
}