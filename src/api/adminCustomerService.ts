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
};

export default adminCustomerService;
