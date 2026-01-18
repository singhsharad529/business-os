import apiService from "./apiService";
import { AxiosRequestConfig } from "axios";

const adminCustomerService = {
  getUsersList: (config: AxiosRequestConfig) =>
    apiService.get("admin/users", config),
  getUserProfile: (userId: string, config: AxiosRequestConfig) =>
    apiService.get(`admin/users/${userId}`, config),
  getCustomerAgents: (user_id: string, config: AxiosRequestConfig) =>
    apiService.get(`admin/users/${user_id}/assistants`, config),
  getLeads: (user_id: string, config: AxiosRequestConfig) =>
    apiService.get(`admin/users/${user_id}/leads`, config),
  addLead: (user_id: string, leadData: any, config: AxiosRequestConfig) =>
    apiService.post(`admin/users/${user_id}/leads`, leadData, config),
  addCustomer: (customerData: any, config: AxiosRequestConfig) =>
    apiService.post(`admin/users`, customerData, config),
  importLeadDatabaseData: (
    user_id: string,
    config: AxiosRequestConfig,
    file: File,
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiService.post(
      `admin/users/${user_id}/leads/import-csv`,
      formData,
      {
        ...config,
        headers: {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },
  getLeadById: (user_id: string, lead_id: string, config: AxiosRequestConfig) =>
    apiService.get(`admin/users/${user_id}/leads/${lead_id}`, config),
  updateLead: (
    user_id: string,
    lead_id: string,
    leadData: any,
    config: AxiosRequestConfig,
  ) =>
    apiService.put(`admin/users/${user_id}/leads/${lead_id}`, leadData, config),
  getLeadCalls: (config: AxiosRequestConfig) =>
    apiService.get(`admin/calls`, config),
  updateAgentStatus: (data: any, config: AxiosRequestConfig) =>
    apiService.post(`admin/assistants/toggle-status`, data, config),
};

export default adminCustomerService;
