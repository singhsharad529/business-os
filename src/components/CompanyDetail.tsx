import type { Company } from '../types';
import { Calendar, Globe, DollarSign, Users, Database, HardDrive, Cpu } from 'lucide-react';

interface CompanyDetailProps {
  company: Company;
}

export function CompanyDetail({ company }: CompanyDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-primary-soft rounded-lg flex items-center justify-center text-primary font-bold text-2xl">
          {company.logo}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-text-main">{company.name}</h3>
          <span className={`badge ${company.status === 'active' ? 'badge-success' : ''} mt-1`}>
            {company.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-text-muted mb-2">
            <Globe className="w-4 h-4" />
            <span className="text-xs font-medium">Industry</span>
          </div>
          <p className="text-sm text-text-main font-medium capitalize">
            {company.industry.replace('_', ' ')}
          </p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 text-text-muted mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium">Currency</span>
          </div>
          <p className="text-sm text-text-main font-medium">{company.currency}</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 text-text-muted mb-2">
            <Globe className="w-4 h-4" />
            <span className="text-xs font-medium">Timezone</span>
          </div>
          <p className="text-sm text-text-main font-medium">{company.timezone}</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 text-text-muted mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium">Created</span>
          </div>
          <p className="text-sm text-text-main font-medium">
            {new Date(company.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-text-main mb-3">Usage Statistics</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-bg rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-text-muted" />
              <span className="text-xs text-text-muted">Users</span>
            </div>
            <span className="text-sm font-semibold text-text-main">{company.userCount}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-bg rounded-lg">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-text-muted" />
              <span className="text-xs text-text-muted">Records</span>
            </div>
            <span className="text-sm font-semibold text-text-main">{company.recordCount}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-bg rounded-lg">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-text-muted" />
              <span className="text-xs text-text-muted">Storage</span>
            </div>
            <span className="text-sm font-semibold text-text-main">{company.storageUsage} GB</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-bg rounded-lg">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-text-muted" />
              <span className="text-xs text-text-muted">AI Usage</span>
            </div>
            <span className="text-sm font-semibold text-text-main">{company.aiUsage} requests</span>
          </div>
        </div>
      </div>

      {company.enabledModules.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-text-main mb-3">Enabled Modules</h4>
          <div className="flex flex-wrap gap-2">
            {company.enabledModules.map((module) => (
              <span key={module} className="badge badge-primary">
                {module}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
