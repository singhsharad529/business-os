import apiService from "./apiService";
import { AxiosRequestConfig } from "axios";

const adminAgentService = {
  getRevenueDashboardData: (config: AxiosRequestConfig) =>
    apiService.get("dashboard/revenue", config),
  getCallsDashboardData: (config: AxiosRequestConfig) =>
    apiService.get("dashboard/calls", config),
  getAgentCategories: (config: AxiosRequestConfig) =>
    apiService.get("admin/templates/categories", config),
  getAgentsByCategory: (config: AxiosRequestConfig) =>
    apiService.get(`admin/assistants`, config),
  getAllTemplates: (config: AxiosRequestConfig) =>
    apiService.get(`admin/assistants`, config),
  getAllActiveAssistants: (config: AxiosRequestConfig) =>
    apiService.get(`admin/assistants`, config),
  getAllAssistants: (config: AxiosRequestConfig) =>
    apiService.get(`admin/assistants`, config),
  getAllInboundCalls: (config: AxiosRequestConfig) =>
    apiService.get(`admin/calls`, config),
  getAllPhoneNumbers: (config: AxiosRequestConfig) =>
    apiService.get(`admin/phone-numbers`, config),
  getHistoryTestCalls: (config: AxiosRequestConfig) =>
    apiService.get(`admin/test-calls`, config),
  getActiveAgentDashboard: (id: string, config: AxiosRequestConfig) =>
    apiService.get(`admin/assistants/${id}/stats`, config),
  // assignAssistantToUser: (data: any, config: AxiosRequestConfig) =>
  //   apiService.post(`admin/assistants/assign`, data, config),
  setCallId: (callId: string, config: AxiosRequestConfig) =>
    apiService.post(`admin/save-call-id`, { callId }, config),
  getListModels: (config?: AxiosRequestConfig) =>
    apiService.get(`vapi/list-models`, config as AxiosRequestConfig),
  getVoices: (config?: AxiosRequestConfig) =>
    apiService.get(`vapi/voices`, config as AxiosRequestConfig),
  createAssistant: (data: any, config?: AxiosRequestConfig) =>
    apiService.post(`admin/assistants`, data, config as AxiosRequestConfig),
  duplicateAssistant: (
    assistantId: string,
    data: any,
    config?: AxiosRequestConfig,
  ) =>
    apiService.post(
      `admin/assistants/${assistantId}/duplicate`,
      data,
      config as AxiosRequestConfig,
    ),
  assignAssistantToUser: (data: any, config?: AxiosRequestConfig) =>
    apiService.post(
      `admin/assistants/assign`,
      data,
      config as AxiosRequestConfig,
    ),
  unassignAssistantToUser: (data: any, config?: AxiosRequestConfig) =>
    apiService.post(
      `admin/phone-numbers/unlink`,
      data,
      config as AxiosRequestConfig,
    ),
  addCategory: (data: any, config?: AxiosRequestConfig) =>
    apiService.post(
      `admin/templates/categories`,
      data,
      config as AxiosRequestConfig,
    ),
  deleteAssistant: (assistantId: string, config?: AxiosRequestConfig) =>
    apiService.delete(
      `admin/assistants/${assistantId}`,
      config as AxiosRequestConfig,
    ),
  getActiveAgentCalls: (config: AxiosRequestConfig) =>
    apiService.get(`vapi/calls/reports`, config),
  deleteFileFromAgent: (
    userId: string,
    assistantId: string,
    fileId: string,
    config?: AxiosRequestConfig,
  ) =>
    apiService.delete(
      `admin/users/${userId}/assistants/${assistantId}/files/local/${fileId}`,
      config as AxiosRequestConfig,
    ),
  uploadFileToAgent: (
    user_id: string,
    assistantId: string,
    formData: FormData,
    config: AxiosRequestConfig,
  ) => {
    return apiService.post(
      `admin/users/${user_id}/assistants/${assistantId}/attach-local-files`,
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
};

export default adminAgentService;
