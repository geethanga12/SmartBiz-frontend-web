// src/pages/Owner/Customers.jsx
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

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [searchId, setSearchId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/api/v1/customer");
      setCustomers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = async () => {
    if (!searchId) return;
    try {
      const res = await instance.get(`/api/v1/customer/${searchId}`);
      setCustomers([res.data]);
    } catch (err) {
      console.error("Failed to fetch customer by ID:", err);
      setCustomers([]);
    }
  };

  const handleSearchByEmail = async () => {
    if (!searchEmail) return;
    try {
      const res = await instance.get(`/api/v1/customer/get_by_email/${searchEmail}`);
      setCustomers([res.data]);
    } catch (err) {
      console.error("Failed to fetch customer by email:", err);
      setCustomers([]);
    }
  };

  const clearSearch = () => {
    setSearchId("");
    setSearchEmail("");
    fetchCustomers();
  };

  const handleOpenAddEdit = (customer = { id: null, name: "", email: "", phone: "", address: "" }) => {
    setCurrentCustomer(customer);
    setIsEdit(!!customer.id);
    setOpenAddEdit(true);
  };

  const handleCloseAddEdit = () => {
    setOpenAddEdit(false);
  };

  const handleChange = (e) => {
    setCurrentCustomer({ ...currentCustomer, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (isEdit) {
        await instance.put(`/api/v1/customer/${currentCustomer.id}`, currentCustomer);
      } else {
        await instance.post("/api/v1/customer", currentCustomer);
      }
      fetchCustomers();
      handleCloseAddEdit();
    } catch (err) {
      console.error("Failed to save customer:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/api/v1/customer/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error("Failed to delete customer:", err);
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
    <DashboardLayout title="Customers" menu={ownerMenu}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Customer Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenAddEdit()}>
            Add Customer
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
            rows={customers}
            columns={columns}
            pageSizeOptions={[5, 10]}
            loading={loading}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>

      <Dialog open={openAddEdit} onClose={handleCloseAddEdit}>
        <DialogTitle>{isEdit ? "Edit Customer" : "Add Customer"}</DialogTitle>
        <DialogContent>
          <TextField name="name" label="Name" value={currentCustomer.name} onChange={handleChange} fullWidth margin="normal" required />
          <TextField name="email" label="Email" value={currentCustomer.email} onChange={handleChange} fullWidth margin="normal" required />
          <TextField name="phone" label="Phone" value={currentCustomer.phone} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="address" label="Address" value={currentCustomer.address} onChange={handleChange} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddEdit}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}