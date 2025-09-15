import instance from './AxiosOrder';

export const reportsService = {
  // Generate Sales Report
  generateSalesReport: async (startDate, endDate, includeDetails = true) => {
    const response = await instance.post('/api/v1/reports/sales', {
      reportType: 'SALES',
      startDate,
      endDate,
      format: 'JSON',
      includeDetails
    });
    return response.data;
  },

  // Generate Inventory Report
  generateInventoryReport: async (includeDetails = true) => {
    const response = await instance.post('/api/v1/reports/inventory', {
      reportType: 'INVENTORY',
      startDate: new Date(Date.now() - 365*24*60*60*1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      format: 'JSON',
      includeDetails
    });
    return response.data;
  },

  // Generate Profit & Loss Report
  generateProfitLossReport: async (startDate, endDate) => {
    const response = await instance.post('/api/v1/reports/profit-loss', {
      reportType: 'PROFIT_LOSS',
      startDate,
      endDate,
      format: 'JSON',
      includeDetails: false
    });
    return response.data;
  },

  // Generate Customer Analysis Report
  generateCustomerAnalysisReport: async (startDate, endDate) => {
    const response = await instance.post('/api/v1/reports/customer-analysis', {
      reportType: 'CUSTOMER_ANALYSIS',
      startDate,
      endDate,
      format: 'JSON',
      includeDetails: true
    });
    return response.data;
  },

  // Download PDF Report
  downloadPDFReport: async (reportType, startDate, endDate) => {
    const response = await instance.post(`/api/v1/reports/pdf/${reportType}`, {
      reportType: reportType.toUpperCase(),
      startDate,
      endDate,
      format: 'PDF',
      includeDetails: true
    }, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${reportType}_report_${startDate}_${endDate}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};