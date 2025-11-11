import React, { useState, useEffect } from 'react';
import { Company, Column } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CompanyForm } from '../../components/forms/CompanyForm';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { DataTable } from '../../components/ui/DataTable';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Tooltip } from '../../components/ui/Tooltip';
import { CompanyBase, CompanyType, CreateCompanyApi, DeleteCompanyApi, GetCompaniesApi, UpdateCompanyApi } from '@/apis/service/company';

const CompanyProfilePage: React.FC = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyType | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [companyList, setcompanyList] = useState<CompanyType[]>([]);

  useEffect(() => {
    handleGetCompanies();
  }, []);


  const handleGetCompanies = async () => {
    try {
      const res = await GetCompaniesApi(0, 10, true);
      if (res.data.isSuccess) {
        setcompanyList(res.data.result);
      }
    } catch (error) {

    }
  }

  const handleAddNew = () => {
    setEditingCompany(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsFormModalOpen(true);
  };

  const handleDelete = (companyId: string) => {
    setCompanyToDelete(companyId);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (companyToDelete) {
      await DeleteCompanyApi(companyToDelete);
    }
    setIsConfirmModalOpen(false);
    setCompanyToDelete(null);
    await handleGetCompanies();
  };

  const handleSave = (companyData: Partial<CompanyType>) => {
    let param: CompanyBase = {
      address: companyData.address || '',
      country: companyData.country || '',
      email: companyData.email || '',
      gstin: companyData.gstin || '',
      name: companyData.name || '',
      pan: companyData.pan || '',
      phone: companyData.phone || '',
      state: companyData.state || '',
    }
    if (editingCompany) {
      UpdateCompanyApi(editingCompany.id, param);
    } else {
      CreateCompanyApi(param);
    }
    setIsFormModalOpen(false);
    setEditingCompany(null);
  };

  const columns: Column<CompanyType>[] = [
    { header: 'Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    { header: 'Email', accessor: 'email', sortKey: 'email' },
    { header: 'Phone', accessor: 'phone', sortKey: 'phone' },
    { header: 'GSTIN', accessor: 'gstin', sortKey: 'gstin' },
    {
      header: 'Actions',
      accessor: (row) => (
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Company Profile</h1>
        <Button onClick={handleAddNew}>Add New Company</Button>
      </div>

      <DataTable
        columns={columns}
        data={companyList}
        searchKeys={['name', 'email', 'phone', 'gstin', 'pan']}
        searchPlaceholder="Search by Name, Email, Phone..."
      />

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingCompany ? 'Edit Company Profile' : 'Add New Company'}
      >
        <CompanyForm
          company={editingCompany}
          onSave={handleSave}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this company profile? This action cannot be undone."
      />
    </div>
  );
};

export default CompanyProfilePage;