import apiClient from "./apiClient";
import { AxiosRequestConfig } from "axios";

const apiService = {
  get: async (url: string, config: AxiosRequestConfig) => {
    const response = await apiClient.get(url, config);
    return response.data;
  },
  post: async (url: string, data: unknown, config: AxiosRequestConfig) => {
    const response = await apiClient.post(url, data, config);
    return response.data;
  },
  put: async (url: string, data: unknown, config: AxiosRequestConfig) => {
    const response = await apiClient.put(url, data, config);
    return response.data;
  },
  delete: async (url: string, config: AxiosRequestConfig) => {
    const response = await apiClient.delete(url, config);
    return response.data;
  },
  patch: async (url: string, data: unknown, config: AxiosRequestConfig) => {
    const response = await apiClient.patch(url, data, config);
    return response.data;
  },
};

export default apiService;
