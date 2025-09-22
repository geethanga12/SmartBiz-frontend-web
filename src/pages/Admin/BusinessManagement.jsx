// src/pages/Admin/BusinessManagement.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Avatar, IconButton, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem,
  FormControl, InputLabel, Snackbar, Alert
} from '@mui/material';
import { 
  Business, Person, Email, LocationOn, CalendarToday, Visibility, Assignment
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import DashboardLayout from '../../common/DashboardLayout';
import { adminMenu } from '../../common/navigation/adminRoutes';
import { adminService } from '../../service/adminService';
import { subscriptionService } from '../../service/subscriptionService';

export default function BusinessManagement() {
  const [businesses, setBusinesses] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [assignDialog, setAssignDialog] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [businessToAssign, setBusinessToAssign] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [businessData, plansData] = await Promise.all([
        adminService.getAllBusinesses(),
        subscriptionService.getAll()
      ]);
      setBusinesses(businessData);
      setSubscriptionPlans(plansData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnack({ open: true, message: 'Failed to load data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewBusiness = (business) => {
    setSelectedBusiness(business);
  };

  const handleAssignPlan = (business) => {
    setBusinessToAssign(business);
    setSelectedPlanId(business.subscriptionPlanId || '');
    setAssignDialog(true);
  };

  const handleConfirmAssign = async () => {
    if (!selectedPlanId || !businessToAssign) return;

    try {
      await subscriptionService.assignPlan(selectedPlanId, businessToAssign.businessId);
      setSnack({ open: true, message: 'Subscription plan assigned successfully!', severity: 'success' });
      setAssignDialog(false);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error assigning plan:', error);
      setSnack({ open: true, message: 'Failed to assign subscription plan', severity: 'error' });
    }
  };

  const columns = [
    { field: 'businessId', headerName: 'ID', width: 90 },
    { 
      field: 'businessName', 
      headerName: 'Business Name', 
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 1, bgcolor: 'primary.main', width: 32, height: 32 }}>
            <Business fontSize="small" />
          </Avatar>
          {params.value}
        </Box>
      )
    },
    { 
      field: 'ownerEmail', 
      headerName: 'Owner Email', 
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Email sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          {params.value}
        </Box>
      )
    },
    { 
      field: 'subscriptionPlanName', 
      headerName: 'Subscription', 
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value || 'No Plan'}
          color={params.value ? 'primary' : 'default'}
          size="small"
        />
      )
    },
    { field: 'address', headerName: 'Address', width: 200 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'ACTIVE' ? 'success' : 'warning'}
          size="small"
        />
      )
    },
    { 
      field: 'registerDate', 
      headerName: 'Registered', 
      width: 150,
      valueFormatter: (value) => new Date(value).toLocaleDateString('en-LK')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleViewBusiness(params.row)} title="View Details">
            <Visibility />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleAssignPlan(params.row)} title="Assign Plan">
            <Assignment />
          </IconButton>
        </>
      ),
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PENDING': return 'warning';
      case 'SUSPENDED': return 'error';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout title="Business Management" menu={adminMenu}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <Business sx={{ mr: 2, color: 'primary.main' }} />
          Business Management
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {businesses.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Businesses
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main">
                  {businesses.filter(b => b.status === 'ACTIVE').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Businesses
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="warning.main">
                  {businesses.filter(b => b.subscriptionPlanName).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  With Subscriptions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="info.main">
                  {businesses.filter(b => !b.subscriptionPlanName).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No Subscription
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Businesses Table */}
        <Paper sx={{ p: 2 }}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={businesses}
              columns={columns}
              getRowId={(row) => row.businessId}
              pageSizeOptions={[10, 25, 50]}
              loading={loading}
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: 'primary.main',
                  color: 'black',
                  fontWeight: 'bold',
                },
                '& .MuiDataGrid-row:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            />
          </Box>
        </Paper>

        {/* Business Details */}
        {selectedBusiness && (
          <Paper sx={{ mt: 3, p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Business Details: {selectedBusiness.businessName}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography><strong>Business ID:</strong> {selectedBusiness.businessId}</Typography>
                <Typography><strong>Name:</strong> {selectedBusiness.businessName}</Typography>
                <Typography><strong>Address:</strong> {selectedBusiness.address}</Typography>
                <Typography><strong>Status:</strong> 
                  <Chip 
                    label={selectedBusiness.status} 
                    color={getStatusColor(selectedBusiness.status)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography><strong>Owner ID:</strong> {selectedBusiness.ownerId}</Typography>
                <Typography><strong>Owner Email:</strong> {selectedBusiness.ownerEmail}</Typography>
                <Typography><strong>Registered:</strong> {new Date(selectedBusiness.registerDate).toLocaleDateString('en-LK')}</Typography>
                <Typography><strong>Subscription:</strong> 
                  <Chip 
                    label={selectedBusiness.subscriptionPlanName || 'No Plan'} 
                    color={selectedBusiness.subscriptionPlanName ? 'primary' : 'default'}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Grid>
            </Grid>
            <Button 
              variant="outlined" 
              onClick={() => setSelectedBusiness(null)}
              sx={{ mt: 2 }}
            >
              Close Details
            </Button>
          </Paper>
        )}

        {/* Assign Subscription Dialog */}
        <Dialog open={assignDialog} onClose={() => setAssignDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Assign Subscription Plan
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Business: <strong>{businessToAssign?.businessName}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Owner: {businessToAssign?.ownerEmail}
              </Typography>
              
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel>Select Subscription Plan</InputLabel>
                <Select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  label="Select Subscription Plan"
                >
                  <MenuItem value="">
                    <em>No Plan</em>
                  </MenuItem>
                  {subscriptionPlans
                    .filter(plan => plan.isActive)
                    .map((plan) => (
                    <MenuItem key={plan.planId} value={plan.planId}>
                      {plan.planName} - ${plan.monthlyPrice}/month
                      {plan.aiFeatures && ' (AI Features)'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Show plan details */}
              {selectedPlanId && (
                <Paper sx={{ mt: 2, p: 2, bgcolor: 'grey.50' }}>
                  {(() => {
                    const plan = subscriptionPlans.find(p => p.planId.toString() === selectedPlanId.toString());
                    return plan ? (
                      <Box>
                        <Typography variant="subtitle2">Plan Details:</Typography>
                        <Typography variant="body2">Price: ${plan.monthlyPrice}/month</Typography>
                        <Typography variant="body2">Max Users: {plan.maxUsers}</Typography>
                        <Typography variant="body2">Max Products: {plan.maxProducts}</Typography>
                        <Typography variant="body2">Max Orders: {plan.maxOrders}</Typography>
                        <Typography variant="body2">AI Features: {plan.aiFeatures ? 'Yes' : 'No'}</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>{plan.features}</Typography>
                      </Box>
                    ) : null;
                  })()}
                </Paper>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleConfirmAssign}
              disabled={!selectedPlanId}
            >
              Assign Plan
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snack.open}
          autoHideDuration={4000}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          <Alert severity={snack.severity} sx={{ width: '100%' }}>
            {snack.message}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}