export type UserRole = 'CLIENT' | 'ADMIN' | 'AGENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  department?: string;
  company?: string;
  activeTicketsCount?: number;
  maxCapacity?: number;
  skills?: string[];
  isAvailable?: boolean;
}
