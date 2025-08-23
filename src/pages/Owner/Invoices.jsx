import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Grow,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Visibility, Download } from "@mui/icons-material";
import instance from "../../service/AxiosOrder";
import DashboardLayout from "../../common/DashboardLayout";
import { ownerMenu } from "../../common/navigation/ownerRoutes";

const formatCurrency = (value) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/api/v1/order");
      setInvoices(res.data || []);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    const inv = invoices.find((i) => i.id === id);
    setSelected(inv);
    setOpen(true);
  };

  const handleDownload = (id) => {
    console.log("Download invoice", id);
    // Implement download logic (e.g., generate PDF via API)
  };

  const columns = [
    { field: "id", headerName: "Invoice ID", width: 120, sortable: true },
    { field: "date", headerName: "Date", width: 180, valueFormatter: (value) => new Date(value).toLocaleString('en-LK') },
    { field: "amount", headerName: "Amount", width: 150, valueFormatter: (value) => formatCurrency(value) },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleView(params.row.id)} color="primary" aria-label="view invoice"><Visibility /></IconButton>
          <IconButton onClick={() => handleDownload(params.row.id)} color="secondary" aria-label="download invoice"><Download /></IconButton>
        </>
      ),
    },
  ];

  return (
    <DashboardLayout title="Invoices" menu={ownerMenu}>
      <Grow in timeout={500}>
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f9fafb", borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
            Invoice Management
          </Typography>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2, bgcolor: "#fff" }}>
            <Box sx={{ height: { xs: 400, md: 600 }, width: "100%" }}>
              <DataGrid
                rows={invoices}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                loading={loading}
                disableRowSelectionOnClick
                disableColumnMenu
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: "#1976d2",
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    zIndex: 1,
                  },
                  "& .MuiDataGrid-row:hover": { bgcolor: "#e3f2fd" },
                  "& .MuiDataGrid-cell": { py: 1.5 },
                  borderRadius: 2,
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Grow>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: "#1976d2", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Invoice Details #{selected?.id}
          <Button variant="contained" color="secondary" startIcon={<Download />} onClick={() => handleDownload(selected?.id)} size="small" aria-label="download invoice">
            Download
          </Button>
        </DialogTitle>
        <DialogContent>
          {selected && (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Date:</strong> {new Date(selected.date).toLocaleString('en-LK')}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Amount:</strong> {formatCurrency(selected.amount)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Status:</strong> {selected.status}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Customer ID:</strong> {selected.customerId}</Typography>
                </Grid>
              </Grid>
              <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Item ID</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Discount</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selected.details?.map((d, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{d.itemId}</TableCell>
                        <TableCell>{d.quantity}</TableCell>
                        <TableCell>{formatCurrency(d.price)}</TableCell>
                        <TableCell>{formatCurrency(d.discount)}</TableCell>
                        <TableCell>{formatCurrency(d.quantity * d.price - d.discount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} aria-label="close dialog">Close</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}