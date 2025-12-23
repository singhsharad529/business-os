export type UserRole = "super_admin" | "company_admin" | "standard_user";

export type EntityStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "pending"
  | "active"
  | "closed"
  | "delinquent"
  | "scheduled"
  | "completed"
  | "cancelled";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  companyId?: string;
  avatar?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  timezone: string;
  currency: string;
  industry: "procurement" | "lending" | "home_services" | "general";
  status: "active" | "inactive";
  createdAt: string;
  enabledModules: string[];
  userCount: number;
  recordCount: number;
  storageUsage: number;
  aiUsage: number;
}

export interface EntityTemplate {
  id: string;
  companyId: string;
  name: string;
  pluralName: string;
  icon: string;
  fields: EntityField[];
  statuses: string[];
}

export interface EntityField {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "boolean" | "dropdown" | "reference";
  required: boolean;
  options?: string[];
}

export interface Entity {
  id: string;
  companyId: string;
  templateId: string;
  templateName: string;
  name: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  data: Record<string, any>;
}

export interface Activity {
  id: string;
  entityId: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  changes?: Record<string, any>;
}

export interface DashboardMetric {
  label: string;
  value: number | string;
  change?: number;
  trend?: "up" | "down" | "neutral";
}

export interface Alert {
  id: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
  timestamp: string;
  entityId?: string;
  entityName?: string;
}

export type CallStatus = "completed" | "missed" | "failed" | "ongoing";
export type CallSentiment = "positive" | "neutral" | "negative";

export interface CallRecord {
  id: string;
  sessionId: string;
  customerName: string;
  customerMobile: string;
  status: CallStatus;
  duration: number; // in seconds
  sentiment: CallSentiment;
  intent: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}
export interface Agent {
  id: string;
  configuration: string;
  industry: string;
  language: string;
  region: string;
  mobileNumber: string;
  specialty?: string;
  voice?: string;
  websiteName?: string;
  domain?: string;
  customContext?: string;
}

export interface VoicebotUser {
  email: string;
  fullName: string;
  company: string;
  subscription: string;
  verified: string;
  lastLogin: string;
}
