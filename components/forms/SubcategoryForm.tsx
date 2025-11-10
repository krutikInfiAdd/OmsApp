import React, { useState, useEffect } from 'react';
import { Subcategory, Category } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { HashtagIcon } from '../icons/HashtagIcon';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';

interface SubcategoryFormProps {
  subcategory: Partial<Subcategory> | null;
  categories: Category[];
  onSave: (subcategory: Partial<Subcategory>) => void;
  onCancel: () => void;
}

const initialFormState = (categories: Category[]): Partial<Subcategory> => ({
  name: '',
  categoryId: categories[0]?.id || '',
  description: '',
});

export const SubcategoryForm: React.FC<SubcategoryFormProps> = ({ subcategory, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Subcategory>>(initialFormState(categories));

  useEffect(() => {
    if (subcategory) {
      setFormData(subcategory);
    } else {
      setFormData(initialFormState(categories));
    }
  }, [subcategory, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Parent Category
          </label>
          <select
            name="categoryId"
            id="categoryId"
            value={formData.categoryId || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="" disabled>Select a category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Subcategory Name
          </label>
          <Input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1" icon={<HashtagIcon />} />
        </div>
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
          Save Subcategory
        </Button>
      </div>
    </form>
  );
};