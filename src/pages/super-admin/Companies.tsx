import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Search, Plus, MoreVertical, Eye, Edit2, Trash2 } from 'lucide-react';
import { SideSheet } from '../../components/SideSheet';
import { CompanyForm } from '../../components/CompanyForm';
import { CompanyDetail } from '../../components/CompanyDetail';
import type { Company } from '../../types';

export function Companies() {
  const { companies, getCompany, deleteCompany } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'add' | 'edit' | 'view' | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>();
  const [showOptionsMenu, setShowOptionsMenu] = useState<string | null>(null);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCompany(undefined);
    setViewMode('add');
  };

  const handleView = (companyId: string) => {
    const company = getCompany(companyId);
    setEditingCompany(company);
    setViewMode('view');
    setShowOptionsMenu(null);
  };

  const handleEdit = (companyId: string) => {
    const company = getCompany(companyId);
    setEditingCompany(company);
    setViewMode('edit');
    setShowOptionsMenu(null);
  };

  const handleDelete = (companyId: string) => {
    if (confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      deleteCompany(companyId);
      setShowOptionsMenu(null);
    }
  };

  const handleCloseSideSheet = () => {
    setViewMode(null);
    setEditingCompany(undefined);
  };

  const getSideSheetTitle = () => {
    if (viewMode === 'add') return 'Add Company';
    if (viewMode === 'edit') return 'Edit Company';
    if (viewMode === 'view') return 'Company Details';
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Companies</h1>
          <p className="text-text-muted mt-1">Manage all companies on the platform</p>
        </div>
        <button onClick={handleAdd} className="btn btn-primary flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Add Company
        </button>
      </div>

      <div className="card p-4">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-8"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg">
                <th className="text-left py-2 px-3 text-xs font-semibold text-text-main">Company</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-text-main">Industry</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-text-main">Status</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-text-main">Users</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-text-main">Records</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-text-main">Storage</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-text-main">Created</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-text-main">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr
                  key={company.id}
                  className="hover:bg-bg transition-colors"
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-soft rounded-lg flex items-center justify-center text-primary font-semibold">
                        {company.logo}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-text-main">{company.name}</div>
                        <div className="text-[10px] text-text-muted">{company.currency}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="badge capitalize">{company.industry.replace('_', ' ')}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`badge ${company.status === 'active' ? 'badge-success' : ''}`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-xs text-text-main">{company.userCount}</td>
                  <td className="py-2.5 px-3 text-xs text-text-main">{company.recordCount}</td>
                  <td className="py-2.5 px-3 text-xs text-text-main">{company.storageUsage} GB</td>
                  <td className="py-2.5 px-3 text-xs text-text-muted">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1 relative">
                      <button
                        onClick={() => handleView(company.id)}
                        className="p-1.5 hover:bg-bg rounded-md transition-colors"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5 text-text-muted" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowOptionsMenu(showOptionsMenu === company.id ? null : company.id)}
                          className="p-1.5 hover:bg-bg rounded-md transition-colors"
                          title="More options"
                        >
                          <MoreVertical className="w-3.5 h-3.5 text-text-muted" />
                        </button>
                        {showOptionsMenu === company.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setShowOptionsMenu(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-40 bg-surface rounded-lg shadow-lg border border-border-subtle z-20">
                              <button
                                onClick={() => handleEdit(company.id)}
                                className="w-full px-3 py-2 text-xs text-left text-text-main hover:bg-bg transition-colors flex items-center gap-2 rounded-t-lg"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(company.id)}
                                className="w-full px-3 py-2 text-xs text-left text-danger hover:bg-danger-soft transition-colors flex items-center gap-2 rounded-b-lg"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SideSheet
        isOpen={viewMode !== null}
        onClose={handleCloseSideSheet}
        title={getSideSheetTitle()}
        size="md"
      >
        {viewMode === 'view' && editingCompany && (
          <CompanyDetail company={editingCompany} />
        )}
        {(viewMode === 'add' || viewMode === 'edit') && (
          <CompanyForm
            company={editingCompany}
            onSave={handleCloseSideSheet}
            onCancel={handleCloseSideSheet}
          />
        )}
      </SideSheet>
    </div>
  );
}
