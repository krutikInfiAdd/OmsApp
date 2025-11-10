import React, { useState, useEffect } from 'react';
import { Supplier } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { UserIcon } from '../icons/UserIcon';
import { MailIcon } from '../icons/MailIcon';
import { PhoneIcon } from '../icons/PhoneIcon';
import { LocationMarkerIcon } from '../icons/LocationMarkerIcon';
import { IdentificationIcon } from '../icons/IdentificationIcon';

interface SupplierFormProps {
  supplier: Partial<Supplier> | null;
  onSave: (supplier: Partial<Supplier>) => void;
  onCancel: () => void;
}

const initialFormState: Partial<Supplier> = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  gstin: '',
  pan: '',
};

export const SupplierForm: React.FC<SupplierFormProps> = ({ supplier, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Supplier>>(initialFormState);

  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    } else {
      setFormData(initialFormState);
    }
  }, [supplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Supplier Name
          </label>
          <Input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1" icon={<UserIcon />} />
        </div>
         <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone
          </label>
          <Input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} required className="mt-1" icon={<PhoneIcon />} />
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
        </label>
        <Input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} required className="mt-1" icon={<MailIcon />} />
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
          className="mt-1"
          icon={<LocationMarkerIcon />}
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
          <label htmlFor="pan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            PAN
          </label>
          <Input type="text" name="pan" id="pan" value={formData.pan || ''} onChange={handleChange} required className="mt-1" minLength={10} maxLength={10} icon={<IdentificationIcon />} />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Supplier
        </Button>
      </div>
    </form>
  );
};