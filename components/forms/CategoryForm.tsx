import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { HashtagIcon } from '../icons/HashtagIcon';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';

interface CategoryFormProps {
  category: Partial<Category> | null;
  onSave: (category: Partial<Category>) => void;
  onCancel: () => void;
}

const initialFormState: Partial<Category> = {
  name: '',
  description: '',
};

export const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Category>>(initialFormState);

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData(initialFormState);
    }
  }, [category]);

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
          Category Name
        </label>
        <Input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1" icon={<HashtagIcon />} />
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
          Save Category
        </Button>
      </div>
    </form>
  );
};