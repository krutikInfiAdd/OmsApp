import { User, UserRole } from '../types';
import { mockCompanies } from './mockData';

// In a real app, passwords should be securely hashed.
// For this demo, we'll use plain text.
export let mockUsers: User[] = [
  {
    id: 'U001',
    name: 'Admin User',
    email: 'admin@zenith.com',
    password: 'password123',
    companyId: mockCompanies[0].id,
    role: UserRole.Admin,
  },
  {
    id: 'U002',
    name: 'Jane Doe',
    email: 'jane@globaltech.com',
    password: 'password456',
    companyId: mockCompanies[1].id,
    role: UserRole.Sales,
  },
   {
    id: 'U001',
    name: 'Admin User',
    email: 'SuperAdminInfi@yopmail.com',
    password: 'Adm!n123',
    companyId: mockCompanies[0].id,
    role: UserRole.Admin,
  },
];

export const addUser = (user: Omit<User, 'id'>): User => {
  const newUser: User = {
    id: `U${String(mockUsers.length + 1).padStart(3, '0')}`,
    ...user,
  };
  mockUsers.push(newUser);
  return newUser;
};

export const setMockUsers = (newUsers: User[]) => {
  mockUsers = newUsers;
};