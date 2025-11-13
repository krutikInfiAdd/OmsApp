import React, { useState, useEffect } from 'react';
import { Tax, Column } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { TaxForm } from '../../components/forms/TaxForm';
import { DataTable } from '../../components/ui/DataTable';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Tooltip } from '../../components/ui/Tooltip';
import { useData } from '../../contexts/DataContext';
import { CreateTaxSlabsApi, DeleteTaxSlabsApi, GetTaxSlabsApi, TaxSlabsBaseDto, TaxSlabsType, UpdateTaxSlabsApi } from '@/apis/service/taxSlabs/index.api';

const TaxMasterPage: React.FC = () => {
  const { taxes, addTax, updateTax, deleteTax } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxSlabsType | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [taxToDelete, setTaxToDelete] = useState<string | null>(null);
  const [taxList, setTaxList] = useState<TaxSlabsType[]>([]);

  const [totalItems, setTotalItems] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>();

  useEffect(() => {
    handleGetTaxSlabs();
  }, [currentPage, itemsPerPage, searchTerm, sortKey, sortDirection]);

  const handleGetTaxSlabs = async () => {
    try {
      const res = await GetTaxSlabsApi(currentPage, itemsPerPage, true);
      if (res.data.isSuccess) {
        setTaxList(res.data.result);
        setTotalItems(res.data.totalRecords);
      }
    } catch (error) {

    }
  }

  const handleAddNew = () => {
    setEditingTax(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tax: TaxSlabsType) => {
    setEditingTax(tax);
    setIsModalOpen(true);
  };

  const handleDelete = (taxId: string) => {
    setTaxToDelete(taxId);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (taxToDelete) {
      await DeleteTaxSlabsApi(taxToDelete);
    }
    setIsConfirmModalOpen(false);
    setTaxToDelete(null);
    await handleGetTaxSlabs();
  };

  const handleSave = async (taxData: Partial<TaxSlabsType>) => {
    let param: TaxSlabsBaseDto = {
      hsnCode: taxData.hsnCode || '',
      productType: taxData.productType || '',
      description: taxData.description || '',
      cgst: taxData.cgst || 0,
      sgst: taxData.sgst || 0,
      igst: taxData.igst || 0,
    };
    if (editingTax) {
      await UpdateTaxSlabsApi(editingTax.id, param);
    } else {
      await CreateTaxSlabsApi(param);
    }
    setIsModalOpen(false);
    setEditingTax(null);
    await handleGetTaxSlabs();
  };

  const columns: Column<TaxSlabsType>[] = [
    // { header: 'Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    // { header: 'Type', accessor: 'type', sortKey: 'type' },
    { header: 'Cgst', accessor: (row) => `${row.cgst}%`, sortKey: 'cgst' },
    { header: 'Sgst', accessor: (row) => `${row.sgst}%`, sortKey: 'sgst' },
    { header: 'Igst', accessor: (row) => `${row.igst}%`, sortKey: 'igst' },
    { header: 'Description', accessor: (row) => row.description || '-', sortKey: 'description' },
    {
      header: 'Actions',
      accessor: (row: TaxSlabsType) => (
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
        data={taxList}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        sortKey={sortKey as keyof TaxSlabsType}
        sortDirection={sortDirection}
        onSearch={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        onSort={(key, dir) => { setSortKey(key as string); setSortDirection(dir); setCurrentPage(1); }}
        onPageChange={(page) => setCurrentPage(page)}
        onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}

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