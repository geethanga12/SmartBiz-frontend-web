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
  Grid,
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
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = async () => {
    if (!searchId) return;
    try {
      const res = await instance.get(`/api/v1/supplier/${searchId}`);
      setSuppliers([res.data]);
    } catch (err) {
      console.error("Failed to fetch supplier by ID:", err);
      setSuppliers([]);
    }
  };

  const handleSearchByEmail = async () => {
    if (!searchEmail) return;
    try {
      const res = await instance.get(`/api/v1/supplier/get_by_email/${searchEmail}`);
      setSuppliers([res.data]);
    } catch (err) {
      console.error("Failed to fetch supplier by email:", err);
      setSuppliers([]);
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
    try {
      if (isEdit) {
        await instance.put(`/api/v1/supplier/${currentSupplier.id}`, currentSupplier);
      } else {
        await instance.post("/api/v1/supplier", currentSupplier);
      }
      fetchSuppliers();
      handleCloseAddEdit();
    } catch (err) {
      console.error("Failed to save supplier:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/api/v1/supplier/${id}`);
      fetchSuppliers();
    } catch (err) {
      console.error("Failed to delete supplier:", err);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
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
          <IconButton onClick={() => handleOpenAddEdit(params.row)}><Edit /></IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}><Delete /></IconButton>
        </>
      ),
    },
  ];

  return (
    <DashboardLayout title="Suppliers" menu={ownerMenu}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Supplier Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenAddEdit()}>
            Add Supplier
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Search by ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              fullWidth
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button variant="outlined" startIcon={<Search />} onClick={handleSearchById} fullWidth>
              Search ID
            </Button>
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Search by Email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button variant="outlined" startIcon={<Search />} onClick={handleSearchByEmail} fullWidth>
              Search Email
            </Button>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button variant="text" onClick={clearSearch} fullWidth>
              Clear Search
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={suppliers}
            columns={columns}
            pageSizeOptions={[5, 10]}
            loading={loading}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>

      <Dialog open={openAddEdit} onClose={handleCloseAddEdit}>
        <DialogTitle>{isEdit ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
        <DialogContent>
          <TextField name="name" label="Name" value={currentSupplier.name} onChange={handleChange} fullWidth margin="normal" required />
          <TextField name="email" label="Email" value={currentSupplier.email} onChange={handleChange} fullWidth margin="normal" required />
          <TextField name="phone" label="Phone" value={currentSupplier.phone} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="address" label="Address" value={currentSupplier.address} onChange={handleChange} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddEdit}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
} 