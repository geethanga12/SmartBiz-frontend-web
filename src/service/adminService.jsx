// src/service/adminService.jsx
import instance from './AxiosOrder';

export const adminService = {
  // Existing methods
  getSystemStats: async () => {
    const response = await instance.get('/api/v1/admin/stats');
    return response.data;
  },

  getAllBusinesses: async () => {
    const response = await instance.get('/api/v1/admin/businesses');
    return response.data;
  },

  getUsageLogs: async (page = 0, size = 50) => {
    const response = await instance.get(`/api/v1/admin/logs/usage?page=${page}&size=${size}`);
    return response.data;
  },

  getAIUsageLogs: async (page = 0, size = 50) => {
    const response = await instance.get(`/api/v1/admin/logs/ai?page=${page}&size=${size}`);
    return response.data;
  },

  // NEW: Enhanced analytics and monitoring methods
  getSystemWideStatistics: async (days = 30) => {
    const response = await instance.get(`/api/v1/admin/system-stats?days=${days}`);
    return response.data;
  },

  getAIUsageStatistics: async (days = 30) => {
    const response = await instance.get(`/api/v1/admin/ai-usage-stats?days=${days}`);
    return response.data;
  },

  getBusinessActivity: async (days = 7) => {
    const response = await instance.get(`/api/v1/admin/business-activity?days=${days}`);
    return response.data;
  },

  getUserEngagementMetrics: async (days = 30) => {
    const response = await instance.get(`/api/v1/admin/user-engagement?days=${days}`);
    return response.data;
  },

  getSubscriptionAnalytics: async () => {
    const response = await instance.get('/api/v1/admin/subscription-analytics');
    return response.data;
  },

  getRevenueMetrics: async (days = 30) => {
    const response = await instance.get(`/api/v1/admin/revenue-metrics?days=${days}`);
    return response.data;
  },

  getSystemHealth: async () => {
    const response = await instance.get('/api/v1/admin/system-health');
    return response.data;
  },

  exportUsageLogs: async (days = 30, format = 'csv') => {
    const response = await instance.get(`/api/v1/admin/export/usage-logs?days=${days}&format=${format}`);
    return response.data;
  },

  getFeatureUsage: async (days = 30) => {
    const response = await instance.get(`/api/v1/admin/feature-usage?days=${days}`);
    return response.data;
  }
};