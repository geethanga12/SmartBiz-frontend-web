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

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: "",
    description: "",
    unitPrice: 0,
    costPrice: 0,
    quantity: 0,
  });
  const [searchId, setSearchId] = useState("");
  const [snack, setSnack] = useState({ open: false, severity: "info", msg: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/api/v1/item");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to load products" });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = async () => {
    if (!searchId) {
      fetchProducts();
      return;
    }
    try {
      const res = await instance.get(`/api/v1/item/${searchId}`);
      setProducts([res.data]);
    } catch (err) {
      console.error("Failed to fetch product by ID:", err);
      setProducts([]);
      setSnack({ open: true, severity: "error", msg: "Product not found" });
    }
  };

  const handleOpenAddEdit = (product = { id: null, name: "", description: "", unitPrice: 0, costPrice: 0, quantity: 0 }) => {
    setCurrentProduct(product);
    setIsEdit(!!product.id);
    setOpenAddEdit(true);
  };

  const handleCloseAddEdit = () => {
    setOpenAddEdit(false);
  };

  const handleChange = (e) => {
    setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!currentProduct.name || !currentProduct.unitPrice || !currentProduct.quantity) {
      setSnack({ open: true, severity: "error", msg: "Name, unit price, and quantity are required" });
      return;
    }
    try {
      if (isEdit) {
        await instance.put(`/api/v1/item/${currentProduct.id}`, currentProduct);
        setSnack({ open: true, severity: "success", msg: "Product updated" });
      } else {
        await instance.post("/api/v1/item", currentProduct);
        setSnack({ open: true, severity: "success", msg: "Product added" });
      }
      fetchProducts();
      handleCloseAddEdit();
    } catch (err) {
      console.error("Failed to save product:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to save product" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/api/v1/item/${id}`);
      setSnack({ open: true, severity: "success", msg: "Product deleted" });
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
      setSnack({ open: true, severity: "error", msg: "Failed to delete product" });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90, sortable: true },
    { field: "name", headerName: "Name", width: 150 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "unitPrice", headerName: "Unit Price", width: 120, valueFormatter: (value) => formatCurrency(value) },
    { field: "costPrice", headerName: "Cost Price", width: 120, valueFormatter: (value) => formatCurrency(value) },
    { field: "quantity", headerName: "Quantity", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpenAddEdit(params.row)} color="primary" aria-label="edit product"><Edit /></IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error" aria-label="delete product"><Delete /></IconButton>
        </>
      ),
    },
  ];

  return (
    <DashboardLayout title="Products" menu={ownerMenu}>
      <Grow in timeout={500}>
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f9fafb", borderRadius: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
              Product Management
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenAddEdit()} color="primary" aria-label="add product">
              Add Product
            </Button>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Search by ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                fullWidth
                type="number"
                aria-label="search product by ID"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button variant="outlined" startIcon={<Search />} onClick={handleSearchById} fullWidth aria-label="search product">
                Search
              </Button>
            </Grid>
          </Grid>

          <Paper elevation={3} sx={{ p: 2, borderRadius: 2, bgcolor: "#fff" }}>
            <Box sx={{ height: { xs: 400, md: 600 }, width: "100%" }}>
              <DataGrid
                rows={products}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                loading={loading}
                disableRowSelectionOnClick
                disableColumnMenu
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: "#4caf50",
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    zIndex: 1,
                  },
                  "& .MuiDataGrid-row:hover": { bgcolor: "#e8f5e9" },
                  "& .MuiDataGrid-cell": { py: 1.5 },
                  borderRadius: 2,
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Grow>

      <Dialog open={openAddEdit} onClose={handleCloseAddEdit} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#4caf50", color: "#fff" }}>
          {isEdit ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            name="name"
            label="Name"
            value={currentProduct.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            aria-label="product name"
          />
          <TextField
            name="description"
            label="Description"
            value={currentProduct.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            aria-label="product description"
          />
          <TextField
            name="unitPrice"
            label="Unit Price (Rs.)"
            value={currentProduct.unitPrice}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            required
            inputProps={{ min: 0 }}
            aria-label="unit price"
          />
          <TextField
            name="costPrice"
            label="Cost Price (Rs.)"
            value={currentProduct.costPrice}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ min: 0 }}
            aria-label="cost price"
          />
          <TextField
            name="quantity"
            label="Quantity"
            value={currentProduct.quantity}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            required
            inputProps={{ min: 0 }}
            aria-label="product quantity"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddEdit} color="secondary" aria-label="cancel">Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary" aria-label="save product">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity} sx={{ width: "100%" }}>{snack.msg}</Alert>
      </Snackbar>
    </DashboardLayout>
  );
}