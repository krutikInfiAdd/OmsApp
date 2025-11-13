import React, { useState, useEffect } from 'react';
import { Product, ProductUnit, Category, Subcategory, Tax } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ProductIcon } from '../icons/ProductIcon';
import { HashtagIcon } from '../icons/HashtagIcon';
import { CurrencyRupeeIcon } from '../icons/CurrencyRupeeIcon';

interface ProductFormProps {
  product: Partial<Product> | null;
  categories: Category[];
  subcategories: Subcategory[];
  taxes: Tax[];
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

const initialFormState: Partial<Product> = {
  name: '',
  code: '',
  hsnCode: '',
  unit: 'PCS',
  rate: 0,
  taxId: '',
  categoryId: '',
  subcategoryId: '',
};

const productUnits: ProductUnit[] = ['PCS', 'KG', 'LTR', 'BOX', 'SET'];

export const ProductForm: React.FC<ProductFormProps> = ({ product, categories, subcategories, taxes, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData(initialFormState);
    }
  }, [product]);

  useEffect(() => {
    if (formData.categoryId) {
      setFilteredSubcategories(subcategories.filter(s => s.categoryId === formData.categoryId));
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.categoryId, subcategories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({
      ...prev,
      [name]: isNumber ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      subcategoryId: '', // Reset subcategory when category changes
    }));
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
            Product Name
          </label>
          <Input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1" icon={<ProductIcon />} />
        </div>
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Code
          </label>
          <Input type="text" name="code" id="code" value={formData.code || ''} onChange={handleChange} required className="mt-1" icon={<HashtagIcon />} disabled={true} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="hsnCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            HSN/SAC Code
          </label>
          <Input type="text" name="hsnCode" id="hsnCode" value={formData.hsnCode || ''} onChange={handleChange} required className="mt-1" icon={<HashtagIcon />} disabled={true} />
        </div>
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Unit
          </label>
          <select
            name="unit"
            id="unit"
            value={formData.unit || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {productUnits.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            name="categoryId"
            id="categoryId"
            value={formData.categoryId || ''}
            onChange={handleCategoryChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Subcategory
          </label>
          <select
            name="subcategoryId"
            id="subcategoryId"
            value={formData.subcategoryId || ''}
            onChange={handleChange}
            disabled={!formData.categoryId || filteredSubcategories.length === 0}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-600"
          >
            <option value="">Select Subcategory</option>
            {filteredSubcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Rate (INR)
          </label>
          <Input type="number" name="rate" id="rate" value={formData.rate === 0 ? '' : formData.rate} onChange={handleChange} required className="mt-1" placeholder="0.00" icon={<CurrencyRupeeIcon />} />
        </div>
        <div>
          <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tax Rule
          </label>
          <select
            name="taxId"
            id="taxId"
            value={formData.taxId || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select Tax</option>
            {taxes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Product
        </Button>
      </div>
    </form>
  );
};