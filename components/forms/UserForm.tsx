import React, { useState, useEffect } from 'react';
import { User, UserRole, Company } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface UserFormProps {
  user: Partial<User> | null;
  companies: Company[];
  onSave: (user: Partial<User>) => void;
  onCancel: () => void;
}

const initialFormState = (companies: Company[]): Partial<User> => ({
  name: '',
  email: '',
  password: '',
  companyId: companies[0]?.id || '',
  role: UserRole.Sales,
});

export const UserForm: React.FC<UserFormProps> = ({ user, companies, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<User>>(initialFormState(companies));
  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      // Don't pre-fill password for editing
      setFormData({ ...user, password: '' });
    } else {
      setFormData(initialFormState(companies));
    }
  }, [user, companies]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Don't save an empty password string unless it's a new user and it's empty
    const dataToSave = { ...formData };
    if (isEditing && !dataToSave.password) {
      delete dataToSave.password;
    }
    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <Input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <Input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} required className="mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Company
          </label>
          <select
            name="companyId"
            id="companyId"
            value={formData.companyId || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Role
          </label>
          <select
            name="role"
            id="role"
            value={formData.role || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {Object.values(UserRole).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <Input 
          type="password" 
          name="password" 
          id="password" 
          value={formData.password || ''} 
          onChange={handleChange} 
          required={!isEditing}
          className="mt-1" 
          placeholder={isEditing ? 'Leave blank to keep current password' : 'Enter password'}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save User
        </Button>
      </div>
    </form>
  );
};