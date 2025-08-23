import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Autocomplete,
  InputLabel,
  IconButton,
  Grid,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grow,
} from "@mui/material";
import { Add, Remove, ShoppingCart } from "@mui/icons-material";
import instance from "../../service/AxiosOrder";
import DashboardLayout from "../../common/DashboardLayout";
import { ownerMenu } from "../../common/navigation/ownerRoutes";

const formatCurrency = (value) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);

export default function Sales() {
  const [form, setForm] = useState({
    customerId: null,
    employeeId: null,
    details: [{ itemId: null, quantity: 0, discount: 0 }],
  });
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: "info", msg: "" });
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "", address: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [custRes, empRes, itemRes] = await Promise.all([
        instance.get("/api/v1/customer"),
        instance.get("/api/v1/employee"),
        instance.get("/api/v1/item"),
      ]);
      setCustomers(custRes.data.map(c => ({ label: `${c.name} (${c.email})`, id: c.id })));
      setEmployees(empRes.data.map(e => ({ label: `${e.name} (${e.role})`, id: e.id })));
      setItems(itemRes.data.map(i => ({ label: `${i.name} (${formatCurrency(i.unitPrice)})`, id: i.id, unitPrice: i.unitPrice })));
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: "error", msg: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerChange = (event, newValue) => {
    setForm({ ...form, customerId: newValue ? newValue.id : null });
  };

  const handleEmployeeChange = (event, newValue) => {
    setForm({ ...form, employeeId: newValue ? newValue.id : null });
  };

  const handleDetailItemChange = (index, newValue) => {
    const details = [...form.details];
    details[index].itemId = newValue ? newValue.id : null;
    setForm({ ...form, details });
    calculateTotal();
  };

  const handleDetailChange = (index, e) => {
    const details = [...form.details];
    details[index][e.target.name] = parseFloat(e.target.value) || 0;
    setForm({ ...form, details });
    calculateTotal();
  };

  const addDetail = () => {
    setForm({ ...form, details: [...form.details, { itemId: null, quantity: 0, discount: 0 }] });
  };

  const removeDetail = (index) => {
    const details = form.details.filter((_, i) => i !== index);
    setForm({ ...form, details });
    calculateTotal();
  };

  const calculateTotal = () => {
    let sum = 0;
    form.details.forEach((d) => {
      const item = items.find((i) => i.id === d.itemId);
      if (item) sum += d.quantity * item.unitPrice - d.discount;
    });
    setTotal(sum);
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) {
      setSnack({ open: true, severity: "error", msg: "Name and email are required" });
      return;
    }
    setLoading(true);
    try {
      const res = await instance.post("/api/v1/customer", newCustomer);
      setCustomers([...customers, { label: `${res.data.name} (${res.data.email})`, id: res.data.id }]);
      setForm({ ...form, customerId: res.data.id });
      setOpenCustomerDialog(false);
      setNewCustomer({ name: "", email: "", phone: "", address: "" });
      setSnack({ open: true, severity: "success", msg: "Customer added" });
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: "error", msg: "Failed to add customer" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.customerId) {
      setSnack({ open: true, severity: "error", msg: "Select a customer" });
      return;
    }
    setLoading(true);
    try {
      await instance.post("/api/v1/order", { ...form, details: form.details.map(d => ({ ...d, quantity: Number(d.quantity), discount: Number(d.discount) })) });
      setSnack({ open: true, severity: "success", msg: "Sale created" });
      setForm({ customerId: null, employeeId: null, details: [{ itemId: null, quantity: 0, discount: 0 }] });
      setTotal(0);
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: "error", msg: "Failed to create sale" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Sales" menu={ownerMenu}>
      <Grow in timeout={500}>
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f9fafb", borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", display: "flex", alignItems: "center", color: "#1976d2" }}>
            <ShoppingCart sx={{ mr: 1 }} /> Create New Sale
          </Typography>
          <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, bgcolor: "#fff" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <InputLabel sx={{ mb: 1, fontWeight: "bold" }}>Customer *</InputLabel>
                <Autocomplete
                  options={customers}
                  getOptionLabel={(option) => option.label}
                  onChange={handleCustomerChange}
                  renderInput={(params) => <TextField {...params} placeholder="Search customer..." fullWidth />}
                  fullWidth
                  aria-label="select customer"
                />
                <Button
                  variant="text"
                  onClick={() => setOpenCustomerDialog(true)}
                  sx={{ mt: 1, color: "#1976d2" }}
                  aria-label="add new customer"
                >
                  Add New Customer
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel sx={{ mb: 1, fontWeight: "bold" }}>Employee (Optional)</InputLabel>
                <Autocomplete
                  options={employees}
                  getOptionLabel={(option) => option.label}
                  onChange={handleEmployeeChange}
                  renderInput={(params) => <TextField {...params} placeholder="Search employee..." fullWidth />}
                  fullWidth
                  aria-label="select employee"
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: "bold" }}>Items</Typography>
            {form.details.map((d, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 2, mt: 2, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      options={items}
                      getOptionLabel={(option) => option.label}
                      onChange={(e, newValue) => handleDetailItemChange(index, newValue)}
                      renderInput={(params) => <TextField {...params} label="Item" fullWidth />}
                      fullWidth
                      aria-label={`select item ${index + 1}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="quantity"
                      label="Quantity"
                      value={d.quantity}
                      onChange={(e) => handleDetailChange(index, e)}
                      type="number"
                      fullWidth
                      required
                      inputProps={{ min: 0 }}
                      aria-label={`quantity for item ${index + 1}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="discount"
                      label="Discount (Rs.)"
                      value={d.discount}
                      onChange={(e) => handleDetailChange(index, e)}
                      type="number"
                      fullWidth
                      inputProps={{ min: 0 }}
                      aria-label={`discount for item ${index + 1}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <IconButton onClick={() => removeDetail(index)} color="error" aria-label={`remove item ${index + 1}`}>
                      <Remove />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            <Button onClick={addDetail} startIcon={<Add />} sx={{ mt: 2 }} variant="outlined" aria-label="add item">
              Add Item
            </Button>

            <Box sx={{ mt: 3, p: 2, bgcolor: "#e3f2fd", borderRadius: 2, textAlign: "right" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Total: {formatCurrency(total)}</Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || total === 0 || !form.customerId}
              fullWidth
              sx={{ mt: 3, py: 1.5 }}
              aria-label="submit sale"
            >
              {loading ? "Submitting..." : "Submit Sale"}
            </Button>
          </Paper>
        </Box>
      </Grow>

      <Dialog open={openCustomerDialog} onClose={() => setOpenCustomerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value })}
            fullWidth
            margin="normal"
            required
            aria-label="customer name"
          />
          <TextField
            name="email"
            label="Email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value })}
            fullWidth
            margin="normal"
            required
            type="email"
            aria-label="customer email"
          />
          <TextField
            name="phone"
            label="Phone"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value })}
            fullWidth
            margin="normal"
            aria-label="customer phone"
          />
          <TextField
            name="address"
            label="Address"
            value={newCustomer.address}
            onChange={(e) => setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value })}
            fullWidth
            margin="normal"
            aria-label="customer address"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCustomerDialog(false)} aria-label="cancel">Cancel</Button>
          <Button onClick={handleAddCustomer} variant="contained" disabled={loading} aria-label="save customer">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity} sx={{ width: "100%" }}>{snack.msg}</Alert>
      </Snackbar>
    </DashboardLayout>
  );
}