import React, { useState } from 'react';
import { mockSuppliers } from '../../data/mockData';
import { Supplier, Column } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { SupplierForm } from '../../components/forms/SupplierForm';
import { DataTable } from '../../components/ui/DataTable';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Tooltip } from '../../components/ui/Tooltip';

const SupplierMasterPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = (supplierId: string) => {
    setSupplierToDelete(supplierId);
    setIsConfirmModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (supplierToDelete) {
      setSuppliers(suppliers.filter(s => s.id !== supplierToDelete));
    }
    setIsConfirmModalOpen(false);
    setSupplierToDelete(null);
  };

  const handleSave = (supplierData: Partial<Supplier>) => {
    if (editingSupplier) {
      // Edit existing supplier
      setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? { ...s, ...supplierData } as Supplier : s));
    } else {
      // Add new supplier
      const newSupplier: Supplier = {
        id: `SUP${String(suppliers.length + 1).padStart(3, '0')}`, // Create a new unique ID
        name: supplierData.name || '',
        email: supplierData.email || '',
        gstin: supplierData.gstin || '',
        pan: supplierData.pan || '',
        address: supplierData.address || '',
        city: supplierData.city || '',
        state: supplierData.state || '',
        country: supplierData.country || '',
        phone: supplierData.phone || '',
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  const columns: Column<Supplier>[] = [
    { header: 'Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    { header: 'Email', accessor: 'email', sortKey: 'email' },
    { header: 'Phone', accessor: 'phone', sortKey: 'phone' },
    { header: 'GSTIN', accessor: 'gstin', sortKey: 'gstin' },
    { header: 'City', accessor: 'city', sortKey: 'city' },
    {
      header: 'Actions',
      accessor: (row: Supplier) => (
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Supplier Master</h1>
        <Button onClick={handleAddNew}>Add New Supplier</Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={suppliers}
        searchKeys={['name', 'email', 'gstin', 'phone', 'city', 'state']}
        searchPlaceholder="Search Suppliers..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
      >
        <SupplierForm 
          supplier={editingSupplier}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this supplier? This action cannot be undone."
      />
    </div>
  );
};

export default SupplierMasterPage;
