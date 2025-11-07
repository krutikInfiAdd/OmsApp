import React, { useState } from 'react';
import { Product, Column, Category, Subcategory, Tax } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ProductForm } from '../../components/forms/ProductForm';
import { DataTable } from '../../components/ui/DataTable';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Tooltip } from '../../components/ui/Tooltip';
import { useData } from '../../contexts/DataContext';

const ProductMasterPage: React.FC = () => {
  const { products, categories, subcategories, taxes, addProduct, updateProduct, deleteProduct } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    setProductToDelete(productId);
    setIsConfirmModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
    }
    setIsConfirmModalOpen(false);
    setProductToDelete(null);
  };

  const handleSave = (productData: Partial<Product>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const columns: Column<Product>[] = [
    { header: 'Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    { header: 'Code', accessor: 'code', sortKey: 'code' },
    { header: 'Category', accessor: (row) => categories.find(c => c.id === row.categoryId)?.name || '-', sortKey: 'categoryId' },
    { header: 'Subcategory', accessor: (row) => subcategories.find(s => s.id === row.subcategoryId)?.name || '-', sortKey: 'subcategoryId' },
    { header: 'Rate', accessor: (row) => formatCurrency(row.rate), sortKey: 'rate' },
    { 
      header: 'Tax', 
      accessor: (row) => {
        const tax = taxes.find(t => t.id === row.taxId);
        return tax ? `${tax.rate}%` : '-';
      },
      sortKey: 'taxId'
    },
    {
      header: 'Actions',
      accessor: (row: Product) => (
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Product Master</h1>
        <Button onClick={handleAddNew}>Add New Product</Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={products}
        searchKeys={['name', 'code', 'hsnCode']}
        searchPlaceholder="Search Products..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm 
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
          categories={categories}
          subcategories={subcategories}
          taxes={taxes}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
};

export default ProductMasterPage;