import React, { useState } from 'react';
import { Subcategory, Category, Column } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { SubcategoryForm } from '../../components/forms/SubcategoryForm';
import { DataTable } from '../../components/ui/DataTable';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Tooltip } from '../../components/ui/Tooltip';
import { useData } from '../../contexts/DataContext';

const SubcategoryMasterPage: React.FC = () => {
  const { subcategories, categories, addSubcategory, updateSubcategory, deleteSubcategory } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingSubcategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setIsModalOpen(true);
  };

  const handleDelete = (subcategoryId: string) => {
    setSubcategoryToDelete(subcategoryId);
    setIsConfirmModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (subcategoryToDelete) {
      deleteSubcategory(subcategoryToDelete);
    }
    setIsConfirmModalOpen(false);
    setSubcategoryToDelete(null);
  };

  const handleSave = (subcategoryData: Partial<Subcategory>) => {
    if (editingSubcategory) {
      updateSubcategory(editingSubcategory.id, subcategoryData);
    } else {
      addSubcategory(subcategoryData);
    }
    setIsModalOpen(false);
    setEditingSubcategory(null);
  };

  const columns: Column<Subcategory>[] = [
    { header: 'ID', accessor: 'id', sortKey: 'id' },
    { header: 'Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    { header: 'Description', accessor: 'description', sortKey: 'description' },
    { 
      header: 'Parent Category', 
      accessor: (row) => categories.find(c => c.id === row.categoryId)?.name || 'N/A', 
      sortKey: 'categoryId' 
    },
    {
      header: 'Actions',
      accessor: (row: Subcategory) => (
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Subcategory Master</h1>
        <Button onClick={handleAddNew}>Add New Subcategory</Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={subcategories}
        searchKeys={['name', 'id', 'description']}
        searchPlaceholder="Search Subcategories..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
      >
        <SubcategoryForm 
          subcategory={editingSubcategory}
          categories={categories}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this subcategory? This action cannot be undone."
      />
    </div>
  );
};

export default SubcategoryMasterPage;