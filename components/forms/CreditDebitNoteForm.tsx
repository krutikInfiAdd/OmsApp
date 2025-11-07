import React, { useState, useEffect } from 'react';
import { CreditDebitNote, CreditDebitNoteType, Customer } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface CreditDebitNoteFormProps {
  note: Partial<CreditDebitNote> | null;
  customers: Customer[];
  onSave: (note: Partial<CreditDebitNote>) => void;
  onCancel: () => void;
}

// Fix: The return type was incorrect. It should include `customerId` as the form state uses it.
const initialFormState = (customers: Customer[]): Partial<CreditDebitNote> & { customerId?: string } => ({
  type: CreditDebitNoteType.Credit,
  customerId: customers[0]?.id || '',
  issueDate: new Date().toISOString().split('T')[0],
  amount: 0,
  reason: '',
});

export const CreditDebitNoteForm: React.FC<CreditDebitNoteFormProps> = ({ note, customers, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<CreditDebitNote> & { customerId?: string }>(initialFormState(customers));

  useEffect(() => {
    if (note) {
      setFormData({ ...note, customerId: note.customer?.id });
    } else {
      setFormData(initialFormState(customers));
    }
  }, [note, customers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === formData.customerId);
    if (!customer) {
      alert("Please select a valid customer.");
      return;
    }
    onSave({ ...formData, customer });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Note Type</label>
          <div className="mt-1 flex space-x-4">
            <label className="flex items-center">
              <input type="radio" name="type" value={CreditDebitNoteType.Credit} checked={formData.type === CreditDebitNoteType.Credit} onChange={handleChange} className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300" />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Credit Note</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="type" value={CreditDebitNoteType.Debit} checked={formData.type === CreditDebitNoteType.Debit} onChange={handleChange} className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300" />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Debit Note</span>
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Issue Date</label>
          <Input type="date" name="issueDate" id="issueDate" value={formData.issueDate || ''} onChange={handleChange} required className="mt-1" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer</label>
          <select
            name="customerId"
            id="customerId"
            value={formData.customerId || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select a customer</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
         <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (INR)</label>
          <Input type="number" name="amount" id="amount" value={formData.amount === 0 ? '' : formData.amount} onChange={handleChange} required className="mt-1" placeholder="0.00" min="0.01" step="0.01" />
        </div>
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason</label>
        <textarea
          name="reason"
          id="reason"
          value={formData.reason || ''}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Note</Button>
      </div>
    </form>
  );
};