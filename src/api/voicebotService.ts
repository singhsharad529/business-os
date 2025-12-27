import { QuickAgentSetupRequest } from "@/types/voicebotTypes";
import apiService from "./apiService";
import { AxiosRequestConfig } from "axios";

const voiceBotService = {
  getDashboardData: (config: AxiosRequestConfig) =>
    apiService.get("dashboard/voicebot", config),
  getAllAgents: (config: AxiosRequestConfig) =>
    apiService.get("vapi/quick-agents", config),
  getAgentRoles: (config: AxiosRequestConfig) =>
    apiService.get("vapi/agent-roles", config),
  getAgentLanguages: (config: AxiosRequestConfig) =>
    apiService.get("vapi/agent-languages", config),
  getNumbers: (config: AxiosRequestConfig) =>
    apiService.get("vapi/unassigned", config),
  getConfiguration: (config: AxiosRequestConfig) =>
    apiService.get("vapi/agent-configurations", config),
  createQuickAgent: (
    data: QuickAgentSetupRequest,
    config: AxiosRequestConfig
  ) => apiService.post("vapi/quick-agent-setup", data, config),
  getCompanyList: (config: AxiosRequestConfig) =>
    apiService.get("company/", config),
  getCompanyById: (id: string | undefined, config: AxiosRequestConfig) =>
    apiService.get(`company/${id}`, config),
  createCompany: (data: any, config: AxiosRequestConfig) =>
    apiService.post("company/", data, config),
  updateCompany: (id: string, data: any, config: AxiosRequestConfig) =>
    apiService.patch(`company/${id}`, data, config),
  deleteAgent: (id: string, config: AxiosRequestConfig) =>
    apiService.delete(`vapi/assistants/${id}`, config),
  updateAgent: (vapiId: string, data: any, config: AxiosRequestConfig) =>
    apiService.patch(`vapi/assistants/${vapiId}`, data, config),
  getCallLogs: (config: AxiosRequestConfig) =>
    apiService.get("vapi/call-logs", config),
  linkPhoneNumber: (
    vapiIdPhoneNumber: string,
    assistantId: string | null,
    config: AxiosRequestConfig
  ) =>
    apiService.patch(
      `vapi/phone-numbers/${vapiIdPhoneNumber}/link`,
      { assistantId },
      config
    ),
  getAgentCallReports: (
    params: {
      assistantId: string;
      phoneNumberId: string;
      page?: number;
      page_size?: number;
    },
    config: AxiosRequestConfig
  ) => apiService.get("vapi/calls/reports", { ...config, params }),
  getCallDetail: (vapiId: string, config: AxiosRequestConfig) =>
    apiService.get(`vapi/calls/${vapiId}`, config),
};

export default voiceBotService;
