import React, { useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Column, Product } from '../../types';
import { DataTable } from '../../components/ui/DataTable';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PrintIcon } from '../../components/icons/PrintIcon';

const StockValuationPage: React.FC = () => {
  const { products } = useData();

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const valuationData = useMemo(() => {
    return products.map(product => ({
      ...product,
      valuation: product.stock * product.rate,
    }));
  }, [products]);

  const totalStockValue = useMemo(() => {
    return valuationData.reduce((total, product) => total + product.valuation, 0);
  }, [valuationData]);
  
  const productsInStock = useMemo(() => {
      return valuationData.filter(p => p.stock > 0).length;
  }, [valuationData]);

  type ProductWithValuation = Product & { valuation: number };

  const columns: Column<ProductWithValuation>[] = [
    { header: 'Product Name', accessor: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>, sortKey: 'name' },
    { header: 'Product Code', accessor: 'code', sortKey: 'code' },
    { 
      header: 'Current Stock', 
      accessor: (row) => `${row.stock} ${row.unit}`, 
      sortKey: 'stock' 
    },
    { 
      header: 'Rate', 
      accessor: (row) => formatCurrency(row.rate), 
      sortKey: 'rate' 
    },
    { 
      header: 'Stock Value', 
      accessor: (row) => <span className="font-semibold">{formatCurrency(row.valuation)}</span>,
      sortKey: 'valuation',
    },
  ];

  return (
    <div className="space-y-6 print-wrapper">
      <div className="flex flex-col sm:flex-row justify-between items-center print:hidden">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Stock Valuation Report</h1>
        <Button onClick={handlePrint} className="flex items-center space-x-2 mt-4 sm:mt-0">
          <PrintIcon className="h-4 w-4" />
          <span>Print Report</span>
        </Button>
      </div>

       <div className="print:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
           <Card>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Products in Stock</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{productsInStock}</p>
           </Card>
            <Card>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Stock Value</h3>
                <p className="mt-1 text-3xl font-semibold text-primary-600 dark:text-primary-400">{formatCurrency(totalStockValue)}</p>
            </Card>
       </div>
       
       <div className="hidden print:block mb-4 text-center">
            <h2 className="text-xl font-bold">Stock Valuation Report</h2>
            <p>As of {new Date().toLocaleDateString()}</p>
            <p className="font-bold mt-2">Total Stock Value: {formatCurrency(totalStockValue)}</p>
       </div>

      <DataTable 
        columns={columns} 
        data={valuationData}
        searchKeys={['name', 'code']}
        searchPlaceholder="Search by product name or code..."
      />
    </div>
  );
};

export default StockValuationPage;
