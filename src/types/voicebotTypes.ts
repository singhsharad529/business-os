export interface QuickAgentSetupRequest {
  agentRole: string;
  configuration: string;
  language: string;
  phoneNumberId: string;
}

export interface Lead {
  id: string;
  userId: string;
  sourceFileId: string;
  sourceGcsKey: string;
  leadName: string;
  leadPhoneNumber: string;
  leadEmail: string;
  lastCalledAt: string;
  leadCompany: string;
  leadExpertiseDomain: string;
  createdAt: string;
  updatedAt: string;
  attributes?: Record<string, any>;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface LeadDatabaseResponse {
  leads: Lead[];
  pagination: Pagination;
}
