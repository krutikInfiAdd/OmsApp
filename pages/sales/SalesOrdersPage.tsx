import React from 'react';
import { NavLink } from 'react-router-dom';
import { SalesOrder, Column } from '../../types';
import { useData } from '../../contexts/DataContext';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tooltip } from '../../components/ui/Tooltip';
import { EyeIcon } from '../../components/icons/EyeIcon';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';

const SalesOrdersPage: React.FC = () => {
  const { salesOrders } = useData();
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const columns: Column<SalesOrder>[] = [
    { header: 'Order #', accessor: (row) => <span className="font-medium text-primary-600 dark:text-primary-400">{row.orderNumber}</span>, sortKey: 'orderNumber' },
    { header: 'Customer', accessor: (row) => row.customer.name, sortKey: 'customer.name' as any },
    { header: 'Order Date', accessor: 'orderDate', sortKey: 'orderDate' },
    { header: 'Shipment Date', accessor: 'shipmentDate', sortKey: 'shipmentDate' },
    { header: 'Amount', accessor: (row) => <span className="font-semibold">{formatCurrency(row.amount)}</span>, sortKey: 'amount' },
    { header: 'Status', accessor: (row) => <Badge status={row.status} />, sortKey: 'status' },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex space-x-1">
          <Tooltip text="View">
            <Button variant="ghost" size="sm">
              <EyeIcon className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip text="Edit">
            <Button variant="ghost" size="sm">
              <PencilIcon className="h-4 w-4" />
            </Button>
          </Tooltip>
           <Tooltip text="Delete">
            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50">
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Sales Orders</h1>
        <NavLink to="/sales/orders/new">
          <Button>Create New Sales Order</Button>
        </NavLink>
      </div>
      <DataTable
        columns={columns}
        data={salesOrders}
        searchKeys={['orderNumber', 'customer.name']}
        searchPlaceholder="Search by Order # or Customer..."
      />
    </div>
  );
};

export default SalesOrdersPage;