import apiService from "./apiService";
import { AxiosRequestConfig } from "axios";

const adminAgentService = {
  getAgentCategories: (config: AxiosRequestConfig) =>
    apiService.get("admin/templates/categories", config),
  getAgentsByCategory: (value: string, config: AxiosRequestConfig) =>
    apiService.get(`admin/templates/categories/${value}`, config),
  getAllAssistants: (config: AxiosRequestConfig) =>
    apiService.get(`admin/assistants`, config),
};

export default adminAgentService;
