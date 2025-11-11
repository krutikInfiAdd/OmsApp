import React, { useState, useEffect } from 'react';
import { Supplier, Column } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { SupplierForm } from '../../components/forms/SupplierForm';
import { DataTable } from '../../components/ui/DataTable';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Tooltip } from '../../components/ui/Tooltip';
import { CreateSupplierApi, DeleteSupplierApi, GetSupplierApi, SupplierBaseDto, SupplierType, UpdateSupplierApi } from '@/apis/service/supplier';

const SupplierMasterPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  const [supplierList, setSupplierList] = useState<SupplierType[]>([]);


  useEffect(() => {
    handleGetSupplier();
  }, []);

  const handleGetSupplier = async () => {
    try {
      const res = await GetSupplierApi(0, 10, true);
      if (res.data.isSuccess) {
        setSupplierList(res.data.result);
      }
    } catch (error) {

    }
  }

  const handleAddNew = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleEdit = (supplier: SupplierType) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = (supplierId: string) => {
    setSupplierToDelete(supplierId);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (supplierToDelete) {
      DeleteSupplierApi(supplierToDelete);
    }
    setIsConfirmModalOpen(false);
    setSupplierToDelete(null);
  };

  const handleSave = async (supplierData: Partial<SupplierType>) => {
    let param: SupplierBaseDto = {
      code: supplierData.code || '',
      name: supplierData.name || '',
      contactPerson: supplierData.contactPerson || null,
      email: supplierData.email || null,
      phone: supplierData.phone || null,
      gstin: supplierData.gstin || null,
      pan: supplierData.pan || null,
      addressLine1: supplierData.addressLine1 || '',
      addressLine2: supplierData.addressLine2 || null,
      city: supplierData.city || null,
      state: supplierData.state || null,
      country: supplierData.country || null,
      pinCode: supplierData.pinCode || null,
      gstType: supplierData.gstType || null,
      creditLimit: supplierData.creditLimit || null,
      paymentTerms: supplierData.paymentTerms || null,
      bankName: supplierData.bankName || null,
      accountNumber: supplierData.accountNumber || null,
      ifscCode: supplierData.ifscCode || null,
    }
    if (editingSupplier) {
      await UpdateSupplierApi(editingSupplier.id, param);
    } else {
      await CreateSupplierApi(param);
    }
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  const columns: Column<SupplierType>[] = [
    { header: 'Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    { header: 'Email', accessor: 'email', sortKey: 'email' },
    { header: 'Phone', accessor: 'phone', sortKey: 'phone' },
    { header: 'GSTIN', accessor: 'gstin', sortKey: 'gstin' },
    { header: 'City', accessor: 'city', sortKey: 'city' },
    {
      header: 'Actions',
      accessor: (row: SupplierType) => (
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
        data={supplierList}
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