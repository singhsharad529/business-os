import { QuickAgentSetupRequest, Lead } from "@/types/voicebotTypes";
import apiService from "./apiService";
import { AxiosRequestConfig } from "axios";

const voiceBotService = {
  getDashboardData: (config: AxiosRequestConfig) =>
    apiService.get("dashboard/voicebot", config),
  getAllAgents: (config: AxiosRequestConfig) =>
    apiService.get("users/assistants", config),
  getProfile: (config: AxiosRequestConfig) =>
    apiService.get("users/me", config),
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
    config: AxiosRequestConfig,
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
  updateAgentStatus: (vapiId: string, data: any, config: AxiosRequestConfig) =>
    apiService.patch(`vapi/assistants/${vapiId}/toggle-status`, data, config),
  getCallLogs: (config: AxiosRequestConfig) =>
    apiService.get("vapi/call-logs", config),
  linkPhoneNumber: (
    vapiIdPhoneNumber: string,
    assistantId: string | null,
    config: AxiosRequestConfig,
  ) =>
    apiService.patch(
      `vapi/phone-numbers/${vapiIdPhoneNumber}/link`,
      { assistantId },
      config,
    ),
  getAgentCalls: (config: AxiosRequestConfig) =>
    apiService.get("/users/calls", config),
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
  getLeadDatabaseData: (config: AxiosRequestConfig) =>
    apiService.get(`users/leads`, config),
  importLeadDatabaseData: (config: AxiosRequestConfig, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiService.post("users/leads/batch", formData, {
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
    config: AxiosRequestConfig,
  ) => apiService.post("templates/test-outbound-call", data, config),
  getHistoryTestCalls: (config: AxiosRequestConfig) =>
    apiService.get("vapi/calls/reports", config),
  publishAgent: (
    data: { assistantId: string; name: string; phoneNumberId?: string },
    config: AxiosRequestConfig,
  ) => apiService.post("templates/publish", data, config),
  getLead: (id: string, config: AxiosRequestConfig) =>
    apiService.get(`users/leads/${id}`, config),
  updateLead: (id: string, data: any, config: AxiosRequestConfig) =>
    apiService.put(`users/leads/${id}`, data, config),
  deleteLead: (id: string, config: AxiosRequestConfig) =>
    apiService.delete(`users/leads/${id}`, config),
  createLead: (data: any, config: AxiosRequestConfig) =>
    apiService.post("users/leads", data, config),
  getCampaignStats: (config: AxiosRequestConfig) =>
    apiService.get("scheduler/campaigns/stats", config),
  getCampaigns: (config: AxiosRequestConfig) =>
    apiService.get("scheduler/campaigns", config),
  getTimeZone: (config: AxiosRequestConfig) =>
    apiService.get("scheduler/timezones", config),
  deleteCampaign: (id: string, config: AxiosRequestConfig) =>
    apiService.delete(`scheduler/campaigns/${id}`, config),
  createCampaign: (data: any, config: AxiosRequestConfig) =>
    apiService.post(`scheduler/campaigns`, data, config),
  getCalculatedEndDate: (data: any, config: AxiosRequestConfig) =>
    apiService.post(`scheduler/calculatEndDate`, data, config),
  getSingleCampaignStat: (id: string, config: AxiosRequestConfig) =>
    apiService.get(`scheduler/campaigns/${id}/progress`, config),
  getCampaignInfo: (id: string, config: AxiosRequestConfig) =>
    apiService.get(`scheduler/campaigns/${id}`, config),
  getCampaignLeads: (id: string, config: AxiosRequestConfig) =>
    apiService.get(`scheduler/campaigns/${id}/leads`, config),
  addLeadsToCampaign: (id: string, data: any, config: AxiosRequestConfig) =>
    apiService.post(`scheduler/campaigns/${id}/reschedule`, data, config),
  updateCampaignStatus: (id: string, data: any, config: AxiosRequestConfig) =>
    apiService.patch(`scheduler/campaigns/${id}/status`, data, config),
  getLeadsCategories: (config: AxiosRequestConfig) =>
    apiService.get(`vapi/lead-database/category`, config),
};

export default voiceBotService;
