import { Calendar, DollarSign, Wrench, CheckCircle, Clock } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import type { Entity } from '../types';

interface JobDetailProps {
    job: Entity;
    onEdit: () => void;
    onDelete: () => void;
}

/**
 * Specialized detail view for Job entities with scheduling and completion tracking
 */
export function JobDetail({ job }: JobDetailProps) {
    const { getEntity, getEntitiesByCompany } = useData();

    const customerId = job.data.customer_id as string | undefined;
    const customer = customerId ? getEntity(customerId) : undefined;
    const relatedQuotes = getEntitiesByCompany(job.companyId, 'Quotes').filter(
        (q) => (q.data.customer_id as string) === customerId
    );

    const scheduledDate = job.data.scheduled_date ? new Date(job.data.scheduled_date as string) : null;
    const completedDate = job.data.completed_date ? new Date(job.data.completed_date as string) : null;
    const isOverdue = scheduledDate && scheduledDate < new Date() && job.status !== 'completed' && job.status !== 'cancelled';
    const daysUntilScheduled = scheduledDate ? Math.ceil((scheduledDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-bg">
                <div>
                    <h3 className="text-lg font-semibold text-text-main">{job.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`badge ${job.status === 'completed' ? 'badge-success' : job.status === 'active' ? 'badge-warning' : job.status === 'scheduled' ? 'badge' : 'badge-danger'}`}>
                            {job.status}
                        </span>
                        {job.data.service_type ? (
                            <span className="badge text-[10px]">{String(job.data.service_type)}</span>
                        ) : null}
                        {isOverdue && (
                            <span className="text-[10px] text-danger flex items-center gap-1">
                                Overdue
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {job.data.estimated_cost ? (
                    <div className="card p-4">
                        <div className="flex items-center gap-2 text-text-muted mb-2">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-xs font-medium">Estimated Cost</span>
                        </div>
                        <p className="text-lg font-semibold text-text-main">
                            ${((job.data.estimated_cost as number) || 0).toLocaleString()}
                        </p>
                    </div>
                ) : null}

                {scheduledDate ? (
                    <div className="card p-4">
                        <div className="flex items-center gap-2 text-text-muted mb-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-medium">Scheduled Date</span>
                        </div>
                        <p className={`text-sm font-medium ${isOverdue ? 'text-danger' : 'text-text-main'}`}>
                            {scheduledDate.toLocaleDateString()}
                            {daysUntilScheduled !== null && (
                                <span className={`ml-2 text-[10px] ${daysUntilScheduled < 0 ? 'text-danger' : 'text-text-muted'}`}>
                                    ({daysUntilScheduled < 0 ? `${Math.abs(daysUntilScheduled)} days overdue` : `${daysUntilScheduled} days away`})
                                </span>
                            )}
                        </p>
                    </div>
                ) : null}
            </div>

            {customer ? (
                <div className="card p-4">
                    <h4 className="text-xs font-semibold text-text-main mb-2">Customer</h4>
                    <p className="text-sm text-text-main">{customer.name}</p>
                    {customer.data.email ? (
                        <p className="text-xs text-text-muted">{String(customer.data.email)}</p>
                    ) : null}
                    {customer.data.phone ? (
                        <p className="text-xs text-text-muted">{String(customer.data.phone)}</p>
                    ) : null}
                    {customer.data.address ? (
                        <p className="text-xs text-text-muted mt-1">{String(customer.data.address)}</p>
                    ) : null}
                </div>
            ) : null}

            {job.data.description ? (
                <div className="card p-4">
                    <h4 className="text-xs font-semibold text-text-main mb-2">Description</h4>
                    <p className="text-sm text-text-main whitespace-pre-wrap">{String(job.data.description)}</p>
                </div>
            ) : null}

            <div className="card p-4">
                <h4 className="text-xs font-semibold text-text-main mb-3">Job Timeline</h4>
                <div className="space-y-2 text-xs">
                    {scheduledDate && (
                        <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-text-muted" />
                            <span className="text-text-muted">Scheduled:</span>
                            <span className="text-text-main">{scheduledDate.toLocaleDateString()}</span>
                        </div>
                    )}
                    {job.status === 'active' && (
                        <div className="flex items-center gap-2">
                            <Wrench className="w-3.5 h-3.5 text-warning" />
                            <span className="text-text-muted">Status:</span>
                            <span className="text-warning font-medium">In Progress</span>
                        </div>
                    )}
                    {completedDate && (
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-success" />
                            <span className="text-text-muted">Completed:</span>
                            <span className="text-success font-medium">{completedDate.toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>

            {relatedQuotes.length > 0 && (
                <div className="card p-4">
                    <h4 className="text-xs font-semibold text-text-main mb-3">Related Quotes</h4>
                    <div className="space-y-2">
                        {relatedQuotes.map((q) => (
                            <div key={q.id} className="flex items-center justify-between p-2 bg-bg rounded">
                                <div>
                                    <p className="text-xs font-medium text-text-main">{q.name}</p>
                                    <p className="text-[10px] text-text-muted">
                                        ${((q.data.total_amount as number) || (q.data.totalAmount as number) || 0).toLocaleString()} • {String(q.status)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

