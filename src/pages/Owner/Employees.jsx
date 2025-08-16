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
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import instance from "../../service/AxiosOrder";
import DashboardLayout from "../../common/DashboardLayout";
import { ownerMenu } from "../../common/navigation/ownerRoutes";

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
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = async () => {
    if (!searchId) return;
    try {
      const res = await instance.get(`/api/v1/employee/${searchId}`);
      setEmployees([res.data]);
    } catch (err) {
      console.error("Failed to fetch employee by ID:", err);
      setEmployees([]);
    }
  };

  const handleSearchByEmail = async () => {
    if (!searchEmail) return;
    try {
      const res = await instance.get(`/api/v1/employee/get_by_email/${searchEmail}`);
      setEmployees([res.data]);
    } catch (err) {
      console.error("Failed to fetch employee by email:", err);
      setEmployees([]);
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
    try {
      if (isEdit) {
        await instance.put(`/api/v1/employee/${currentEmployee.id}`, currentEmployee);
      } else {
        await instance.post("/api/v1/employee", currentEmployee);
      }
      fetchEmployees();
      handleCloseAddEdit();
    } catch (err) {
      console.error("Failed to save employee:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/api/v1/employee/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error("Failed to delete employee:", err);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Role", width: 120 },
    { field: "salary", headerName: "Salary", width: 120 },
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
    <DashboardLayout title="Employees" menu={ownerMenu}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Employee Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenAddEdit()}>
            Add Employee
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
            rows={employees}
            columns={columns}
            pageSizeOptions={[5, 10]}
            loading={loading}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>

      <Dialog open={openAddEdit} onClose={handleCloseAddEdit}>
        <DialogTitle>{isEdit ? "Edit Employee" : "Add Employee"}</DialogTitle>
        <DialogContent>
          <TextField name="name" label="Name" value={currentEmployee.name} onChange={handleChange} fullWidth margin="normal" required />
          <TextField name="email" label="Email" value={currentEmployee.email} onChange={handleChange} fullWidth margin="normal" required />
          <TextField name="password" label="Password" type="password" value={currentEmployee.password} onChange={handleChange} fullWidth margin="normal" required={!isEdit} />
          <TextField name="role" label="Role" value={currentEmployee.role} onChange={handleChange} fullWidth margin="normal" required />
          <TextField name="salary" label="Salary" type="number" value={currentEmployee.salary} onChange={handleChange} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddEdit}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}