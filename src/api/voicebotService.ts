import apiService from "./apiService";
import { AxiosRequestConfig } from "axios";

const voiceBotService = {
  getDashboardData: (config: AxiosRequestConfig) =>
    apiService.get("dashboard", config),
  getAllAgents: (config: AxiosRequestConfig) =>
    apiService.get("vapi/assistants", config),
};

export default voiceBotService;
