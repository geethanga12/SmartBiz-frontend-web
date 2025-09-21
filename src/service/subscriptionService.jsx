// src/service/subscriptionService.js
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

  // Assign plan to business
  assignPlan: async (planId, businessId) =>
    (await instance.post(`${base}/${planId}/assign/${businessId}`)).data,
};
