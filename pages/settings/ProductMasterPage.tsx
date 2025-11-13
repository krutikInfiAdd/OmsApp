import React, { useState } from 'react';
// Fix: Import mockTaxes to get tax data.
import { mockProducts, mockCategories, mockSubcategories, mockTaxes } from '../../data/mockData';
// Fix: Import Tax type.
import { Product, Column, Category, Subcategory, Tax } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ProductForm } from '../../components/forms/ProductForm';
import { DataTable } from '../../components/ui/DataTable';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { Tooltip } from '../../components/ui/Tooltip';

const ProductMasterPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories] = useState<Category[]>(mockCategories);
  const [subcategories] = useState<Subcategory[]>(mockSubcategories);
  // Fix: Initialize taxes state to be used for tax rate lookup and passed to form.
  const [taxes] = useState<Tax[]>(mockTaxes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>();

  // useEffect(() => {
  //   handleGetCompanies();
  // }, [currentPage, itemsPerPage, searchTerm, sortKey, sortDirection]);

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
      setProducts(products.filter(p => p.id !== productToDelete));
    }
    setIsConfirmModalOpen(false);
    setProductToDelete(null);
  };

  const handleSave = (productData: Partial<Product>) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData } as Product : p));
    } else {
      const newProduct: Product = {
        id: `P${String(products.length + 101).slice(-3)}`, // Ensure unique ID
        name: productData.name || '',
        code: productData.code || '',
        hsnCode: productData.hsnCode || '',
        unit: productData.unit || 'PCS',
        rate: productData.rate || 0,
        // Fix: Use taxId as defined in the Product type instead of non-existent taxPercentage.
        taxId: productData.taxId,
        categoryId: productData.categoryId,
        subcategoryId: productData.subcategoryId,
        // Fix: Added missing 'stock' property required by the Product type.
        stock: 0,
      };
      setProducts([...products, newProduct]);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const columns: Column<Product>[] = [
    { header: 'Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    { header: 'Code', accessor: 'code', sortKey: 'code' },
    { header: 'HSN/SAC', accessor: 'hsnCode', sortKey: 'hsnCode' },
    { header: 'Unit', accessor: 'unit', sortKey: 'unit' },
    { header: 'Rate', accessor: (row) => formatCurrency(row.rate), sortKey: 'rate' },
    // Fix: Correctly display the tax rate by looking up the taxId in the taxes state.
    // Use 'taxId' for sorting.
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
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        sortKey={sortKey as keyof Product}
        sortDirection={sortDirection}
        onSearch={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        onSort={(key, dir) => { setSortKey(key as string); setSortDirection(dir); setCurrentPage(1); }}
        onPageChange={(page) => setCurrentPage(page)}
        onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}

      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        {/* Fix: Passed missing taxes prop to ProductForm */}
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