import React, { useState, useEffect } from 'react';
import { Column } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { VendorForm } from '../../components/forms/VendorForm';
import { DataTable } from '../../components/ui/DataTable';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Tooltip } from '../../components/ui/Tooltip';
import { useData } from '../../contexts/DataContext';
import { CreateVendorApi, GetVendorApi, UpdateVendorApi, VendorBaseDto, VendorType } from '@/apis/service/vendor/index.api';

const VendorMasterPage: React.FC = () => {
  const { vendors, addVendor, updateVendor, deleteVendor } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorType | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);
  const [vendorList, setVendorList] = useState<VendorType[]>([]);

  const [totalItems, setTotalItems] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>();

  useEffect(() => {
    handleGetVendor();
  }, [currentPage, itemsPerPage, searchTerm, sortKey, sortDirection]);

  const handleGetVendor = async () => {
    try {
      const res = await GetVendorApi(currentPage, itemsPerPage, true);
      if (res.data.isSuccess) {
        setVendorList(res.data.result);
        setTotalItems(res.data.totalRecords);
      }
    } catch (error) {
    }
  }


  const handleAddNew = () => {
    setEditingVendor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vendor: VendorType) => {
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

  const handleSave = async (vendorData: Partial<VendorType>) => {
    let param: VendorBaseDto = {
      addressLine1: vendorData.addressLine1 || '',
      addressLine2: vendorData.addressLine2 || null,
      city: vendorData.city || '',
      country: vendorData.country || '',
      email: vendorData.email || null,
      gstin: vendorData.gstin || null,
      name: vendorData.name || '',
      pan: vendorData.pan || null,
      phone: vendorData.phone || null,
      state: vendorData.state || '',
      code: vendorData.code || '',
      accountNumber: vendorData.accountNumber || null,
      ifscCode: vendorData.ifscCode || null,
      contactPerson: vendorData.contactPerson || null,
      bankName: vendorData.bankName || null,
      creditLimit: vendorData.creditLimit || null,
      paymentTerms: vendorData.paymentTerms || null,
      pinCode: vendorData.pinCode || null,
      gstType: vendorData.gstType || null
    }
    if (editingVendor) {
      await UpdateVendorApi(editingVendor.id, param);
    } else {
      await CreateVendorApi(param);
    }
    setIsModalOpen(false);
    setEditingVendor(null);
    await handleGetVendor();
  };

  const columns: Column<VendorType>[] = [
    { header: 'Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    { header: 'Email', accessor: 'email', sortKey: 'email' },
    { header: 'Phone', accessor: 'phone', sortKey: 'phone' },
    { header: 'GSTIN', accessor: 'gstin', sortKey: 'gstin' },
    { header: 'City', accessor: 'city', sortKey: 'city' },
    {
      header: 'Actions',
      accessor: (row: VendorType) => (
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
        data={vendorList}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        sortKey={sortKey as keyof VendorType}
        sortDirection={sortDirection}
        onSearch={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        onSort={(key, dir) => { setSortKey(key as string); setSortDirection(dir); setCurrentPage(1); }}
        onPageChange={(page) => setCurrentPage(page)}
        onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
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