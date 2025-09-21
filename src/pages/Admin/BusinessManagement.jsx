// File: src/pages/Admin/BusinessManagement.jsx (NEW)
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Button
} from '@mui/material';
import { 
  Business,
  Person,
  Email,
  LocationOn,
  CalendarToday,
  Visibility
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import DashboardLayout from '../../common/DashboardLayout';
import { adminMenu } from '../../common/navigation/adminRoutes';
import { adminService } from '../../service/adminService';

export default function BusinessManagement() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllBusinesses();
      setBusinesses(data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBusiness = (business) => {
    setSelectedBusiness(business);
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
    { field: 'address', headerName: 'Address', width: 250 },
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
      width: 180,
      valueFormatter: (value) => new Date(value).toLocaleDateString('en-LK')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleViewBusiness(params.row)}
        >
          <Visibility />
        </IconButton>
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
                  {businesses.filter(b => b.status === 'PENDING').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Approval
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="info.main">
                  {new Date().toLocaleDateString('en-LK')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Today's Date
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
      </Box>
    </DashboardLayout>
  );
}