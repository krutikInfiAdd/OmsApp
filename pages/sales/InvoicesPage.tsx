import React, { useState } from 'react';
import { mockInvoices } from '../../data/mockData';
import { Invoice } from '../../types';
import { Column } from '../../types';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { EyeIcon } from '../../components/icons/EyeIcon';
import { Tooltip } from '../../components/ui/Tooltip';

const InvoicesPage: React.FC = () => {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const columns: Column<Invoice>[] = [
    { header: 'Invoice #', accessor: (row) => <span className="font-medium text-primary-600 dark:text-primary-400">{row.invoiceNumber}</span>, sortKey: 'invoiceNumber' },
    { header: 'Customer', accessor: (row) => row.customer.name, sortKey: 'customer.name' as any }, // casting as workaround for nested key
    { header: 'Issue Date', accessor: 'issueDate', sortKey: 'issueDate' },
    { header: 'Due Date', accessor: 'dueDate', sortKey: 'dueDate' },
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
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Sales Invoices</h1>
        <Button>Create New Invoice</Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={invoices} 
        searchKeys={['invoiceNumber', 'customer.name']}
        searchPlaceholder="Search by Invoice # or Customer..."
      />
    </div>
  );
};

export default InvoicesPage;