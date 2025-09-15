// File: src/pages/Owner/Reports.jsx (NEW)
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  ExpandMore,
  Assessment,
  GetApp,
  TrendingUp,
  Inventory,
  People,
  AttachMoney,
  CalendarToday
} from '@mui/icons-material';
import DashboardLayout from '../../common/DashboardLayout';
import { ownerMenu } from '../../common/navigation/ownerRoutes';
import { reportsService } from '../../service/reportsService';

const formatCurrency = (value) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reports, setReports] = useState({
    sales: null,
    inventory: null,
    profitLoss: null,
    customerAnalysis: null
  });

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const generateSalesReport = async () => {
    setLoading(true);
    try {
      const report = await reportsService.generateSalesReport(
        dateRange.startDate,
        dateRange.endDate,
        true
      );
      setReports(prev => ({ ...prev, sales: report }));
    } catch (error) {
      console.error('Error generating sales report:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInventoryReport = async () => {
    setLoading(true);
    try {
      const report = await reportsService.generateInventoryReport(true);
      setReports(prev => ({ ...prev, inventory: report }));
    } catch (error) {
      console.error('Error generating inventory report:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateProfitLossReport = async () => {
    setLoading(true);
    try {
      const report = await reportsService.generateProfitLossReport(
        dateRange.startDate,
        dateRange.endDate
      );
      setReports(prev => ({ ...prev, profitLoss: report }));
    } catch (error) {
      console.error('Error generating profit/loss report:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCustomerAnalysisReport = async () => {
    setLoading(true);
    try {
      const report = await reportsService.generateCustomerAnalysisReport(
        dateRange.startDate,
        dateRange.endDate
      );
      setReports(prev => ({ ...prev, customerAnalysis: report }));
    } catch (error) {
      console.error('Error generating customer analysis report:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDFReport = async (reportType) => {
    setLoading(true);
    try {
      await reportsService.downloadPDFReport(
        reportType,
        dateRange.startDate,
        dateRange.endDate
      );
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Reports" menu={ownerMenu}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <Assessment sx={{ mr: 2, color: 'primary.main' }} />
          Business Reports & Analytics
        </Typography>

        {/* Date Range Selector */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday sx={{ mr: 1 }} />
              Date Range
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="End Date"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Selected: {Math.ceil((new Date(dateRange.endDate) - new Date(dateRange.startDate)) / (1000 * 60 * 60 * 24))} days
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Report Generation Buttons */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<TrendingUp />}
              onClick={generateSalesReport}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              Sales Report
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={<Inventory />}
              onClick={generateInventoryReport}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              Inventory Report
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              color="warning"
              startIcon={<AttachMoney />}
              onClick={generateProfitLossReport}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              Profit & Loss
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              color="info"
              startIcon={<People />}
              onClick={generateCustomerAnalysisReport}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              Customer Analysis
            </Button>
          </Grid>
        </Grid>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Sales Report */}
        {reports.sales && (
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 1 }} />
                Sales Report - {formatCurrency(reports.sales.totalSales)}
                <Button
                  size="small"
                  startIcon={<GetApp />}
                  onClick={() => downloadPDFReport('sales')}
                  sx={{ ml: 2 }}
                >
                  PDF
                </Button>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Summary</Typography>
                    <Typography>Total Sales: {formatCurrency(reports.sales.totalSales)}</Typography>
                    <Typography>Total Orders: {reports.sales.totalOrders}</Typography>
                    <Typography>Avg Order Value: {formatCurrency(reports.sales.averageOrderValue)}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  {reports.sales.topSellingItems && (
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>Top Items</Typography>
                      {reports.sales.topSellingItems.slice(0, 5).map((item, index) => (
                        <Chip
                          key={index}
                          label={`${item.name} (${item.quantitySold})`}
                          size="small"
                          sx={{ m: 0.5 }}
                        />
                      ))}
                    </Paper>
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Inventory Report */}
        {reports.inventory && (
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <Inventory sx={{ mr: 1 }} />
                Inventory Report - {formatCurrency(reports.inventory.totalInventoryValue)}
                <Button
                  size="small"
                  startIcon={<GetApp />}
                  onClick={() => downloadPDFReport('inventory')}
                  sx={{ ml: 2 }}
                >
                  PDF
                </Button>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Summary</Typography>
                    <Typography>Total Items: {reports.inventory.totalItems}</Typography>
                    <Typography>Total Value: {formatCurrency(reports.inventory.totalInventoryValue)}</Typography>
                    <Typography color="error">Low Stock Items: {reports.inventory.lowStockCount}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                  {reports.inventory.lowStockItems && reports.inventory.lowStockItems.length > 0 && (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Unit Price</TableCell>
                            <TableCell>Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reports.inventory.lowStockItems.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={item.quantity} 
                                  color="error" 
                                  size="small" 
                                />
                              </TableCell>
                              <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                              <TableCell>{formatCurrency(item.value)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Profit & Loss Report */}
        {reports.profitLoss && (
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ mr: 1 }} />
                Profit & Loss - {formatCurrency(reports.profitLoss.netProfit)}
                <Button
                  size="small"
                  startIcon={<GetApp />}
                  onClick={() => downloadPDFReport('profit-loss')}
                  sx={{ ml: 2 }}
                >
                  PDF
                </Button>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Financial Summary</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography>Revenue: {formatCurrency(reports.profitLoss.totalRevenue)}</Typography>
                        <Typography>COGS: {formatCurrency(reports.profitLoss.totalCOGS)}</Typography>
                        <Typography>Gross Profit: {formatCurrency(reports.profitLoss.grossProfit)}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>Expenses: {formatCurrency(reports.profitLoss.totalExpenses)}</Typography>
                        <Typography variant="h6" color={reports.profitLoss.netProfit >= 0 ? 'success.main' : 'error.main'}>
                          Net Profit: {formatCurrency(reports.profitLoss.netProfit)}
                        </Typography>
                        <Typography>Net Margin: {reports.profitLoss.netMargin.toFixed(2)}%</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Customer Analysis Report */}
        {reports.customerAnalysis && (
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ mr: 1 }} />
                Customer Analysis - {reports.customerAnalysis.totalCustomers} customers
                <Button
                  size="small"
                  startIcon={<GetApp />}
                  onClick={() => downloadPDFReport('customer-analysis')}
                  sx={{ ml: 2 }}
                >
                  PDF
                </Button>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Customer Metrics</Typography>
                    <Typography>Total Customers: {reports.customerAnalysis.totalCustomers}</Typography>
                    <Typography>Active Customers: {reports.customerAnalysis.activeCustomers}</Typography>
                    <Typography>Avg Spending: {formatCurrency(reports.customerAnalysis.averageCustomerSpending)}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                  {reports.customerAnalysis.topCustomers && (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Customer</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Total Spent</TableCell>
                            <TableCell>Orders</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reports.customerAnalysis.topCustomers.map((customer, index) => (
                            <TableRow key={index}>
                              <TableCell>{customer.name}</TableCell>
                              <TableCell>{customer.email}</TableCell>
                              <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={customer.orderCount} 
                                  color="primary" 
                                  size="small" 
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    </DashboardLayout>
  );
}