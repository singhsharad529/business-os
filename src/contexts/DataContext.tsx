import React, { createContext, useContext, useState } from 'react';
import type { Company, Entity, Activity, Alert } from '../types';
import { mockCompanies, mockEntities, mockActivities, mockAlerts } from '../data/mockData';

interface DataContextType {
  companies: Company[];
  entities: Entity[];
  activities: Activity[];
  alerts: Alert[];
  getCompany: (id: string) => Company | undefined;
  getEntitiesByCompany: (companyId: string, templateName?: string) => Entity[];
  getAllEntitiesByName: (templateName?: string) => Entity[];
  getEntity: (id: string) => Entity | undefined;
  getActivitiesForEntity: (entityId: string) => Activity[];
  getAlertsByCompany: (companyId: string) => Alert[];
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  createEntity: (entity: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>) => Entity;
  deleteEntity: (id: string) => void;
  createCompany: (company: Omit<Company, 'id' | 'createdAt'>) => Company;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [entities, setEntities] = useState<Entity[]>(mockEntities);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const getCompany = (id: string) => companies.find((c) => c.id === id);

  const getEntitiesByCompany = (companyId: string, templateName?: string) => {
    return entities.filter(
      (e) => e.companyId === companyId && (!templateName || e.templateName === templateName)
    );
  };

  const getAllEntitiesByName = (templateName?: string) => {
    return entities.filter(
      (e) => !templateName || e.templateName === templateName
    );
  };

  const getEntity = (id: string) => entities.find((e) => e.id === id);

  const getActivitiesForEntity = (entityId: string) =>
    activities.filter((a) => a.entityId === entityId).sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  const getAlertsByCompany = (companyId: string) => {
    const companyEntityIds = entities
      .filter((e) => e.companyId === companyId)
      .map((e) => e.id);
    return alerts
      .filter((a) => !a.entityId || companyEntityIds.includes(a.entityId))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const updateEntity = (id: string, updates: Partial<Entity>) => {
    setEntities((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, ...updates, updatedAt: new Date().toISOString() }
          : e
      )
    );
  };

  const createEntity = (entity: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>): Entity => {
    const newEntity: Entity = {
      ...entity,
      id: `e-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEntities((prev) => [...prev, newEntity]);
    return newEntity;
  };

  const deleteEntity = (id: string) => {
    setEntities((prev) => prev.filter((e) => e.id !== id));
  };

  const createCompany = (company: Omit<Company, 'id' | 'createdAt'>): Company => {
    const newCompany: Company = {
      ...company,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCompanies((prev) => [...prev, newCompany]);
    return newCompany;
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCompany = (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        companies,
        entities,
        activities,
        alerts,
        getCompany,
        getEntitiesByCompany,
        getAllEntitiesByName,
        getEntity,
        getActivitiesForEntity,
        getAlertsByCompany,
        updateEntity,
        createEntity,
        deleteEntity,
        createCompany,
        updateCompany,
        deleteCompany,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
