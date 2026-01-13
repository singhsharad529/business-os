import apiService from "./apiService";
import { AxiosRequestConfig } from "axios";

// src/api/userService.js
const userService = {
  login: (
    data: { email: string; password: string; role: string },
    config: AxiosRequestConfig
  ) => apiService.post(`${data.role}/login`, data, config),
};

export default userService;
