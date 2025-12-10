import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import type { Company } from '../types';

interface CompanyFormProps {
  company?: Company;
  onSave: () => void;
  onCancel: () => void;
}

export function CompanyForm({ company, onSave, onCancel }: CompanyFormProps) {
  const { createCompany, updateCompany } = useData();

  const [formData, setFormData] = useState({
    name: company?.name || '',
    logo: company?.logo || '',
    timezone: company?.timezone || 'America/New_York',
    currency: company?.currency || 'USD',
    industry: company?.industry || 'general' as 'procurement' | 'lending' | 'home_services' | 'general',
    status: company?.status || 'active' as 'active' | 'inactive',
    enabledModules: company?.enabledModules || [],
    userCount: company?.userCount || 0,
    recordCount: company?.recordCount || 0,
    storageUsage: company?.storageUsage || 0,
    aiUsage: company?.aiUsage || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (company) {
      updateCompany(company.id, formData);
    } else {
      createCompany(formData);
    }

    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-text-main mb-1">
          Company Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input"
          required
          placeholder="Acme Corporation"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-main mb-1">
          Logo (Text/Emoji)
        </label>
        <input
          type="text"
          value={formData.logo}
          onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
          className="input"
          placeholder="AC"
          maxLength={2}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-main mb-1">
          Industry <span className="text-danger">*</span>
        </label>
        <select
          value={formData.industry}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value as any })}
          className="input"
          required
        >
          <option value="general">General</option>
          <option value="procurement">Procurement</option>
          <option value="lending">Lending</option>
          <option value="home_services">Home Services</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-text-main mb-1">
          Timezone <span className="text-danger">*</span>
        </label>
        <select
          value={formData.timezone}
          onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
          className="input"
          required
        >
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="Europe/London">London (GMT)</option>
          <option value="Europe/Paris">Paris (CET)</option>
          <option value="Asia/Tokyo">Tokyo (JST)</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-text-main mb-1">
          Currency <span className="text-danger">*</span>
        </label>
        <select
          value={formData.currency}
          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          className="input"
          required
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="JPY">JPY (¥)</option>
          <option value="CAD">CAD ($)</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-text-main mb-1">
          Status <span className="text-danger">*</span>
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          className="input"
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex gap-2 pt-4">
        <button type="submit" className="btn btn-primary flex-1">
          {company ? 'Update Company' : 'Create Company'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
