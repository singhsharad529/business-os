import apiService from "./apiService";
import { AxiosRequestConfig } from "axios";

const adminCustomerService = {
  getUsersList: (config: AxiosRequestConfig) =>
    apiService.get("admin/users", config),
  getUserProfile: (userId: string, config: AxiosRequestConfig) =>
    apiService.get(`admin/users/${userId}`, config),
  getCustomerAgents: (user_id: string, config: AxiosRequestConfig) =>
    apiService.get(`admin/users/${user_id}/assistants`, config),
};

export default adminCustomerService;
