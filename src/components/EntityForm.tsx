import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import type { Entity } from '../types';

interface EntityFormProps {
  templateName: string;
  entity?: Entity;
  onSave: () => void;
  onCancel: () => void;
}

export function EntityForm({ templateName, entity, onSave, onCancel }: EntityFormProps) {
  const { user } = useAuth();
  const { createEntity, updateEntity } = useData();

  const [formData, setFormData] = useState<Record<string, any>>(
    entity?.data || getDefaultFields(templateName)
  );
  const [name, setName] = useState(entity?.name || '');
  const [status, setStatus] = useState(entity?.status || 'draft');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (entity) {
      updateEntity(entity.id, {
        name,
        status: status as any,
        data: formData,
      });
    } else if (user?.companyId) {
      createEntity({
        companyId: user.companyId,
        templateId: templateName.toLowerCase(),
        templateName,
        name,
        status: status as any,
        createdBy: user.id,
        data: formData,
      });
    }

    onSave();
  };

  const fields = getFieldsForTemplate(templateName);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-text-main mb-1">
          Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          required
          placeholder={`Enter ${templateName.slice(0, -1).toLowerCase()} name`}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-main mb-1">
          Status <span className="text-danger">*</span>
        </label>
        <select
          value={status}
          onChange={(e: any) => setStatus(e.target.value)}
          className="input"
          required
        >
          {getStatusOptions(templateName).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-xs font-medium text-text-main mb-1">
            {field.label} {field.required && <span className="text-danger">*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              value={formData[field.name] || ''}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              className="input min-h-[80px]"
              required={field.required}
              placeholder={field.placeholder}
            />
          ) : field.type === 'select' ? (
            <select
              value={formData[field.name] || ''}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              className="input"
              required={field.required}
            >
              <option value="">Select...</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : field.type === 'date' ? (
            <DatePicker
              selected={formData[field.name] ? new Date(formData[field.name]) : null}
              onChange={(date) => setFormData({ ...formData, [field.name]: date ? date.toISOString().split('T')[0] : '' })}
              className="input w-full"
              required={field.required}
              placeholderText={field.placeholder}
              dateFormat="MM/dd/yyyy"
            />
          ) : (
            <input
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => setFormData({ ...formData, [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
              className="input"
              required={field.required}
              placeholder={field.placeholder}
            />
          )}
        </div>
      ))}

      <div className="flex gap-2 pt-4">
        <button type="submit" className="btn btn-primary flex-1">
          {entity ? 'Update' : 'Create'} {templateName.slice(0, -1)}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}

function getDefaultFields(templateName: string): Record<string, any> {
  const defaults: Record<string, any> = {
    Vendors: { contactPerson: '', email: '', phone: '', leadTime: 30, reliabilityScore: 85 },
    Quotes: { amount: 0, items: '', validUntil: '', deliveryDate: '' },
    Invoices: { amount: 0, dueDate: '', issueDate: new Date().toISOString().split('T')[0] },
    Borrowers: { email: '', phone: '', creditScore: 700, address: '', employmentStatus: 'Employed', annualIncome: 0 },
    Loans: { principal: 0, interestRate: 5.0, term: 60, startDate: '', maturityDate: '', monthlyPayment: 0 },
    Customers: { email: '', phone: '', address: '', propertyType: 'Single Family Home', serviceHistory: 0 },
    Jobs: { scheduledDate: '', assignedTo: '', estimatedDuration: '' },
    Contacts: { email: '', phone: '', title: '', department: '', category: '' }, // add this
  };
  return defaults[templateName] || {};
}

