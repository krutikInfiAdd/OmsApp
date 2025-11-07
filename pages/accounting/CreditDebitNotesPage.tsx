import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CreditDebitNote, Column, CreditDebitNoteType, CreditDebitNoteStatus } from '../../types';
import { useData } from '../../contexts/DataContext';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { CreditDebitNoteForm } from '../../components/forms/CreditDebitNoteForm';
import { Badge } from '../../components/ui/Badge';
import { Tooltip } from '../../components/ui/Tooltip';
import { EyeIcon } from '../../components/icons/EyeIcon';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';

const NoteTypeBadge: React.FC<{ type: CreditDebitNoteType }> = ({ type }) => {
  const isCredit = type === CreditDebitNoteType.Credit;
  const classes = isCredit
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>{type} Note</span>;
};

const CreditDebitNotesPage: React.FC = () => {
  const { creditDebitNotes, customers, addCreditDebitNote, updateCreditDebitNote, deleteCreditDebitNote } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<CreditDebitNote | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEdit = (note: CreditDebitNote) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleDelete = (noteId: string) => {
    setNoteToDelete(noteId);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      deleteCreditDebitNote(noteToDelete);
    }
    setIsConfirmModalOpen(false);
    setNoteToDelete(null);
  };

  const handleSave = (noteData: Partial<CreditDebitNote>) => {
    if (editingNote) {
      updateCreditDebitNote(editingNote.id, { ...noteData, status: CreditDebitNoteStatus.Issued });
    } else {
      addCreditDebitNote({ ...noteData, status: CreditDebitNoteStatus.Issued });
    }
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const columns: Column<CreditDebitNote>[] = [
    { header: 'Note #', accessor: (row) => <span className="font-medium text-primary-600 dark:text-primary-400">{row.noteNumber}</span>, sortKey: 'noteNumber' },
    { header: 'Type', accessor: (row) => <NoteTypeBadge type={row.type} />, sortKey: 'type' },
    { header: 'Customer', accessor: (row) => row.customer.name, sortKey: 'customer.name' as any },
    { header: 'Date', accessor: 'issueDate', sortKey: 'issueDate' },
    { header: 'Amount', accessor: (row) => <span className="font-semibold">{formatCurrency(row.amount)}</span>, sortKey: 'amount' },
    { header: 'Status', accessor: (row) => <Badge status={row.status} />, sortKey: 'status' },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex space-x-1">
          <Tooltip text="View">
            <NavLink to={`/accounting/credit-debit-notes/view/${row.id}`} className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Credit/Debit Notes</h1>
        <Button onClick={handleAddNew}>Create New Note</Button>
      </div>
      <DataTable 
        columns={columns} 
        data={creditDebitNotes} 
        searchKeys={['noteNumber', 'customer.name', 'reason']}
        searchPlaceholder="Search by Note #, Customer, Reason..."
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingNote ? 'Edit Note' : 'Create New Note'}>
        <CreditDebitNoteForm
          note={editingNote}
          customers={customers}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this note? This action cannot be undone."
      />
    </div>
  );
};

export default CreditDebitNotesPage;
