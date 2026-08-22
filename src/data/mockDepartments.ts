import { Department } from '../types/request';

export interface DepartmentMeta {
  name: Department;
  lead: string;
  totalEngineers: number;
  activeTickets: number;
  complianceRate: number;
  averageResolutionHours: number;
  color: string;
  iconName: string;
}

export const MOCK_DEPARTMENTS: DepartmentMeta[] = [
  {
    name: 'DevOps & Cloud',
    lead: 'Sarah Connor',
    totalEngineers: 8,
    activeTickets: 14,
    complianceRate: 98.4,
    averageResolutionHours: 2.1,
    color: 'from-blue-500 to-indigo-600',
    iconName: 'Cloud',
  },
  {
    name: 'IT Infrastructure',
    lead: 'Marcus Vance',
    totalEngineers: 6,
    activeTickets: 19,
    complianceRate: 88.2, // Under pressure
    averageResolutionHours: 4.8,
    color: 'from-amber-500 to-orange-600',
    iconName: 'Server',
  },
  {
    name: 'Core Engineering',
    lead: 'David Kim',
    totalEngineers: 12,
    activeTickets: 22,
    complianceRate: 94.6,
    averageResolutionHours: 6.5,
    color: 'from-violet-500 to-purple-600',
    iconName: 'Code',
  },
  {
    name: 'Cybersecurity',
    lead: 'Elena Rostova',
    totalEngineers: 5,
    activeTickets: 9,
    complianceRate: 99.1,
    averageResolutionHours: 1.4,
    color: 'from-rose-500 to-red-600',
    iconName: 'ShieldAlert',
  },
  {
    name: 'Billing & Finance',
    lead: 'Priya Sharma',
    totalEngineers: 4,
    activeTickets: 7,
    complianceRate: 97.0,
    averageResolutionHours: 3.2,
    color: 'from-emerald-500 to-teal-600',
    iconName: 'CreditCard',
  },
  {
    name: 'Customer Operations',
    lead: 'Michael Chang',
    totalEngineers: 9,
    activeTickets: 16,
    complianceRate: 95.8,
    averageResolutionHours: 2.9,
    color: 'from-cyan-500 to-blue-600',
    iconName: 'Users',
  },
];
