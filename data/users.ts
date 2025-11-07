import { User } from '../types';
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
  },
  {
    id: 'U002',
    name: 'Jane Doe',
    email: 'jane@globaltech.com',
    password: 'password456',
    companyId: mockCompanies[1].id,
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
