import React, { useState } from 'react';
import { Tax, Column, TaxType } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { TaxForm } from '../../components/forms/TaxForm';
import { DataTable } from '../../components/ui/DataTable';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Tooltip } from '../../components/ui/Tooltip';
import { useData } from '../../contexts/DataContext';

const TaxMasterPage: React.FC = () => {
  const { taxes, addTax, updateTax, deleteTax } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<Tax | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [taxToDelete, setTaxToDelete] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingTax(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tax: Tax) => {
    setEditingTax(tax);
    setIsModalOpen(true);
  };

  const handleDelete = (taxId: string) => {
    setTaxToDelete(taxId);
    setIsConfirmModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (taxToDelete) {
      deleteTax(taxToDelete);
    }
    setIsConfirmModalOpen(false);
    setTaxToDelete(null);
  };

  const handleSave = (taxData: Partial<Tax>) => {
    if (editingTax) {
      updateTax(editingTax.id, taxData);
    } else {
      addTax(taxData);
    }
    setIsModalOpen(false);
    setEditingTax(null);
  };

  const columns: Column<Tax>[] = [
    { header: 'Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    { header: 'Type', accessor: 'type', sortKey: 'type' },
    { header: 'Rate', accessor: (row) => `${row.rate}%`, sortKey: 'rate' },
    { header: 'Description', accessor: (row) => row.description || '-', sortKey: 'description' },
    {
      header: 'Actions',
      accessor: (row: Tax) => (
        <div className="flex space-x-1">
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tax Master</h1>
        <Button onClick={handleAddNew}>Add New Tax Rule</Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={taxes}
        searchKeys={['name', 'type', 'description']}
        searchPlaceholder="Search by Name, Type, or Description..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTax ? 'Edit Tax Rule' : 'Add New Tax Rule'}
      >
        <TaxForm 
          tax={editingTax}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this tax rule? This action cannot be undone."
      />
    </div>
  );
};

export default TaxMasterPage;