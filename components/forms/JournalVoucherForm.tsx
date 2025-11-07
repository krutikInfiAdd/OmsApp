import React, { useState, useEffect, useMemo } from 'react';
import { JournalVoucher, JournalVoucherEntry, Account } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { TrashIcon } from '../icons/TrashIcon';

interface JournalVoucherFormProps {
  voucher: Partial<JournalVoucher> | null;
  accounts: Account[];
  onSave: (voucher: Partial<JournalVoucher>) => void;
  onCancel: () => void;
}

const initialFormState: Partial<JournalVoucher> = {
  date: new Date().toISOString().split('T')[0],
  narration: '',
  entries: [
    { accountId: '', debit: 0, credit: 0 },
    { accountId: '', debit: 0, credit: 0 },
  ],
};

export const JournalVoucherForm: React.FC<JournalVoucherFormProps> = ({ voucher, accounts, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<JournalVoucher>>(initialFormState);

  useEffect(() => {
    if (voucher) {
      setFormData(voucher);
    } else {
      setFormData(initialFormState);
    }
  }, [voucher]);

  const { totalDebit, totalCredit, isBalanced } = useMemo(() => {
    const totals = formData.entries?.reduce(
      (acc, entry) => {
        acc.debit += Number(entry.debit) || 0;
        acc.credit += Number(entry.credit) || 0;
        return acc;
      },
      { debit: 0, credit: 0 }
    ) || { debit: 0, credit: 0 };

    return {
      totalDebit: totals.debit,
      totalCredit: totals.credit,
      isBalanced: totals.debit === totals.credit && totals.debit > 0,
    };
  }, [formData.entries]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEntryChange = (index: number, field: keyof JournalVoucherEntry, value: any) => {
    const newEntries = [...(formData.entries || [])];
    const entry = { ...newEntries[index], [field]: value };

    // Ensure only one of debit or credit has a value
    if (field === 'debit' && Number(value) > 0) entry.credit = 0;
    if (field === 'credit' && Number(value) > 0) entry.debit = 0;

    newEntries[index] = entry;
    setFormData(prev => ({ ...prev, entries: newEntries }));
  };

  const addEntry = () => {
    const newEntries = [...(formData.entries || []), { accountId: '', debit: 0, credit: 0 }];
    setFormData(prev => ({ ...prev, entries: newEntries }));
  };

  const removeEntry = (index: number) => {
    const newEntries = (formData.entries || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, entries: newEntries }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) {
      alert("Total debits must equal total credits.");
      return;
    }
    const finalVoucher = {
      ...formData,
      entries: formData.entries?.filter(e => e.accountId && (e.debit > 0 || e.credit > 0)),
    };
    onSave(finalVoucher);
  };
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <Input type="date" name="date" id="date" value={formData.date || ''} onChange={handleChange} required className="mt-1" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Entries</label>
        <div className="mt-1 space-y-2">
          {formData.entries?.map((entry, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5">
                <select
                  value={entry.accountId}
                  onChange={(e) => handleEntryChange(index, 'accountId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Account</option>
                  {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
              </div>
              <div className="col-span-3">
                <Input type="number" placeholder="Debit" value={entry.debit || ''} onChange={e => handleEntryChange(index, 'debit', e.target.value)} min="0" step="0.01" />
              </div>
              <div className="col-span-3">
                <Input type="number" placeholder="Credit" value={entry.credit || ''} onChange={e => handleEntryChange(index, 'credit', e.target.value)} min="0" step="0.01" />
              </div>
              <div className="col-span-1">
                {formData.entries && formData.entries.length > 2 && (
                   <Button type="button" variant="ghost" size="sm" onClick={() => removeEntry(index)} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50">
                     <TrashIcon className="h-4 w-4" />
                   </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addEntry}>Add Line</Button>
      </div>

       <div className="flex justify-end pr-10">
          <div className="w-full max-w-xs space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold">Total Debit:</span>
              <span>{formatCurrency(totalDebit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total Credit:</span>
              <span>{formatCurrency(totalCredit)}</span>
            </div>
            {!isBalanced && totalDebit + totalCredit > 0 && (
                <p className="text-xs text-red-500 text-right">Totals do not match.</p>
            )}
          </div>
        </div>

      <div>
        <label htmlFor="narration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Narration</label>
        <textarea
          name="narration"
          id="narration"
          value={formData.narration || ''}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={!isBalanced}>Save Voucher</Button>
      </div>
    </form>
  );
};
