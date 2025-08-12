// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import instance from "../../service/AxiosOrder";
import DashboardLayout from "../../common/DashboardLayout";
import { adminMenu } from "../../common/navigation/adminRoutes";

export default function AdminDashboard() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await instance.get("/api/business/all");
        setBusinesses(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <DashboardLayout title="Admin Dashboard" menu={adminMenu}>
      <Box sx={{ p: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Registered Businesses
        </Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Business</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5}>Loading...</TableCell>
                </TableRow>
              ) : businesses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>No businesses found.</TableCell>
                </TableRow>
              ) : (
                businesses.map((b) => (
                  <TableRow key={b.businessId}>
                    <TableCell>{b.businessId}</TableCell>
                    <TableCell>{b.businessName}</TableCell>
                    <TableCell>{b.ownerEmail}</TableCell>
                    <TableCell>{b.address}</TableCell>
                    <TableCell>{b.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}