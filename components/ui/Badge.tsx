import React from 'react';
import { InvoiceStatus } from '../../types';

interface BadgeProps {
  status: InvoiceStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const statusClasses: Record<InvoiceStatus, string> = {
    [InvoiceStatus.Paid]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [InvoiceStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [InvoiceStatus.Overdue]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    [InvoiceStatus.Draft]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}>
      {status}
    </span>
  );
};
