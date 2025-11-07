import React from 'react';
import { GRN, Column } from '../../types';
import { useData } from '../../contexts/DataContext';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';

const GrnPage: React.FC = () => {
  const { grns } = useData();

  const columns: Column<GRN>[] = [
    { header: 'GRN #', accessor: (row) => <span className="font-medium text-primary-600 dark:text-primary-400">{row.grnNumber}</span>, sortKey: 'grnNumber' },
    { header: 'PO #', accessor: 'purchaseOrderNumber', sortKey: 'purchaseOrderNumber' },
    { header: 'Supplier', accessor: (row) => row.supplier.name, sortKey: 'supplier.name' as any },
    { header: 'GRN Date', accessor: 'grnDate', sortKey: 'grnDate' },
    { header: 'Status', accessor: (row) => <Badge status={row.status} />, sortKey: 'status' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Goods Received Notes (GRN)</h1>
      </div>
      <DataTable
        columns={columns}
        data={grns}
        searchKeys={['grnNumber', 'purchaseOrderNumber', 'supplier.name']}
        searchPlaceholder="Search by GRN #, PO #, or Supplier..."
      />
    </div>
  );
};

export default GrnPage;
