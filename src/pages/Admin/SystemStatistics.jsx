// src/pages/Admin/SystemStatistics.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { 
  TrendingUp, Assessment, Psychology, Business, People, AttachMoney,
  Refresh, DateRange
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
         PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import DashboardLayout from '../../common/DashboardLayout';
import { adminMenu } from '../../common/navigation/adminRoutes';
import { adminService } from '../../service/adminService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function SystemStatistics() {
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState(null);
  const [aiStats, setAiStats] = useState(null);
  const [businessActivity, setBusinessActivity] = useState([]);
  const [userEngagement, setUserEngagement] = useState(null);
  const [subscriptionAnalytics, setSubscriptionAnalytics] = useState(null);
  const [revenueMetrics, setRevenueMetrics] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [timeRange, setTimeRange] = useState(30);

  const fetchAllStatistics = React.useCallback(async () => {
    setLoading(true);
    try {
      const [
        systemData,
        aiData,
        businessData,
        engagementData,
        subscriptionData,
        revenueData,
        healthData
      ] = await Promise.all([
        adminService.getSystemWideStatistics(timeRange),
        adminService.getAIUsageStatistics(timeRange),
        adminService.getBusinessActivity(timeRange),
        adminService.getUserEngagementMetrics(timeRange),
        adminService.getSubscriptionAnalytics(),
        adminService.getRevenueMetrics(timeRange),
        adminService.getSystemHealth()
      ]);

      setSystemStats(systemData);
      setAiStats(aiData);
      setBusinessActivity(businessData);
      setUserEngagement(engagementData);
      setSubscriptionAnalytics(subscriptionData);
      setRevenueMetrics(revenueData);
      setSystemHealth(healthData);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAllStatistics();
  }, [timeRange, fetchAllStatistics]);

  if (loading) {
    return (
      <DashboardLayout title="System Statistics" menu={adminMenu}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2 }}>Loading system statistics...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  // Prepare chart data
  const subscriptionChartData = subscriptionAnalytics?.planDistribution 
    ? Object.entries(subscriptionAnalytics.planDistribution).map(([name, value]) => ({ name, value }))
    : [];

  const aiUsageChartData = aiStats?.usageByType 
    ? Object.entries(aiStats.usageByType).map(([name, value]) => ({ name, value }))
    : [];

  const businessActivityChartData = businessActivity?.slice(0, 10).map(business => ({
    name: business.businessName?.substring(0, 15) + (business.businessName?.length > 15 ? '...' : ''),
    orders: business.recentOrders || 0,
    aiRequests: business.aiRequests || 0,
    actions: business.totalActions || 0
  })) || [];

  return (
    <DashboardLayout title="System Statistics" menu={adminMenu}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
            <Assessment sx={{ mr: 2, color: 'primary.main' }} />
            System-Wide Statistics
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value={7}>Last 7 days</MenuItem>
                <MenuItem value={30}>Last 30 days</MenuItem>
                <MenuItem value={90}>Last 90 days</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchAllStatistics}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* System Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {systemStats?.totalBusinesses || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Businesses
                </Typography>
                <Typography variant="caption" color="success.main">
                  {systemStats?.activeBusinesses || 0} active
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="secondary">
                  {systemStats?.totalUsers || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
                <Typography variant="caption" color="info.main">
                  {userEngagement?.activeUsers || 0} active
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="success.main">
                  ${(systemStats?.totalRevenue || 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Revenue
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {timeRange} days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="warning.main">
                  {systemStats?.totalAIRequests || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  AI Requests
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ${(systemStats?.totalAICosts || 0).toFixed(2)} cost
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Subscription Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Subscription Plan Distribution
              </Typography>
              {subscriptionChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={subscriptionChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {subscriptionChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  No subscription data available
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* AI Usage by Type */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                AI Feature Usage
              </Typography>
              {aiUsageChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={aiUsageChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  No AI usage data available
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Business Activity Chart */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Top Business Activity (Last {timeRange} days)
              </Typography>
              {businessActivityChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={businessActivityChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                    <Bar dataKey="aiRequests" fill="#82ca9d" name="AI Requests" />
                    <Bar dataKey="actions" fill="#ffc658" name="Total Actions" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  No business activity data available
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Detailed Tables */}
        <Grid container spacing={3}>
          {/* System Health */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Business sx={{ mr: 1 }} />
                System Health
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>
                        <Chip 
                          label={systemHealth?.status || 'Unknown'} 
                          color={systemHealth?.status === 'HEALTHY' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Database Connected</TableCell>
                      <TableCell>
                        <Chip 
                          label={systemHealth?.databaseConnected ? 'Yes' : 'No'} 
                          color={systemHealth?.databaseConnected ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Recent Activity</TableCell>
                      <TableCell>{systemHealth?.recentActivity || 0} actions</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Memory Used</TableCell>
                      <TableCell>
                        {systemHealth?.memoryUsed 
                          ? `${(systemHealth.memoryUsed / 1024 / 1024).toFixed(0)} MB`
                          : 'N/A'
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Last Check</TableCell>
                      <TableCell>
                        {systemHealth?.lastCheck 
                          ? new Date(systemHealth.lastCheck).toLocaleString('en-LK')
                          : 'N/A'
                        }
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Revenue Metrics */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ mr: 1 }} />
                Revenue Metrics
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Revenue</TableCell>
                      <TableCell>${(revenueMetrics?.totalRevenue || 0).toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Subscription Revenue</TableCell>
                      <TableCell>${(revenueMetrics?.monthlySubscriptionRevenue || 0).toLocaleString()}/mo</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Average Order Value</TableCell>
                      <TableCell>${(revenueMetrics?.averageOrderValue || 0).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Top Business Revenue</TableCell>
                      <TableCell>
                        {revenueMetrics?.topBusinesses?.[0] ? 
                          `${revenueMetrics.topBusinesses[0].businessName}: ${revenueMetrics.topBusinesses[0].revenue.toFixed(2)}`
                          : 'N/A'
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Period</TableCell>
                      <TableCell>Last {timeRange} days</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* User Engagement Details */}
        {userEngagement?.topUsers?.length > 0 && (
          <Paper sx={{ mt: 3, p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <People sx={{ mr: 1 }} />
              Most Active Users
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell><strong>User</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                    <TableCell><strong>Business</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userEngagement.topUsers.slice(0, 10).map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip label={user.actions} color="primary" size="small" />
                      </TableCell>
                      <TableCell>{user.business || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </DashboardLayout>
  );
}