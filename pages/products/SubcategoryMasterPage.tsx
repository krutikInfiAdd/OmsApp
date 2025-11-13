import React, { useState, useEffect } from 'react';
import { Column } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { SubcategoryForm } from '../../components/forms/SubcategoryForm';
import { DataTable } from '../../components/ui/DataTable';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Tooltip } from '../../components/ui/Tooltip';
import { useData } from '../../contexts/DataContext';
import { CreateSubCategoriesApi, DeleteSubCategoriesApi, GetSubCategoriesApi, SubCategoriesBaseDto, SubCategoriesType, UpdateSubCategoriesApi } from '@/apis/service/subcategory/index.api';
import { CategoriesDDLApi, CategoryDropdown } from '@/apis/service/category/index.api';

const SubcategoryMasterPage: React.FC = () => {
  const { addSubcategory, updateSubcategory, deleteSubcategory } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<SubCategoriesType | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<string | null>(null);
  const [subCategoryList, setsubCategoryList] = useState<SubCategoriesType[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoryDropdown[]>([]);

  const [totalItems, setTotalItems] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>();

  useEffect(() => {
    handleGetsubCategory();
  }, [currentPage, itemsPerPage, searchTerm, sortKey, sortDirection]);

  useEffect(() => {
    handleGetCategoryDDL();
  }, []);


  const handleGetsubCategory = async () => {
    try {
      const res = await GetSubCategoriesApi(currentPage, itemsPerPage, true);
      if (res.data.isSuccess) {
        setsubCategoryList(res.data.result);
        setTotalItems(res.data.totalRecords);
      }
    } catch (error) {

    }
  }

  const handleGetCategoryDDL = async () => {
    try {
      const res = await CategoriesDDLApi();
      if (res.data.isSuccess) {
        setCategoriesList(res.data.result);
      }
    } catch (error) {

    }
  }

  const handleAddNew = () => {
    setEditingSubcategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (subcategory: SubCategoriesType) => {
    setEditingSubcategory(subcategory);
    setIsModalOpen(true);
  };

  const handleDelete = (subcategoryId: string) => {
    setSubcategoryToDelete(subcategoryId);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (subcategoryToDelete) {
      await DeleteSubCategoriesApi(subcategoryToDelete);
    }
    setIsConfirmModalOpen(false);
    setSubcategoryToDelete(null);
    await handleGetsubCategory();
  };

  const handleSave = async (subcategoryData: Partial<SubCategoriesType>) => {
    let param: SubCategoriesBaseDto = {
      name: subcategoryData.name || '',
      description: subcategoryData.description || '',
      categoryId: subcategoryData.categoryId || '',
      code: subcategoryData.code || ''
    }
    if (editingSubcategory) {
      UpdateSubCategoriesApi(editingSubcategory.id, param);
    } else {
      CreateSubCategoriesApi(param);
    }
    setIsModalOpen(false);
    setEditingSubcategory(null);
    await handleGetsubCategory();
  };

  const columns: Column<SubCategoriesType>[] = [
    { header: 'ID', accessor: 'id', sortKey: 'id' },
    { header: 'Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    { header: 'Description', accessor: 'description', sortKey: 'description' },
    {
      header: 'Parent Category',
      accessor: (row) => categoriesList.find(c => c.id === row.categoryId)?.name || 'N/A',
      sortKey: 'categoryId'
    },
    {
      header: 'Actions',
      accessor: (row: SubCategoriesType) => (
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
        data={subCategoryList}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        sortKey={sortKey as keyof SubCategoriesType}
        sortDirection={sortDirection}
        onSearch={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        onSort={(key, dir) => { setSortKey(key as string); setSortDirection(dir); setCurrentPage(1); }}
        onPageChange={(page) => setCurrentPage(page)}
        onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
      >
        <SubcategoryForm
          subcategory={editingSubcategory}
          categories={categoriesList}
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