import { Edit, Trash2, Clock, Copy, Download, Share2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import type { Entity } from '../../types';

interface EntityDetailProps {
  entity: Entity;
  onEdit: () => void;
  onDelete: () => void;
}

export function EntityDetail({ entity, onEdit, onDelete }: EntityDetailProps) {
  const { getActivitiesForEntity } = useData();
  const activities = getActivitiesForEntity(entity.id);

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

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this item?')) {
      onDelete();
    }
  };

  const renderFieldValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(value).toLocaleDateString();
    }
    return value;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between pb-3 border-b border-bg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`badge ${statusColors[entity.status]}`}>
              {entity.status}
            </span>
            <span className="text-[10px] text-text-muted">{entity.templateName}</span>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button onClick={onEdit} className="btn btn-secondary text-xs flex items-center gap-1.5">
            <Edit className="w-3 h-3" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-secondary text-xs flex items-center gap-1.5 text-danger hover:bg-danger-soft"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-text-main mb-3">Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(entity.data).map(([key, value]) => (
              <div key={key}>
                <div className="text-[10px] font-medium text-text-muted mb-0.5 uppercase tracking-wide">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-xs text-text-main font-medium">
                  {renderFieldValue(value)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-semibold text-text-main mb-3">Activity History</h3>
          {activities.length === 0 ? (
            <div className="text-center py-6 text-text-muted">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-xs">No activity recorded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3 pb-3 border-b border-bg last:border-0 last:pb-0">
                  <div className="w-7 h-7 bg-primary-soft rounded-full flex items-center justify-center text-primary font-medium text-[10px] flex-shrink-0">
                    {activity.userName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-text-main">{activity.userName}</span>
                        <span className="text-xs text-text-muted"> {activity.action}</span>
                      </div>
                      <span className="text-[10px] text-text-muted whitespace-nowrap flex-shrink-0">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {activity.changes && (
                      <div className="text-xs text-text-muted mt-1">
                        {Object.entries(activity.changes).map(([field, change]: [string, any]) => (
                          <div key={field} className="flex items-center gap-1.5 flex-wrap">
                            <span className="capitalize">{field}:</span>
                            <span className="line-through">{change.from}</span>
                            <span>→</span>
                            <span className="font-medium">{change.to}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-semibold text-text-main mb-3">Information</h3>
          <div className="space-y-3">
            <div>
              <div className="text-[10px] font-medium text-text-muted mb-0.5 uppercase tracking-wide">Created</div>
              <div className="text-xs text-text-main">
                {new Date(entity.createdAt).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium text-text-muted mb-0.5 uppercase tracking-wide">Last Updated</div>
              <div className="text-xs text-text-main">
                {new Date(entity.updatedAt).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium text-text-muted mb-0.5 uppercase tracking-wide">ID</div>
              <div className="text-xs text-text-main font-mono">{entity.id}</div>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-semibold text-text-main mb-3">Quick Actions</h3>
          <div className="space-y-1.5">
            <button className="w-full btn btn-secondary text-left text-xs flex items-center gap-2">
              <Copy className="w-3.5 h-3.5" />
              Duplicate
            </button>
            <button className="w-full btn btn-secondary text-left text-xs flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button className="w-full btn btn-secondary text-left text-xs flex items-center gap-2">
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
