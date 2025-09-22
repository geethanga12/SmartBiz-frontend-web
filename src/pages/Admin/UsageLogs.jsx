// src/pages/Admin/UsageLogs.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Grid, Chip, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, CircularProgress, Card, CardContent
} from '@mui/material';
import { Search, FileDownload, Visibility, FilterList } from '@mui/icons-material';
import DashboardLayout from '../../common/DashboardLayout';
import { adminMenu } from '../../common/navigation/adminRoutes';
import { adminService } from '../../service/adminService';

export default function UsageLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [stats, setStats] = useState({
    totalLogs: 0,
    todayLogs: 0,
    activeUsers: 0
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    // Filter logs based on search term
    const filtered = logs.filter(log => 
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogs(filtered);
  }, [logs, searchTerm]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const logsData = await adminService.getUsageLogs(0, 1000); // Get more logs
      setLogs(logsData);
      
      // Calculate stats
      const today = new Date().toDateString();
      const todayLogs = logsData.filter(log => 
        new Date(log.timestamp).toDateString() === today
      ).length;
      
      const uniqueUsers = new Set(logsData.map(log => log.userEmail)).size;
      
      setStats({
        totalLogs: logsData.length,
        todayLogs,
        activeUsers: uniqueUsers
      });
    } catch (error) {
      console.error('Error fetching usage logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportLogs = async () => {
    try {
      const exportData = await adminService.exportUsageLogs(30, 'csv');
      
      // Create and download file
      const blob = new Blob([exportData.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = exportData.filename || 'usage_logs.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  const getActionColor = (action) => {
    if (action.includes('LOGIN')) return 'success';
    if (action.includes('LOGOUT')) return 'default';
    if (action.includes('CREATE')) return 'primary';
    if (action.includes('DELETE')) return 'error';
    if (action.includes('UPDATE')) return 'warning';
    if (action.includes('AI')) return 'secondary';
    return 'default';
  };

  const paginatedLogs = filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <DashboardLayout title="Usage Logs" menu={adminMenu}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <Visibility sx={{ mr: 2, color: 'primary.main' }} />
          System Usage Logs
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" color="primary">
                  {stats.totalLogs.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Log Entries
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" color="success.main">
                  {stats.todayLogs.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Today's Activities
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" color="info.main">
                  {stats.activeUsers.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Controls */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search logs by user, action, business, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<FileDownload />}
                onClick={exportLogs}
                fullWidth
              >
                Export CSV
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={fetchLogs}
                fullWidth
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Logs Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell><strong>Timestamp</strong></TableCell>
                  <TableCell><strong>User</strong></TableCell>
                  <TableCell><strong>Business</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                  <TableCell><strong>Details</strong></TableCell>
                  <TableCell><strong>IP Address</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLogs.map((log, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{log.userEmail}</TableCell>
                      <TableCell>{log.businessName || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={log.action}
                          color={getActionColor(log.action)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{log.details || '-'}</TableCell>
                      <TableCell>{log.ipAddress || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredLogs.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </Paper>
      </Box>
    </DashboardLayout>
  );
}