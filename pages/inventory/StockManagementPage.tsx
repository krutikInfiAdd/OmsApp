import React, { useState, useEffect } from 'react';
import { Product, Column } from '../../types';
import { useData } from '../../contexts/DataContext';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Tooltip } from '../../components/ui/Tooltip';
import { Modal } from '../../components/ui/Modal';
import { AdjustmentsIcon } from '../../components/icons/AdjustmentsIcon';
import { StockAdjustmentForm } from '../../components/forms/StockAdjustmentForm';

const StockStatusBadge: React.FC<{ stock: number }> = ({ stock }) => {
  let classes = '';
  let text = '';

  const [totalItems, setTotalItems] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>();

  useEffect(() => {
    // handleGetCategory();
  }, [currentPage, itemsPerPage, searchTerm, sortKey, sortDirection]);

  if (stock > 10) {
    classes = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    text = 'In Stock';
  } else if (stock > 0) {
    classes = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    text = 'Low Stock';
  } else {
    classes = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    text = 'Out of Stock';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {text}
    </span>
  );
};

const StockManagementPage: React.FC = () => {
  const { products, updateProductStock } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>();

  useEffect(() => {
    // handleGetCategory();
  }, [currentPage, itemsPerPage, searchTerm, sortKey, sortDirection]);

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveStock = (newStock: number) => {
    if (selectedProduct) {
      updateProductStock(selectedProduct.id, newStock);
    }
    handleCloseModal();
  };

  const columns: Column<Product>[] = [
    { header: 'Product Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    { header: 'Product Code', accessor: 'code', sortKey: 'code' },
    {
      header: 'Current Stock',
      accessor: (row) => <span className="font-semibold">{`${row.stock} ${row.unit}`}</span>,
      sortKey: 'stock'
    },
    {
      header: 'Status',
      accessor: (row) => <StockStatusBadge stock={row.stock} />,
      sortKey: 'stock'
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <Tooltip text="Adjust Stock">
          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(row)}>
            <AdjustmentsIcon className="h-4 w-4" />
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Stock Management</h1>
      </div>

      <DataTable
        columns={columns}
        data={products}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        sortKey={sortKey as keyof  Product}
        sortDirection={sortDirection}
        onSearch={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        onSort={(key, dir) => { setSortKey(key as string); setSortDirection(dir); setCurrentPage(1); }}
        onPageChange={(page) => setCurrentPage(page)}
        onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
      />

      {selectedProduct && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Adjust Stock"
        >
          <StockAdjustmentForm
            product={selectedProduct}
            onSave={handleSaveStock}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default StockManagementPage;