function getFieldsForTemplate(templateName: string) {
  const fields: Record<string, any[]> = {
    Vendors: [
      { name: 'contactPerson', label: 'Contact Person', type: 'text', required: true, placeholder: 'John Doe' },
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'contact@vendor.com' },
      { name: 'phone', label: 'Phone', type: 'tel', required: false, placeholder: '+1-555-0000' },
      { name: 'leadTime', label: 'Lead Time (days)', type: 'number', required: false, placeholder: '30' },
      { name: 'reliabilityScore', label: 'Reliability Score', type: 'number', required: false, placeholder: '85' },
      { name: 'paymentTerms', label: 'Payment Terms', type: 'select', required: false, options: ['Net 15', 'Net 30', 'Net 60', 'Net 90'] },
      { name: 'category', label: 'Category', type: 'text', required: false, placeholder: 'Raw Materials' },
    ],
    Quotes: [
      { name: 'amount', label: 'Amount', type: 'number', required: true, placeholder: '0' },
      { name: 'items', label: 'Items', type: 'textarea', required: true, placeholder: 'Describe items...' },
      { name: 'validUntil', label: 'Valid Until', type: 'date', required: true },
      { name: 'deliveryDate', label: 'Delivery Date', type: 'date', required: false },
    ],
    Invoices: [
      { name: 'amount', label: 'Amount', type: 'number', required: true, placeholder: '0' },
      { name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
      { name: 'dueDate', label: 'Due Date', type: 'date', required: true },
    ],
    Borrowers: [
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'borrower@email.com' },
      { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '+1-555-0000' },
      { name: 'creditScore', label: 'Credit Score', type: 'number', required: false, placeholder: '700' },
      { name: 'address', label: 'Address', type: 'text', required: true, placeholder: '123 Main St, City, State ZIP' },
      { name: 'employmentStatus', label: 'Employment Status', type: 'select', required: true, options: ['Employed', 'Self-Employed', 'Unemployed', 'Retired'] },
      { name: 'annualIncome', label: 'Annual Income', type: 'number', required: true, placeholder: '0' },
    ],
    Loans: [
      { name: 'principal', label: 'Principal Amount', type: 'number', required: true, placeholder: '0' },
      { name: 'interestRate', label: 'Interest Rate (%)', type: 'number', required: true, placeholder: '5.0' },
      { name: 'term', label: 'Term (months)', type: 'number', required: true, placeholder: '60' },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { name: 'maturityDate', label: 'Maturity Date', type: 'date', required: true },
      { name: 'monthlyPayment', label: 'Monthly Payment', type: 'number', required: false, placeholder: '0' },
    ],
    Customers: [
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'customer@email.com' },
      { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '+1-555-0000' },
      { name: 'address', label: 'Address', type: 'text', required: true, placeholder: '123 Main St, City, State ZIP' },
      { name: 'propertyType', label: 'Property Type', type: 'select', required: false, options: ['Single Family Home', 'Condo', 'Townhouse', 'Multi-Family', 'Commercial'] },
      { name: 'serviceHistory', label: 'Service History', type: 'number', required: false, placeholder: '0' },
    ],
    Jobs: [
      { name: 'serviceType', label: 'Service Type', type: 'text', required: true, placeholder: 'Kitchen Renovation' },
      { name: 'scheduledDate', label: 'Scheduled Date', type: 'date', required: true },
      { name: 'assignedTo', label: 'Assigned To', type: 'text', required: false, placeholder: 'Crew A' },
      { name: 'estimatedDuration', label: 'Estimated Duration', type: 'text', required: false, placeholder: '2 weeks' },
    ],
    Contacts: [ // add this
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'contact@email.com' },
      { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '+1-555-0000' },
      { name: 'title', label: 'Title', type: 'text', required: false, placeholder: 'Procurement Lead' },
      { name: 'department', label: 'Department', type: 'text', required: false, placeholder: 'Sourcing' },
      { name: 'category', label: 'Category', type: 'text', required: false, placeholder: 'Procurement' },
    ],
  };
  return fields[templateName] || [];
}

function getStatusOptions(templateName: string) {
  const statuses: Record<string, string[]> = {
    Vendors: ['active', 'inactive'],
    Quotes: ['draft', 'sent', 'accepted', 'rejected'],
    Invoices: ['pending', 'paid', 'overdue'],
    Borrowers: ['active', 'inactive'],
    Loans: ['pending', 'active', 'closed', 'delinquent'],
    Customers: ['active', 'inactive'],
    Jobs: ['draft', 'scheduled', 'in_progress', 'completed', 'cancelled'],
    Contacts: ['active', 'inactive'], // add this
  };
  return statuses[templateName] || ['draft', 'active', 'closed'];
}
