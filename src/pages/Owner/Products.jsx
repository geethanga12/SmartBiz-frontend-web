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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
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

  return (
    <DashboardLayout title="Products" menu={ownerMenu}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Product Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenAddEdit()}>
            Add Product
          </Button>
        </Box>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Supplier ID</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.unitPrice}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.supplierId || "None"}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenAddEdit(item)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={openAddEdit} onClose={handleCloseAddEdit}>
        <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={currentItem.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="description"
            label="Description"
            value={currentItem.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="unitPrice"
            label="Unit Price"
            type="number"
            value={currentItem.unitPrice}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="quantity"
            label="Quantity"
            type="number"
            value={currentItem.quantity}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Select
            name="supplierId"
            value={currentItem.supplierId || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            displayEmpty
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {suppliers.map((s) => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddEdit}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}