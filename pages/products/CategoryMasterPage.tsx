import React, { useState } from 'react';
import { Category, Column } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CategoryForm } from '../../components/forms/CategoryForm';
import { DataTable } from '../../components/ui/DataTable';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Tooltip } from '../../components/ui/Tooltip';
import { useData } from '../../contexts/DataContext';

const CategoryMasterPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setIsConfirmModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      // In a real app, you'd also want to handle subcategories and products that belong to this category.
    }
    setIsConfirmModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleSave = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const columns: Column<Category>[] = [
    { header: 'ID', accessor: 'id', sortKey: 'id' },
    { header: 'Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    { header: 'Description', accessor: 'description', sortKey: 'description' },
    {
      header: 'Actions',
      accessor: (row: Category) => (
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Category Master</h1>
        <Button onClick={handleAddNew}>Add New Category</Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={categories}
        searchKeys={['name', 'id', 'description']}
        searchPlaceholder="Search Categories..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <CategoryForm 
          category={editingCategory}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
    </div>
  );
};

export default CategoryMasterPage;