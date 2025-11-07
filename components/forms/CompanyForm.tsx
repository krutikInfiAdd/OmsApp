import React, { useState, useEffect } from 'react';
import { Company } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface CompanyFormProps {
  company: Partial<Company> | null;
  onSave: (company: Partial<Company>) => void;
  onCancel: () => void;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({ company, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    gstin: '',
    pan: '',
    address: '',
    email: '',
    phone: '',
    state: '',
    country: '',
  });

  useEffect(() => {
    if (company) {
      setFormData(company);
    } else {
      setFormData({ name: '', gstin: '', pan: '', address: '', email: '', phone: '', state: '', country: '' });
    }
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Company Name
        </label>
        <Input
          type="text"
          name="name"
          id="name"
          value={formData.name || ''}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
       <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Address
        </label>
        <textarea
          name="address"
          id="address"
          value={formData.address || ''}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <Input
            type="email"
            name="email"
            id="email"
            value={formData.email || ''}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone
          </label>
          <Input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            State
          </label>
          <Input
            type="text"
            name="state"
            id="state"
            value={formData.state || ''}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Country
          </label>
          <Input
            type="text"
            name="country"
            id="country"
            value={formData.country || ''}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="gstin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            GSTIN
            </label>
            <Input
            type="text"
            name="gstin"
            id="gstin"
            value={formData.gstin || ''}
            onChange={handleChange}
            required
            className="mt-1"
            minLength={15}
            maxLength={15}
            />
        </div>
        <div>
            <label htmlFor="pan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            PAN
            </label>
            <Input
            type="text"
            name="pan"
            id="pan"
            value={formData.pan || ''}
            onChange={handleChange}
            required
            className="mt-1"
            minLength={10}
            maxLength={10}
            />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Company
        </Button>
      </div>
    </form>
  );
};