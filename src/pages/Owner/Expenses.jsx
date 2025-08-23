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
  Grow,
  Paper
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Edit, Delete } from "@mui/icons-material";
import instance from "../../service/AxiosOrder";
import DashboardLayout from "../../common/DashboardLayout";
import { ownerMenu } from "../../common/navigation/ownerRoutes";

const formatCurrency = (value) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentExpense, setCurrentExpense] = useState({
    id: null,
    amount: 0,
    description: "",
    category: "",
  });
  const [snack, setSnack] = useState({ open: false, severity: "info", msg: "" });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/api/v1/expense");
      setExpenses(res.data || []);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to load expenses" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddEdit = (expense = { id: null, amount: 0, description: "", category: "" }) => {
    setCurrentExpense(expense);
    setIsEdit(!!expense.id);
    setOpenAddEdit(true);
  };

  const handleCloseAddEdit = () => {
    setOpenAddEdit(false);
  };

  const handleChange = (e) => {
    setCurrentExpense({ ...currentExpense, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!currentExpense.amount || !currentExpense.description || !currentExpense.category) {
      setSnack({ open: true, severity: "error", msg: "All fields are required" });
      return;
    }
    try {
      if (isEdit) {
        await instance.put(`/api/v1/expense/${currentExpense.id}`, currentExpense);
        setSnack({ open: true, severity: "success", msg: "Expense updated" });
      } else {
        await instance.post("/api/v1/expense", currentExpense);
        setSnack({ open: true, severity: "success", msg: "Expense added" });
      }
      fetchExpenses();
      handleCloseAddEdit();
    } catch (err) {
      console.error("Failed to save expense:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to save expense" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/api/v1/expense/${id}`);
      setSnack({ open: true, severity: "success", msg: "Expense deleted" });
      fetchExpenses();
    } catch (err) {
      console.error("Failed to delete expense:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to delete expense" });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90, sortable: true },
    { field: "date", headerName: "Date", width: 180, valueFormatter: (value) => new Date(value).toLocaleDateString('en-LK') },
    { field: "amount", headerName: "Amount", width: 150, valueFormatter: (value) => formatCurrency(value) },
    { field: "description", headerName: "Description", width: 200 },
    { field: "category", headerName: "Category", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpenAddEdit(params.row)} color="primary" aria-label="edit expense"><Edit /></IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error" aria-label="delete expense"><Delete /></IconButton>
        </>
      ),
    },
  ];

  return (
    <DashboardLayout title="Expenses" menu={ownerMenu}>
      <Grow in timeout={500}>
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f9fafb", borderRadius: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Expense Management
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenAddEdit()} color="primary" aria-label="add expense">
              Add Expense
            </Button>
          </Box>

          <Paper elevation={3} sx={{ p: 2, borderRadius: 2, bgcolor: "#fff" }}>
            <Box sx={{ height: { xs: 400, md: 600 }, width: "100%" }}>
              <DataGrid
                rows={expenses}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                loading={loading}
                disableRowSelectionOnClick
                disableColumnMenu
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: "#f44336",
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    zIndex: 1,
                  },
                  "& .MuiDataGrid-row:hover": { bgcolor: "#ffebee" },
                  "& .MuiDataGrid-cell": { py: 1.5 },
                  borderRadius: 2,
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Grow>

      <Dialog open={openAddEdit} onClose={handleCloseAddEdit} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#f44336", color: "#fff" }}>
          {isEdit ? "Edit Expense" : "Add Expense"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            name="amount"
            label="Amount (Rs.)"
            value={currentExpense.amount}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            required
            inputProps={{ min: 0 }}
            aria-label="expense amount"
          />
          <TextField
            name="description"
            label="Description"
            value={currentExpense.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            aria-label="expense description"
          />
          <TextField
            name="category"
            label="Category (e.g., Utility)"
            value={currentExpense.category}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            aria-label="expense category"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddEdit} color="secondary" aria-label="cancel">Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary" aria-label="save expense">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity} sx={{ width: "100%" }}>{snack.msg}</Alert>
      </Snackbar>
    </DashboardLayout>
  );
}