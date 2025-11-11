import React, { useState, useEffect } from 'react';
import { Customer, Column } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CustomerForm } from '../../components/forms/CustomerForm';
import { DataTable } from '../../components/ui/DataTable';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Tooltip } from '../../components/ui/Tooltip';
import { CreateCustomerApi, CustomerResponse, DeleteCustomerApi, EditCustomer, GetCustomerApi, UpdateCustomerApi } from '@/apis/service/customer';
import { CompanyDDLApi, CompanyDropdown } from '@/apis/service/company';

const CustomerMasterPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<EditCustomer | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [customerList, setCustomerList] = useState<CustomerResponse[]>([]);
  const [companyList, setCompanyList] = useState<CompanyDropdown[]>([]);

  useEffect(() => {
    handleGetCustomer();
    handleGetCompnies();
  }, []);

  const handleGetCustomer = async () => {
    try {
      const res = await GetCustomerApi(0, 10, true);
      if (res.data.isSuccess) {
        setCustomerList(res.data.result);
      }
    } catch (error) {

    }
  }

  const handleGetCompnies = async () => {
    try {
      const res = await CompanyDDLApi();
      if (res.data.isSuccess) {
        setCompanyList(res.data.result);
      }
    } catch (error) {

    }
  }

  const handleAddNew = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = (customerId: string) => {
    setCustomerToDelete(customerId);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      await DeleteCustomerApi(customerToDelete);
    }
    setIsConfirmModalOpen(false);
    setCustomerToDelete(null);
    await handleGetCustomer();
  };

  const handleSave = async (customerData: Partial<CustomerResponse>) => {
    let param: EditCustomer = {
      address: customerData.address || '',
      companyId: customerData.companyId,
      city: customerData.city || '',
      country: customerData.country || '',
      creditLimit: customerData.creditLimit || 0,
      email: customerData.email || '',
      gstin: customerData.gstin || '',
      mobile: customerData.mobile || '',
      name: customerData.name || '',
      state: customerData.state || '',
      contactName: customerData.contactName || '',
    }
    if (editingCustomer) {
      UpdateCustomerApi(editingCustomer.id, param);
    } else {
      CreateCustomerApi(param);
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
    await handleGetCustomer();
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);

  const columns: Column<CustomerResponse>[] = [
    { header: 'Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    // {
    //   header: 'Company',
    //   accessor: (row) => companies.find(c => c.id === row.companyId)?.name || 'N/A',
    //   sortKey: 'companyId'
    // },
    { header: 'Mobile', accessor: 'mobile', sortKey: 'mobile' },
    { header: 'City', accessor: 'city', sortKey: 'city' },
    { header: 'Credit Limit', accessor: (row) => formatCurrency(row.creditLimit), sortKey: 'creditLimit' },
    {
      header: 'Actions',
      accessor: (row: CustomerResponse) => (
        <div className="flex space-x-1">
          <Tooltip text="Edit">
            <Button variant="ghost" size="sm"
              onClick={() => handleEdit(row)}
            >
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Customer Master</h1>
        <Button onClick={handleAddNew}>Add New Customer</Button>
      </div>

      <DataTable
        columns={columns}
        data={customerList}
        searchKeys={['name', 'email', 'gstin', 'phone', 'city', 'state', 'pan']}
        searchPlaceholder="Search Customers..."
        totalItems={132}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
      >
        <CustomerForm
          customer={editingCustomer}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
          companies={companyList}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this customer? This action cannot be undone."
      />
    </div>
  );
};

export default CustomerMasterPage;  