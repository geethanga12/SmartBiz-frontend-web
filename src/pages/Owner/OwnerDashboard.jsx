import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Grow,
} from "@mui/material";
import { AttachMoney, Inventory, TrendingUp, MoneyOff } from "@mui/icons-material";
import { BarChart } from "@mui/x-charts/BarChart";
import instance from "../../service/AxiosOrder";
import DashboardLayout from "../../common/DashboardLayout";
import { ownerMenu } from "../../common/navigation/ownerRoutes";

const formatCurrency = (value) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);

export default function OwnerDashboard() {
  const [overview, setOverview] = useState({
    sales: 0,
    inventoryValue: 0,
    profits: 0,
    expenses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const res = await instance.get("/api/v1/dashboard/overview");
      setOverview(res.data);
    } catch (err) {
      console.error("Failed to fetch overview", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Owner Dashboard" menu={ownerMenu}>
        <Box sx={{ p: { xs: 2, md: 3 }, textAlign: "center" }}>
          <Typography>Loading overview...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Owner Dashboard" menu={ownerMenu}>
      <Grow in timeout={500}>
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f9fafb", borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
            Business Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3} sx={{ borderRadius: 2, bgcolor: "#e3f2fd" }}>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <AttachMoney sx={{ fontSize: 40, color: "#1976d2", mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Sales</Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>{formatCurrency(overview.sales)}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3} sx={{ borderRadius: 2, bgcolor: "#e8f5e9" }}>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <Inventory sx={{ fontSize: 40, color: "#4caf50", mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Inventory Value</Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>{formatCurrency(overview.inventoryValue)}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3} sx={{ borderRadius: 2, bgcolor: "#fff3e0" }}>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <TrendingUp sx={{ fontSize: 40, color: "#ff9800", mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Profits</Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>{formatCurrency(overview.profits)}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3} sx={{ borderRadius: 2, bgcolor: "#ffebee" }}>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <MoneyOff sx={{ fontSize: 40, color: "#f44336", mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Expenses</Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>{formatCurrency(overview.expenses)}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, p: 2, bgcolor: "#fff", borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Daily Metrics
            </Typography>
            <BarChart
              xAxis={[{ scaleType: "band", data: ["Sales", "Expenses", "Profits"] }]}
              series={[{ data: [overview.sales, overview.expenses, overview.profits], color: "#1976d2" }]}
              width={500}
              height={300}
              sx={{ "& .MuiChartsAxis-label": { fill: "#333" } }}
            />
          </Box>
        </Box>
      </Grow>
    </DashboardLayout>
  );
}