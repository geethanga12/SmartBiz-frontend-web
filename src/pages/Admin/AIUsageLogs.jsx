// src/pages/Admin/AIUsageLogs.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Grid, Chip, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, CircularProgress, Card, CardContent, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Search, FileDownload, Visibility, Psychology, Close } from '@mui/icons-material';
import DashboardLayout from '../../common/DashboardLayout';
import { adminMenu } from '../../common/navigation/adminRoutes';
import { adminService } from '../../service/adminService';

export default function AIUsageLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [stats, setStats] = useState({
    totalRequests: 0,
    todayRequests: 0,
    totalCost: 0,
    successRate: 0
  });

  useEffect(() => {
    fetchAILogs();
  }, []);

  useEffect(() => {
    // Filter logs based on search term
    const filtered = logs.filter(log => 
      log.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogs(filtered);
  }, [logs, searchTerm]);

  const fetchAILogs = async () => {
    setLoading(true);
    try {
      const logsData = await adminService.getAIUsageLogs(0, 1000);
      // Filter AI-related logs
      const aiLogs = logsData.filter(log => 
        log.action.includes('AI') || log.action.includes('GENERATE')
      );
      setLogs(aiLogs);
      
      // Calculate stats
      const today = new Date().toDateString();
      const todayRequests = aiLogs.filter(log => 
        new Date(log.timestamp).toDateString() === today
      ).length;
      
      // Mock cost calculation (you can get real data from AI usage stats)
      const totalCost = aiLogs.length * 0.001; // Rough estimate
      const successRate = 95; // Mock success rate
      
      setStats({
        totalRequests: aiLogs.length,
        todayRequests,
        totalCost,
        successRate
      });
    } catch (error) {
      console.error('Error fetching AI usage logs:', error);
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

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setDetailsDialog(true);
  };

  const exportAILogs = async () => {
    try {
      // Optionally, you can call adminService.exportUsageLogs if you need to fetch fresh data.
      // await adminService.exportUsageLogs(30, 'csv');
      
      // Filter for AI-related entries and create CSV
      const csvContent = "Timestamp,User,Business,Action,Details,IP Address\n" + 
        logs.map(log => 
          `${new Date(log.timestamp).toISOString()},${log.userEmail},${log.businessName || 'System'},${log.action},"${(log.details || '').replace(/"/g, '""')}",${log.ipAddress || ''}`
        ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ai_usage_logs.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting AI logs:', error);
    }
  };

  const getAIActionColor = (action) => {
    if (action.includes('AI_EMAIL')) return 'primary';
    if (action.includes('AI_INSIGHTS')) return 'secondary';
    if (action.includes('AI_MARKETING')) return 'success';
    if (action.includes('AI_INVOICE')) return 'warning';
    if (action.includes('AI_REQUEST')) return 'info';
    return 'default';
  };

  const paginatedLogs = filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <DashboardLayout title="AI Usage Logs" menu={adminMenu}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <Psychology sx={{ mr: 2, color: 'primary.main' }} />
          AI Usage Analytics
        </Typography>

        {/* AI Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography variant="h5" color="primary">
                  {stats.totalRequests.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total AI Requests
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography variant="h5" color="success.main">
                  {stats.todayRequests.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Today's Requests
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography variant="h5" color="warning.main">
                  ${stats.totalCost.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estimated Cost
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography variant="h5" color="info.main">
                  {stats.successRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Success Rate
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
                placeholder="Search AI logs by user, feature, business..."
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
                onClick={exportAILogs}
                fullWidth
              >
                Export AI Logs
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<Psychology />}
                onClick={fetchAILogs}
                fullWidth
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* AI Logs Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell><strong>Timestamp</strong></TableCell>
                  <TableCell><strong>User</strong></TableCell>
                  <TableCell><strong>Business</strong></TableCell>
                  <TableCell><strong>AI Feature</strong></TableCell>
                  <TableCell><strong>Details</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : paginatedLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      No AI usage logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLogs.map((log, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        {new Date(log.timestamp).toLocaleString('en-LK')}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {log.userEmail}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {log.businessName || 'System'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={log.action} 
                          color={getAIActionColor(log.action)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {log.details || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => handleViewDetails(log)}
                        >
                          View
                        </Button>
                      </TableCell>
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

        {/* Details Dialog */}
        <Dialog 
          open={detailsDialog} 
          onClose={() => setDetailsDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            AI Request Details
            <Button onClick={() => setDetailsDialog(false)}>
              <Close />
            </Button>
          </DialogTitle>
          <DialogContent>
            {selectedLog && (
              <Box sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">User:</Typography>
                    <Typography variant="body2" gutterBottom>{selectedLog.userEmail}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Business:</Typography>
                    <Typography variant="body2" gutterBottom>{selectedLog.businessName || 'System'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Timestamp:</Typography>
                    <Typography variant="body2" gutterBottom>
                      {new Date(selectedLog.timestamp).toLocaleString('en-LK')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">AI Feature:</Typography>
                    <Chip 
                      label={selectedLog.action} 
                      color={getAIActionColor(selectedLog.action)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Details:</Typography>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 1 }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {selectedLog.details || 'No additional details available'}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">IP Address:</Typography>
                    <Typography variant="body2">{selectedLog.ipAddress || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}