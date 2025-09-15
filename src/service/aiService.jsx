// File: src/services/aiService.js (NEW)
import instance from './AxiosOrder';

export const aiService = {
  // Business Insights
  generateInsights: async (question) => {
    const response = await instance.post('/api/v1/ai/insights', { question });
    return response.data;
  },

  // Email Generator
  generateEmail: async (type, context) => {
    const response = await instance.post('/api/v1/ai/email', { type, context });
    return response.data;
  },

  // Marketing Post
  generateMarketingPost: async (productInfo, promotion) => {
    const response = await instance.post('/api/v1/ai/marketing', { 
      productInfo, 
      promotion 
    });
    return response.data;
  },

  // Invoice Summary
  generateInvoiceSummary: async (orderId) => {
    const response = await instance.post(`/api/v1/ai/invoice-summary/${orderId}`);
    return response.data;
  },

  // General AI Request
  processAIRequest: async (type, prompt, context = {}) => {
    const response = await instance.post('/api/v1/ai/request', {
      type,
      prompt,
      context
    });
    return response.data;
  }
};