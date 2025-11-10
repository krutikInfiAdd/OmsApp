import React, { useState, useEffect } from 'react';
import { Tax, TaxType } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { IdentificationIcon } from '../icons/IdentificationIcon';
import { CurrencyRupeeIcon } from '../icons/CurrencyRupeeIcon';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';

interface TaxFormProps {
  tax: Partial<Tax> | null;
  onSave: (tax: Partial<Tax>) => void;
  onCancel: () => void;
}

const initialFormState: Partial<Tax> = {
  name: '',
  type: TaxType.GST,
  rate: 0,
  description: '',
};

export const TaxForm: React.FC<TaxFormProps> = ({ tax, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Tax>>(initialFormState);

  useEffect(() => {
    if (tax) {
      setFormData(tax);
    } else {
      setFormData(initialFormState);
    }
  }, [tax]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tax Name
          </label>
          <Input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1" icon={<IdentificationIcon />} />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tax Type
          </label>
          <select
            name="type"
            id="type"
            value={formData.type || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {Object.values(TaxType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Rate (%)
        </label>
        <Input 
          type="number" 
          name="rate" 
          id="rate" 
          value={formData.rate === 0 ? '' : formData.rate} 
          onChange={handleChange} 
          required 
          className="mt-1" 
          placeholder="e.g., 18"
          step="0.01"
          icon={<CurrencyRupeeIcon />}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <Textarea
          name="description"
          id="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          className="mt-1"
          icon={<DocumentTextIcon />}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Tax Rule
        </Button>
      </div>
    </form>
  );
};