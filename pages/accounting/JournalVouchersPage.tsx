import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { JournalVoucher, Column, Account } from '../../types';
import { useData } from '../../contexts/DataContext';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { JournalVoucherForm } from '../../components/forms/JournalVoucherForm';
import { Tooltip } from '../../components/ui/Tooltip';
import { EyeIcon } from '../../components/icons/EyeIcon';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';

const JournalVouchersPage: React.FC = () => {
  const { journalVouchers, chartOfAccounts, addJournalVoucher, updateJournalVoucher, deleteJournalVoucher } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<JournalVoucher | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingVoucher(null);
    setIsModalOpen(true);
  };

  const handleEdit = (voucher: JournalVoucher) => {
    setEditingVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleDelete = (voucherId: string) => {
    setVoucherToDelete(voucherId);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (voucherToDelete) {
      deleteJournalVoucher(voucherToDelete);
    }
    setIsConfirmModalOpen(false);
    setVoucherToDelete(null);
  };

  const handleSave = (voucherData: Partial<JournalVoucher>) => {
    if (editingVoucher) {
      updateJournalVoucher(editingVoucher.id, voucherData);
    } else {
      addJournalVoucher(voucherData);
    }
    setIsModalOpen(false);
    setEditingVoucher(null);
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const calculateTotal = (voucher: JournalVoucher) => {
    return voucher.entries.reduce((sum, entry) => sum + entry.debit, 0);
  };

  const columns: Column<JournalVoucher>[] = [
    { header: 'Voucher #', accessor: (row) => <span className="font-medium text-primary-600 dark:text-primary-400">{row.voucherNumber}</span>, sortKey: 'voucherNumber' },
    { header: 'Date', accessor: 'date', sortKey: 'date' },
    { header: 'Narration', accessor: 'narration', sortKey: 'narration' },
    { header: 'Amount', accessor: (row) => <span className="font-semibold">{formatCurrency(calculateTotal(row))}</span>, sortKey: 'entries' as any },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex space-x-1">
          <Tooltip text="View">
            <NavLink to={`/accounting/journal/view/${row.id}`} className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <EyeIcon className="h-4 w-4" />
            </NavLink>
          </Tooltip>
          <Tooltip text="Edit">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
              <PencilIcon className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip text="Delete">
            <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)} className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50">
              <TrashIcon className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Journal Vouchers</h1>
        <Button onClick={handleAddNew}>Create New Voucher</Button>
      </div>
      <DataTable 
        columns={columns} 
        data={journalVouchers} 
        searchKeys={['voucherNumber', 'narration']}
        searchPlaceholder="Search by Voucher # or Narration..."
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingVoucher ? 'Edit Journal Voucher' : 'Create New Journal Voucher'}>
        <JournalVoucherForm
          voucher={editingVoucher}
          accounts={chartOfAccounts}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this journal voucher? This action cannot be undone."
      />
    </div>
  );
};

export default JournalVouchersPage;
