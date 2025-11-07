import React, { useState } from 'react';
import { mockCustomers, mockCompanies } from '../../data/mockData';
import { Customer, Company, Column } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CustomerForm } from '../../components/forms/CustomerForm';
import { DataTable } from '../../components/ui/DataTable';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Tooltip } from '../../components/ui/Tooltip';

const CustomerMasterPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [companies] = useState<Company[]>(mockCompanies);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

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
  
  const confirmDelete = () => {
    if (customerToDelete) {
      setCustomers(customers.filter(c => c.id !== customerToDelete));
    }
    setIsConfirmModalOpen(false);
    setCustomerToDelete(null);
  };

  const handleSave = (customerData: Partial<Customer>) => {
    if (editingCustomer) {
      // Edit existing customer
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, ...customerData } as Customer : c));
    } else {
      // Add new customer
      const newCustomer: Customer = {
        id: `C${String(customers.length + 101).slice(-3)}`, // Ensure unique ID
        name: customerData.name || '',
        email: customerData.email || '',
        gstin: customerData.gstin || '',
        companyId: customerData.companyId || (companies[0]?.id || ''),
        mobile: customerData.mobile || '',
        address: customerData.address || '',
        city: customerData.city || '',
        state: customerData.state || '',
        country: customerData.country || '',
        creditLimit: customerData.creditLimit || 0,
      };
      setCustomers([...customers, newCustomer]);
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);

  const columns: Column<Customer>[] = [
    { header: 'Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    { 
      header: 'Company', 
      accessor: (row) => companies.find(c => c.id === row.companyId)?.name || 'N/A', 
      sortKey: 'companyId' 
    },
    { header: 'Mobile', accessor: 'mobile', sortKey: 'mobile' },
    { header: 'City', accessor: 'city', sortKey: 'city' },
    { header: 'Credit Limit', accessor: (row) => formatCurrency(row.creditLimit), sortKey: 'creditLimit' },
    {
      header: 'Actions',
      accessor: (row: Customer) => (
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Customer Master</h1>
        <Button onClick={handleAddNew}>Add New Customer</Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={customers}
        searchKeys={['name', 'email', 'gstin', 'mobile', 'city', 'state']}
        searchPlaceholder="Search Customers..."
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
          companies={companies}
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