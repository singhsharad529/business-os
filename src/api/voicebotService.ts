import { QuickAgentSetupRequest, Lead } from "@/types/voicebotTypes";
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
  uploadFiles: (files: File[], config: AxiosRequestConfig) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return apiService.post("vapi/files/global-kb", formData, {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getLeadDatabaseData: (
    params: { page: number; page_size: number },
    config: AxiosRequestConfig
  ) => apiService.get(`vapi/lead-database`, { ...config, params }),
  importLeadDatabaseData: (config: AxiosRequestConfig, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiService.post("vapi/lead-database/upload", formData, {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getAgentTemplates: (config: AxiosRequestConfig) =>
    apiService.get("templates/list", config),
  testCall: (
    data: { assistantId: string; customerNumber: string; customerName: string },
    config: AxiosRequestConfig
  ) => apiService.post("templates/test-outbound-call", data, config),
  getHistoryTestCalls: (config: AxiosRequestConfig) =>
    apiService.get("vapi/calls/reports", config),
  publishAgent: (
    data: { assistantId: string; name: string; phoneNumberId?: string },
    config: AxiosRequestConfig
  ) => apiService.post("templates/publish", data, config),
  getLead: (id: string, config: AxiosRequestConfig) =>
    apiService.get(`vapi/lead-database/${id}`, config),
  updateLead: (
    id: string,
    data: {
      leadName?: string;
      leadEmail?: string;
      leadPhoneNumber?: string;
      leadCompany?: string;
      leadExpertiseDomain?: string;
      lastCalledAt?: string;
    },
    config: AxiosRequestConfig
  ) => apiService.put(`vapi/lead-database/${id}`, data, config),
  deleteLead: (id: string, config: AxiosRequestConfig) =>
    apiService.delete(`vapi/lead-database/${id}`, config),
  createLead: (data: any, config: AxiosRequestConfig) =>
    apiService.post("vapi/lead-database", data, config),
  getCampaigns: (config: AxiosRequestConfig) =>
    apiService.get("scheduler/campaigns", config),
  getTimeZone: (config: AxiosRequestConfig) =>
    apiService.get("scheduler/timezones", config),
};

export default voiceBotService;
