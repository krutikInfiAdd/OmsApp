import React, { useState } from 'react';
import { Vendor, Column } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { VendorForm } from '../../components/forms/VendorForm';
import { DataTable } from '../../components/ui/DataTable';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Tooltip } from '../../components/ui/Tooltip';
import { useData } from '../../contexts/DataContext';

const VendorMasterPage: React.FC = () => {
  const { vendors, addVendor, updateVendor, deleteVendor } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingVendor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setIsModalOpen(true);
  };

  const handleDelete = (vendorId: string) => {
    setVendorToDelete(vendorId);
    setIsConfirmModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (vendorToDelete) {
      deleteVendor(vendorToDelete);
    }
    setIsConfirmModalOpen(false);
    setVendorToDelete(null);
  };

  const handleSave = (vendorData: Partial<Vendor>) => {
    if (editingVendor) {
      updateVendor(editingVendor.id, vendorData);
    } else {
      addVendor(vendorData);
    }
    setIsModalOpen(false);
    setEditingVendor(null);
  };

  const columns: Column<Vendor>[] = [
    { header: 'Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    { header: 'Email', accessor: 'email', sortKey: 'email' },
    { header: 'Phone', accessor: 'phone', sortKey: 'phone' },
    { header: 'GSTIN', accessor: 'gstin', sortKey: 'gstin' },
    { header: 'City', accessor: 'city', sortKey: 'city' },
    {
      header: 'Actions',
      accessor: (row: Vendor) => (
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Vendor Master</h1>
        <Button onClick={handleAddNew}>Add New Vendor</Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={vendors}
        searchKeys={['name', 'email', 'gstin', 'phone', 'city', 'state']}
        searchPlaceholder="Search Vendors..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
      >
        <VendorForm 
          vendor={editingVendor}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this vendor? This action cannot be undone."
      />
    </div>
  );
};

export default VendorMasterPage;