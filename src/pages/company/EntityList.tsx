import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Search, Plus, Filter, Edit, Trash2, RotateCcw, X } from 'lucide-react';
import { SideSheet } from '../../components/SideSheet';
import { EntityForm } from '../../components/EntityForm';
import { EntityDetail } from './EntityDetail';
import type { Entity } from '../../types';
import { mockCompanies } from '../../data/mockData';

interface EntityListProps {
  templateName: string;
}

export function EntityList({ templateName }: EntityListProps) {
  const { user } = useAuth();
  const { getEntitiesByCompany, getAllEntitiesByName, deleteEntity } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);


  const entities = user?.companyId
    ? getEntitiesByCompany(user.companyId, templateName)
    : getAllEntitiesByName(templateName);


  const filteredEntities = entities.filter((entity) => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entity.status === statusFilter;
    const category = (entity.data?.category || '').toString();
    const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(category);
    return matchesSearch && matchesStatus && matchesCategory;
  });


  const statuses = Array.from(new Set(entities.map((e) => e.status)));

  const categories = Array.from(new Set(
    entities.map((e) => (e.data?.category || '').toString()).filter((c) => c.trim().length > 0))).sort();

  const statusColors: Record<string, string> = {
    draft: 'badge',
    sent: 'badge-warning',
    accepted: 'badge-success',
    rejected: 'badge-danger',
    pending: 'badge-warning',
    active: 'badge-success',
    closed: 'badge',
    delinquent: 'badge-danger',
    scheduled: 'badge-warning',
    completed: 'badge-success',
    cancelled: 'badge-danger',
    inactive: 'badge',
    paid: 'badge-success',
    overdue: 'badge-danger',
    in_progress: 'badge-warning',
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this item?')) {
      deleteEntity(id);
    }
  };

  const handleEdit = (entity: Entity, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEntity(entity);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-text-main">{templateName}</h1>
          <p className="text-xs text-text-muted mt-0.5">
            {filteredEntities.length} {filteredEntities.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        <button
          onClick={() => setShowCreateSheet(true)}
          className="btn btn-primary flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add {templateName.slice(0, -1)}
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder={`Search ${templateName.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-8 w-full"
            />
          </div>
          <div className="flex gap-2 relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input min-w-[120px]"
            >
              <option value="all">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status} className="capitalize">
                  {status}
                </option>
              ))}
            </select>
            <button className="btn btn-secondary flex items-center gap-1.5"
              onClick={() => setIsFilterOpen((v) => !v)}
            >
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filter</span>
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-10 z-10 w-64 rounded-md border border-border bg-white shadow-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-main">Categories</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-bg"
                      title="Clear categories"
                      onClick={() => setCategoryFilter([])}
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-primary" />
                    </button>
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-bg"
                      title="Close"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      <X className="w-3.5 h-3.5 text-text-muted" />
                    </button>
                  </div>
                </div>

                <div className="max-h-56 overflow-auto space-y-2">
                  {categories.length === 0 && (
                    <div className="text-[12px] text-text-muted">No categories</div>
                  )}

                  {categories.map((category) => {
                    const checked = categoryFilter.includes(category);
                    return (
                      <label key={category} className="flex items-center gap-2 text-xs text-text-main">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setCategoryFilter((prev) =>
                              checked ? prev.filter((c) => c !== category) : [...prev, category]
                            );
                          }}
                        />
                        <span>{category}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

        {filteredEntities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-text-muted">
              <Search className="w-12 h-12 mx-auto opacity-20 mb-2" />
              <p className="text-xs">No {templateName.toLowerCase()} found</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-text-main">Name</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-text-main">Status</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-text-main">Created</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-text-main">Updated</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-text-main">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntities.map((entity) => (
                  <tr
                    key={entity.id}
                    onClick={() => setSelectedEntity(entity)}
                    className="hover:bg-bg transition-colors cursor-pointer"
                  >
                    <td className="py-2.5 px-3">
                      <div className="text-xs font-medium text-text-main">{entity.name}</div>
                      {(entity.data.vendorName || entity.data.borrowerName || entity.data.customerName) && (
                        <div className="text-[10px] text-text-muted">
                          {entity.data.vendorName || entity.data.borrowerName || entity.data.customerName}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`badge ${statusColors[entity.status]}`}>
                        {entity.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-xs text-text-muted">
                      {new Date(entity.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-xs text-text-muted">
                      {new Date(entity.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => handleEdit(entity, e)}
                          className="p-1.5 hover:bg-bg rounded-md transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5 text-text-muted" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(entity.id, e)}
                          className="p-1.5 hover:bg-danger-soft rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-danger" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SideSheet
        isOpen={showCreateSheet}
        onClose={() => setShowCreateSheet(false)}
        title={`New ${templateName.slice(0, -1)}`}
        size="md"
      >
        <EntityForm
          templateName={templateName}
          onSave={() => setShowCreateSheet(false)}
          onCancel={() => setShowCreateSheet(false)}
        />
      </SideSheet>

      <SideSheet
        isOpen={!!editingEntity}
        onClose={() => setEditingEntity(null)}
        title={`Edit ${templateName.slice(0, -1)}`}
        size="md"
      >
        {editingEntity && (
          <EntityForm
            templateName={templateName}
            entity={editingEntity}
            onSave={() => setEditingEntity(null)}
            onCancel={() => setEditingEntity(null)}
          />
        )}
      </SideSheet>

      <SideSheet
        isOpen={!!selectedEntity}
        onClose={() => setSelectedEntity(null)}
        title={selectedEntity?.name || ''}
        size="lg"
      >
        {selectedEntity && (
          <EntityDetail
            entity={selectedEntity}
            onEdit={() => {
              setEditingEntity(selectedEntity);
              setSelectedEntity(null);
            }}
            onDelete={() => {
              deleteEntity(selectedEntity.id);
              setSelectedEntity(null);
            }}
          />
        )}
      </SideSheet>
    </div>
  );
}
