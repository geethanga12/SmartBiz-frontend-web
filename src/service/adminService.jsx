// File: src/services/adminService.js (NEW)
import instance from './AxiosOrder';

export const adminService = {
  // Get System Statistics
  getSystemStats: async () => {
    const response = await instance.get('/api/v1/admin/stats');
    return response.data;
  },

  // Get All Businesses
  getAllBusinesses: async () => {
    const response = await instance.get('/api/v1/admin/businesses');
    return response.data;
  },

  // Get Usage Logs
  getUsageLogs: async (page = 0, size = 50) => {
    const response = await instance.get(`/api/v1/admin/logs/usage?page=${page}&size=${size}`);
    return response.data;
  },

  // Get AI Usage Logs
  getAIUsageLogs: async (page = 0, size = 50) => {
    const response = await instance.get(`/api/v1/admin/logs/ai?page=${page}&size=${size}`);
    return response.data;
  }
};