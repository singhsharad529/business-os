import apiService from "./apiService";
import { AxiosRequestConfig } from "axios";

const adminCustomerService = {
  getUsersList: (config: AxiosRequestConfig) =>
    apiService.get("admin/users", config),
  getUserProfile: (userId: string, config: AxiosRequestConfig) =>
    apiService.get(`admin/users/${userId}`, config),
};

export default adminCustomerService;
