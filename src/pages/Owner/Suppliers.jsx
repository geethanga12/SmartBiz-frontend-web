// src/pages/Owner/Suppliers.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  Grow,
  Paper
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import instance from "../../service/AxiosOrder";
import DashboardLayout from "../../common/DashboardLayout";
import { ownerMenu } from "../../common/navigation/ownerRoutes";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [searchId, setSearchId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [snack, setSnack] = useState({ open: false, severity: "info", msg: "" });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/api/v1/supplier");
      setSuppliers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to load suppliers" });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = async () => {
    if (!searchId) {
      fetchSuppliers();
      return;
    }
    try {
      const res = await instance.get(`/api/v1/supplier/${searchId}`);
      setSuppliers([res.data]);
    } catch (err) {
      console.error("Failed to fetch supplier by ID:", err);
      setSuppliers([]);
      setSnack({ open: true, severity: "error", msg: "Supplier not found" });
    }
  };

  const handleSearchByEmail = async () => {
    if (!searchEmail) {
      fetchSuppliers();
      return;
    }
    try {
      const res = await instance.get(`/api/v1/supplier/get_by_email/${searchEmail}`);
      setSuppliers([res.data]);
    } catch (err) {
      console.error("Failed to fetch supplier by email:", err);
      setSuppliers([]);
      setSnack({ open: true, severity: "error", msg: "Supplier not found" });
    }
  };

  const clearSearch = () => {
    setSearchId("");
    setSearchEmail("");
    fetchSuppliers();
  };

  const handleOpenAddEdit = (supplier = { id: null, name: "", email: "", phone: "", address: "" }) => {
    setCurrentSupplier(supplier);
    setIsEdit(!!supplier.id);
    setOpenAddEdit(true);
  };

  const handleCloseAddEdit = () => {
    setOpenAddEdit(false);
  };

  const handleChange = (e) => {
    setCurrentSupplier({ ...currentSupplier, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!currentSupplier.name || !currentSupplier.email) {
      setSnack({ open: true, severity: "error", msg: "Name and email are required" });
      return;
    }
    try {
      if (isEdit) {
        await instance.put(`/api/v1/supplier/${currentSupplier.id}`, currentSupplier);
        setSnack({ open: true, severity: "success", msg: "Supplier updated" });
      } else {
        await instance.post("/api/v1/supplier", currentSupplier);
        setSnack({ open: true, severity: "success", msg: "Supplier added" });
      }
      fetchSuppliers();
      handleCloseAddEdit();
    } catch (err) {
      console.error("Failed to save supplier:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to save supplier" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/api/v1/supplier/${id}`);
      setSnack({ open: true, severity: "success", msg: "Supplier deleted" });
      fetchSuppliers();
    } catch (err) {
      console.error("Failed to delete supplier:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to delete supplier" });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90, sortable: true },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "address", headerName: "Address", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpenAddEdit(params.row)} color="primary" aria-label="edit supplier">
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error" aria-label="delete supplier">
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <DashboardLayout title="Suppliers" menu={ownerMenu}>
      <Grow in timeout={500}>
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f9fafb", borderRadius: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Supplier Management
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              onClick={() => handleOpenAddEdit()} 
              color="primary" 
              aria-label="add supplier"
            >
              Add Supplier
            </Button>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Search by ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                fullWidth
                type="number"
                aria-label="search supplier by ID"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button 
                variant="outlined" 
                startIcon={<Search />} 
                onClick={handleSearchById} 
                fullWidth 
                aria-label="search supplier by ID"
              >
                Search ID
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Search by Email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                fullWidth
                aria-label="search supplier by email"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button 
                variant="outlined" 
                startIcon={<Search />} 
                onClick={handleSearchByEmail} 
                fullWidth 
                aria-label="search supplier by email"
              >
                Search Email
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button 
                variant="text" 
                onClick={clearSearch} 
                fullWidth 
                aria-label="clear search"
              >
                Clear Search
              </Button>
            </Grid>
          </Grid>

          <Paper elevation={3} sx={{ p: 2, borderRadius: 2, bgcolor: "#fff" }}>
            <Box sx={{ height: { xs: 400, md: 600 }, width: "100%" }}>
              <DataGrid
                rows={suppliers}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                loading={loading}
                disableRowSelectionOnClick
                disableColumnMenu
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: "#ff9800",
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    zIndex: 1,
                  },
                  "& .MuiDataGrid-row:hover": { bgcolor: "#fff3e0" },
                  "& .MuiDataGrid-cell": { py: 1.5 },
                  borderRadius: 2,
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Grow>

      <Dialog open={openAddEdit} onClose={handleCloseAddEdit} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#ff9800", color: "#fff" }}>
          {isEdit ? "Edit Supplier" : "Add Supplier"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            name="name"
            label="Name"
            value={currentSupplier.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            aria-label="supplier name"
          />
          <TextField
            name="email"
            label="Email"
            value={currentSupplier.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            type="email"
            aria-label="supplier email"
          />
          <TextField
            name="phone"
            label="Phone"
            value={currentSupplier.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            aria-label="supplier phone"
          />
          <TextField
            name="address"
            label="Address"
            value={currentSupplier.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
            aria-label="supplier address"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddEdit} color="secondary" aria-label="cancel">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary" aria-label="save supplier">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snack.open} 
        autoHideDuration={4000} 
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity} sx={{ width: "100%" }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}