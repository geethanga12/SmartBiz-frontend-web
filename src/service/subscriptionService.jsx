// src/service/subscriptionService.jsx
import instance from "./AxiosOrder";

const base = "/api/v1/subscription-plans";

export const subscriptionService = {
  // Admin endpoints
  getAll: async () => (await instance.get(base)).data,
  getById: async (id) => (await instance.get(`${base}/${id}`)).data,
  create: async (payload) => (await instance.post(base, payload)).data,
  update: async (id, payload) => (await instance.put(`${base}/${id}`, payload)).data,
  delete: async (id) => (await instance.delete(`${base}/${id}`)).data,

  // Public
  getPublicPlans: async () => (await instance.get(`${base}/public`)).data,

  // UPDATED: Assign plan to business (fixed endpoint)
  assignPlan: async (planId, businessId) => {
    try {
      const response = await instance.post(`${base}/${planId}/assign/${businessId}`);
      return response.data;
    } catch (error) {
      console.error('Error in assignPlan:', error);
      throw error;
    }
  },

  // NEW: Admin assign plan alternative endpoint
  adminAssignPlan: async (planId, businessId) => {
    try {
      const response = await instance.post(`/api/v1/admin/business/${businessId}/assign-plan/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Error in adminAssignPlan:', error);
      throw error;
    }
  }
};