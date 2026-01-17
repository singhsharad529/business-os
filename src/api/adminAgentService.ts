import apiService from "./apiService";
import { AxiosRequestConfig } from "axios";

const adminAgentService = {
  getAgentCategories: (config: AxiosRequestConfig) =>
    apiService.get("admin/templates/categories", config),
  getAgentsByCategory: (value: string, config: AxiosRequestConfig) =>
    apiService.get(`admin/templates/categories/${value}`, config),
  getAllAssistants: (config: AxiosRequestConfig) =>
    apiService.get(`admin/assistants`, config),
  getAllInboundCalls: (config: AxiosRequestConfig) =>
    apiService.get(`admin/calls`, config),
  getAllPhoneNumbers: (config: AxiosRequestConfig) =>
    apiService.get(`admin/phone-numbers`, config),
  getHistoryTestCalls: (config: AxiosRequestConfig) =>
    apiService.get(`admin/test-calls`, config),
  // assignAssistantToUser: (data: any, config: AxiosRequestConfig) =>
  //   apiService.post(`admin/assistants/assign`, data, config),
  setCallId: (callId: string, config: AxiosRequestConfig) =>
    apiService.post(`admin/save-call-id`, { callId }, config),
};

export default adminAgentService;
