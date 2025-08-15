// src/pages/Owner/Products.jsx
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
  Select,
  MenuItem,
  IconButton,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid"; // Updated: Imported DataGrid
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import instance from "../../service/AxiosOrder";
import DashboardLayout from "../../common/DashboardLayout";
import { ownerMenu } from "../../common/navigation/ownerRoutes";

export default function Products() {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    id: null,
    supplierId: null,
    name: "",
    description: "",
    unitPrice: 0,
    quantity: 0,
  });
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    fetchSuppliers();
    fetchItems();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await instance.get("/api/v1/supplier");
      setSuppliers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/api/v1/item");
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = async () => {
    if (!searchId) return;
    try {
      const res = await instance.get(`/api/v1/item/${searchId}`);
      setItems([res.data]); // Updated: Set to search result
    } catch (err) {
      console.error("Failed to fetch item by ID:", err);
      setItems([]);
    }
  };

  const handleSearchByName = async () => {
    if (!searchName) return;
    try {
      const res = await instance.get(`/api/v1/item/get_by_name/${searchName}`);
      setItems([res.data]); // Updated: Set to search result
    } catch (err) {
      console.error("Failed to fetch item by name:", err);
      setItems([]);
    }
  };

  const clearSearch = () => {
    setSearchId("");
    setSearchName("");
    fetchItems(); // Updated: Refresh all items
  };

  const handleOpenAddEdit = (item = { id: null, supplierId: null, name: "", description: "", unitPrice: 0, quantity: 0 }) => {
    setCurrentItem(item);
    setIsEdit(!!item.id);
    setOpenAddEdit(true);
  };

  const handleCloseAddEdit = () => {
    setOpenAddEdit(false);
  };

  const handleChange = (e) => {
    setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (isEdit) {
        await instance.put(`/api/v1/item/${currentItem.id}`, currentItem);
      } else {
        await instance.post("/api/v1/item", currentItem);
      }
      fetchItems();
      handleCloseAddEdit();
    } catch (err) {
      console.error("Failed to save item:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/api/v1/item/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "unitPrice", headerName: "Unit Price", width: 120 },
    { field: "quantity", headerName: "Quantity", width: 120 },
    { field: "supplierId", headerName: "Supplier ID", width: 120 },
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
    <DashboardLayout title="Products" menu={ownerMenu}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Product Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenAddEdit()}>
            Add Product
          </Button>
        </Box>

        {/* Improved Search UI */}
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
              label="Search by Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button variant="outlined" startIcon={<Search />} onClick={handleSearchByName} fullWidth>
              Search Name
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
            rows={items}
            columns={columns}
            pageSizeOptions={[5, 10]}
            loading={loading}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={openAddEdit} onClose={handleCloseAddEdit}>
        <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <TextField name="name" label="Name" value={currentItem.name} onChange={handleChange} fullWidth margin="normal" required />
          <TextField name="description" label="Description" value={currentItem.description} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="unitPrice" label="Unit Price" type="number" value={currentItem.unitPrice} onChange={handleChange} fullWidth margin="normal" required />
          <TextField name="quantity" label="Quantity" type="number" value={currentItem.quantity} onChange={handleChange} fullWidth margin="normal" required />
          <Select name="supplierId" value={currentItem.supplierId || ""} onChange={handleChange} fullWidth margin="normal" displayEmpty>
            <MenuItem value=""><em>None</em></MenuItem>
            {suppliers.map((s) => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddEdit}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}