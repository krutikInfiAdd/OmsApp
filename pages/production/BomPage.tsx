import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BOM, Column } from '../../types';
import { useData } from '../../contexts/DataContext';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Tooltip } from '../../components/ui/Tooltip';
import { EyeIcon } from '../../components/icons/EyeIcon';

const BomPage: React.FC = () => {
  const { boms, deleteBom } = useData();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [bomToDelete, setBomToDelete] = useState<string | null>(null);

  const handleDelete = (bomId: string) => {
    setBomToDelete(bomId);
    setIsConfirmModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (bomToDelete) {
      deleteBom(bomToDelete);
    }
    setIsConfirmModalOpen(false);
    setBomToDelete(null);
  };

  const columns: Column<BOM>[] = [
    { header: 'BOM #', accessor: (row) => <span className="font-medium text-primary-600 dark:text-primary-400">{row.bomNumber}</span>, sortKey: 'bomNumber' },
    { header: 'Finished Product', accessor: (row) => row.product.name, sortKey: 'product.name' as any },
    { header: 'Creation Date', accessor: 'creationDate', sortKey: 'creationDate' },
    {
      header: 'Actions',
      accessor: (row: BOM) => (
        <div className="flex space-x-1">
          <Tooltip text="View">
            <NavLink to={`/production/bom/view/${row.id}`} className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <EyeIcon className="h-4 w-4" />
            </NavLink>
          </Tooltip>
          <Tooltip text="Edit">
            <NavLink to={`/production/bom/edit/${row.id}`} className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <PencilIcon className="h-4 w-4" />
            </NavLink>
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bill of Materials (BOM)</h1>
        <NavLink to="/production/bom/new">
          <Button>Add New BOM</Button>
        </NavLink>
      </div>
      
      <DataTable 
        columns={columns} 
        data={boms}
        searchKeys={['bomNumber', 'product.name']}
        searchPlaceholder="Search by BOM # or Product Name..."
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this Bill of Materials? This action cannot be undone."
      />
    </div>
  );
};

export default BomPage;