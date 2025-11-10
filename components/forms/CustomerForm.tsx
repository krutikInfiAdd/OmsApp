import React, { useState, useEffect } from 'react';
import { Customer, Company } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { UserIcon } from '../icons/UserIcon';
import { MailIcon } from '../icons/MailIcon';
import { PhoneIcon } from '../icons/PhoneIcon';
import { LocationMarkerIcon } from '../icons/LocationMarkerIcon';
import { IdentificationIcon } from '../icons/IdentificationIcon';
import { CurrencyRupeeIcon } from '../icons/CurrencyRupeeIcon';

interface CustomerFormProps {
  customer: Partial<Customer> | null;
  onSave: (customer: Partial<Customer>) => void;
  onCancel: () => void;
  companies: Company[];
}

const initialFormState = (companies: Company[]): Partial<Customer> => ({
  name: '',
  email: '',
  gstin: '',
  companyId: companies[0]?.id || '',
  mobile: '',
  address: '',
  city: '',
  state: '',
  country: '',
  creditLimit: 0,
});


export const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSave, onCancel, companies }) => {
  const [formData, setFormData] = useState<Partial<Customer>>(initialFormState(companies));

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    } else {
      setFormData(initialFormState(companies));
    }
  }, [customer, companies]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Customer Name
          </label>
          <Input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1" icon={<UserIcon />} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <Input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} required className="mt-1" icon={<MailIcon />} />
        </div>
        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mobile
          </label>
          <Input type="tel" name="mobile" id="mobile" value={formData.mobile || ''} onChange={handleChange} required className="mt-1" icon={<PhoneIcon />} />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Address
        </label>
        <Textarea
          name="address"
          id="address"
          value={formData.address || ''}
          onChange={handleChange}
          rows={3}
          icon={<LocationMarkerIcon />}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
          <Input type="text" name="city" id="city" value={formData.city || ''} onChange={handleChange} className="mt-1" icon={<LocationMarkerIcon />} />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
          <Input type="text" name="state" id="state" value={formData.state || ''} onChange={handleChange} className="mt-1" icon={<LocationMarkerIcon />} />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
          <Input type="text" name="country" id="country" value={formData.country || ''} onChange={handleChange} className="mt-1" icon={<LocationMarkerIcon />} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="gstin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            GSTIN
          </label>
          <Input type="text" name="gstin" id="gstin" value={formData.gstin || ''} onChange={handleChange} required className="mt-1" minLength={15} maxLength={15} icon={<IdentificationIcon />} />
        </div>
        <div>
          <label htmlFor="creditLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Credit Limit (INR)
          </label>
          <Input type="number" name="creditLimit" id="creditLimit" value={formData.creditLimit === 0 ? '' : formData.creditLimit} onChange={handleChange} required className="mt-1" icon={<CurrencyRupeeIcon />} />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Customer
        </Button>
      </div>
    </form>
  );
};