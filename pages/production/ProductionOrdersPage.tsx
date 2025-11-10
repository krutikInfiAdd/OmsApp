import React from 'react';
import { NavLink } from 'react-router-dom';
import { ProductionOrder, Column } from '../../types';
import { useData } from '../../contexts/DataContext';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tooltip } from '../../components/ui/Tooltip';
import { EyeIcon } from '../../components/icons/EyeIcon';

const ProductionOrdersPage: React.FC = () => {
  const { productionOrders, boms } = useData();

  const getProductName = (bomId: string) => {
    return boms.find(b => b.id === bomId)?.product.name || 'Unknown Product';
  };

  const columns: Column<ProductionOrder>[] = [
    { header: 'Order #', accessor: (row) => <span className="font-medium text-primary-600 dark:text-primary-400">{row.orderNumber}</span>, sortKey: 'orderNumber' },
    { header: 'Product', accessor: (row) => getProductName(row.bomId), sortKey: 'bomId' },
    { header: 'Qty to Produce', accessor: 'quantityToProduce', sortKey: 'quantityToProduce' },
    { header: 'Order Date', accessor: 'orderDate', sortKey: 'orderDate' },
    { header: 'Status', accessor: (row) => <Badge status={row.status} />, sortKey: 'status' },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex space-x-1">
          <Tooltip text="View Details">
            <NavLink to={`/production/orders/view/${row.id}`} className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <EyeIcon className="h-4 w-4" />
            </NavLink>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Production Orders</h1>
        <NavLink to="/production/orders/new">
          <Button>Create Production Order</Button>
        </NavLink>
      </div>
      <DataTable
        columns={columns}
        data={productionOrders}
        searchKeys={['orderNumber']}
        searchPlaceholder="Search by Order #..."
      />
    </div>
  );
};

export default ProductionOrdersPage;