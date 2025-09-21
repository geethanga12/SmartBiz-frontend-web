// src/pages/Owner/Employees.jsx
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

const formatCurrency = (value) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({
    id: null,
    name: "",
    password: "",
    role: "",
    salary: 0,
    email: "",
  });
  const [searchId, setSearchId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [snack, setSnack] = useState({ open: false, severity: "info", msg: "" });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/api/v1/employee");
      setEmployees(res.data || []);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to load employees" });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = async () => {
    if (!searchId) {
      fetchEmployees();
      return;
    }
    try {
      const res = await instance.get(`/api/v1/employee/${searchId}`);
      setEmployees([res.data]);
    } catch (err) {
      console.error("Failed to fetch employee by ID:", err);
      setEmployees([]);
      setSnack({ open: true, severity: "error", msg: "Employee not found" });
    }
  };

  const handleSearchByEmail = async () => {
    if (!searchEmail) {
      fetchEmployees();
      return;
    }
    try {
      const res = await instance.get(`/api/v1/employee/get_by_email/${searchEmail}`);
      setEmployees([res.data]);
    } catch (err) {
      console.error("Failed to fetch employee by email:", err);
      setEmployees([]);
      setSnack({ open: true, severity: "error", msg: "Employee not found" });
    }
  };

  const clearSearch = () => {
    setSearchId("");
    setSearchEmail("");
    fetchEmployees();
  };

  const handleOpenAddEdit = (employee = { id: null, name: "", password: "", role: "", salary: 0, email: "" }) => {
    setCurrentEmployee(employee);
    setIsEdit(!!employee.id);
    setOpenAddEdit(true);
  };

  const handleCloseAddEdit = () => {
    setOpenAddEdit(false);
  };

  const handleChange = (e) => {
    setCurrentEmployee({ ...currentEmployee, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!currentEmployee.name || !currentEmployee.email || !currentEmployee.role) {
      setSnack({ open: true, severity: "error", msg: "Name, email, and role are required" });
      return;
    }
    if (!isEdit && !currentEmployee.password) {
      setSnack({ open: true, severity: "error", msg: "Password is required for new employees" });
      return;
    }
    try {
      if (isEdit) {
        await instance.put(`/api/v1/employee/${currentEmployee.id}`, currentEmployee);
        setSnack({ open: true, severity: "success", msg: "Employee updated" });
      } else {
        await instance.post("/api/v1/employee", currentEmployee);
        setSnack({ open: true, severity: "success", msg: "Employee added" });
      }
      fetchEmployees();
      handleCloseAddEdit();
    } catch (err) {
      console.error("Failed to save employee:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to save employee" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/api/v1/employee/${id}`);
      setSnack({ open: true, severity: "success", msg: "Employee deleted" });
      fetchEmployees();
    } catch (err) {
      console.error("Failed to delete employee:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to delete employee" });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90, sortable: true },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Role", width: 120 },
    { field: "salary", headerName: "Salary", width: 120, valueFormatter: (value) => formatCurrency(value) },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpenAddEdit(params.row)} color="primary" aria-label="edit employee">
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error" aria-label="delete employee">
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <DashboardLayout title="Employees" menu={ownerMenu}>
      <Grow in timeout={500}>
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f9fafb", borderRadius: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Employee Management
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              onClick={() => handleOpenAddEdit()} 
              color="primary" 
              aria-label="add employee"
            >
              Add Employee
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
                aria-label="search employee by ID"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button 
                variant="outlined" 
                startIcon={<Search />} 
                onClick={handleSearchById} 
                fullWidth 
                aria-label="search employee by ID"
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
                aria-label="search employee by email"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button 
                variant="outlined" 
                startIcon={<Search />} 
                onClick={handleSearchByEmail} 
                fullWidth 
                aria-label="search employee by email"
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
                rows={employees}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                loading={loading}
                disableRowSelectionOnClick
                disableColumnMenu
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: "#9c27b0",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    zIndex: 1,
                  },
                  "& .MuiDataGrid-row:hover": { bgcolor: "#f3e5f5" },
                  "& .MuiDataGrid-cell": { py: 1.5 },
                  borderRadius: 2,
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Grow>

      <Dialog open={openAddEdit} onClose={handleCloseAddEdit} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#9c27b0", color: "#fff" }}>
          {isEdit ? "Edit Employee" : "Add Employee"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            name="name"
            label="Name"
            value={currentEmployee.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            aria-label="employee name"
          />
          <TextField
            name="email"
            label="Email"
            value={currentEmployee.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            type="email"
            aria-label="employee email"
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            value={currentEmployee.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required={!isEdit}
            aria-label="employee password"
            helperText={isEdit ? "Leave blank to keep current password" : ""}
          />
          <TextField
            name="role"
            label="Role"
            value={currentEmployee.role}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            aria-label="employee role"
          />
          <TextField
            name="salary"
            label="Salary (Rs.)"
            type="number"
            value={currentEmployee.salary}
            onChange={handleChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0 }}
            aria-label="employee salary"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddEdit} color="secondary" aria-label="cancel">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary" aria-label="save employee">
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