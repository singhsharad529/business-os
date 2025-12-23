import apiService from "./apiService";
import { AxiosRequestConfig } from "axios";

// src/api/userService.js
const userService = {
  login: (
    data: { email: string; password: string },
    config: AxiosRequestConfig
  ) => apiService.post("users/login", data, config),
};

export default userService;
