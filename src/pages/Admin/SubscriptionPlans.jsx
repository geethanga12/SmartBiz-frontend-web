import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import DashboardLayout from "../../common/DashboardLayout";
import { adminMenu } from "../../common/navigation/adminRoutes";
import { subscriptionService } from "../../service/subscriptionService";

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    planId: null,
    planName: "",
    monthlyPrice: 0,
    features: "",
    duration: "",
    isActive: true,
    maxUsers: 10,
    maxProducts: 1000,
    maxOrders: 10000,
    aiFeatures: false,
  });
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await subscriptionService.getAll();
      setPlans(data || []);
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Failed to fetch plans", severity: "error" });
    }
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setForm({
      planId: null,
      planName: "",
      monthlyPrice: 0,
      features: "",
      duration: "",
      isActive: true,
      maxUsers: 10,
      maxProducts: 1000,
      maxOrders: 10000,
      aiFeatures: false,
    });
    setOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditMode(true);
    setForm(plan);
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await subscriptionService.update(form.planId, form);
        setSnack({ open: true, message: "Plan updated successfully", severity: "success" });
      } else {
        await subscriptionService.create(form);
        setSnack({ open: true, message: "Plan created successfully", severity: "success" });
      }
      setOpen(false);
      fetchPlans();
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Failed to save plan", severity: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await subscriptionService.delete(id);
      setSnack({ open: true, message: "Plan deleted", severity: "success" });
      fetchPlans();
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Failed to delete plan", severity: "error" });
    }
  };

  return (
    <DashboardLayout title="Subscription Plans" menu={adminMenu}>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h5">Manage Subscription / Pricing Plans</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ mt: 2 }}
            onClick={handleOpenAdd}
          >
            Add Plan
          </Button>
        </Paper>

        <Paper sx={{ p: 2 }}>
          {plans.length === 0 ? (
            <Typography>No plans available.</Typography>
          ) : (
            <List>
              {plans.map((p) => (
                <ListItem key={p.planId} divider>
                  <ListItemText
                    primary={`${p.planName} — $${p.monthlyPrice} — ${p.duration}`}
                    secondary={`Users: ${p.maxUsers}, Products: ${p.maxProducts}, Orders: ${p.maxOrders}, AI: ${p.aiFeatures ? "Yes" : "No"} — ${p.features}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleOpenEdit(p)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(p.planId)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editMode ? "Edit Plan" : "Add Plan"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Plan Name"
                  fullWidth
                  value={form.planName}
                  onChange={(e) => setForm({ ...form, planName: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Monthly Price"
                  type="number"
                  fullWidth
                  value={form.monthlyPrice}
                  onChange={(e) => setForm({ ...form, monthlyPrice: parseFloat(e.target.value) })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Duration"
                  fullWidth
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Features"
                  fullWidth
                  multiline
                  rows={3}
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Max Users"
                  type="number"
                  fullWidth
                  value={form.maxUsers}
                  onChange={(e) => setForm({ ...form, maxUsers: parseInt(e.target.value) })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Max Products"
                  type="number"
                  fullWidth
                  value={form.maxProducts}
                  onChange={(e) => setForm({ ...form, maxProducts: parseInt(e.target.value) })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Max Orders"
                  type="number"
                  fullWidth
                  value={form.maxOrders}
                  onChange={(e) => setForm({ ...form, maxOrders: parseInt(e.target.value) })}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.aiFeatures}
                      onChange={(e) => setForm({ ...form, aiFeatures: e.target.checked })}
                    />
                  }
                  label="AI Features"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          <Alert severity={snack.severity}>{snack.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
