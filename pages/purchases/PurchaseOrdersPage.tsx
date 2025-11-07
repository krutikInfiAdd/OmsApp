import React from 'react';
import { NavLink } from 'react-router-dom';
import { PurchaseOrder, Column, PurchaseOrderStatus } from '../../types';
import { useData } from '../../contexts/DataContext';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tooltip } from '../../components/ui/Tooltip';
import { EyeIcon } from '../../components/icons/EyeIcon';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { ReceiveGoodsIcon } from '../../components/icons/ReceiveGoodsIcon';

const PurchaseOrdersPage: React.FC = () => {
    const { purchaseOrders } = useData();
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

    const columns: Column<PurchaseOrder>[] = [
        { header: 'Order #', accessor: (row) => <span className="font-medium text-primary-600 dark:text-primary-400">{row.orderNumber}</span>, sortKey: 'orderNumber' },
        { header: 'Supplier', accessor: (row) => row.supplier.name, sortKey: 'supplier.name' as any },
        { header: 'Order Date', accessor: 'orderDate', sortKey: 'orderDate' },
        { header: 'Expected Date', accessor: 'expectedDeliveryDate', sortKey: 'expectedDeliveryDate' },
        { header: 'Amount', accessor: (row) => <span className="font-semibold">{formatCurrency(row.amount)}</span>, sortKey: 'amount' },
        { header: 'Status', accessor: (row) => <Badge status={row.status} />, sortKey: 'status' },
        {
            header: 'Actions',
            accessor: (row) => (
                <div className="flex space-x-1">
                    {row.status === PurchaseOrderStatus.Approved && (
                        <Tooltip text="Receive Goods (GRN)">
                            <NavLink to={`/inventory/grn/new/${row.id}`} className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <ReceiveGoodsIcon className="h-5 w-5" />
                            </NavLink>
                        </Tooltip>
                    )}
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
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Purchase Orders</h1>
                <NavLink to="/purchases/orders/new">
                    <Button>Create New PO</Button>
                </NavLink>
            </div>
            <DataTable 
                columns={columns}
                data={purchaseOrders}
                searchKeys={['orderNumber', 'supplier.name']}
                searchPlaceholder="Search by PO # or Supplier..."
            />
        </div>
    );
};

export default PurchaseOrdersPage;