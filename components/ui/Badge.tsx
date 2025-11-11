import React from 'react';
import { InvoiceStatus, SalesOrderStatus, PurchaseOrderStatus, QuotationStatus, CreditDebitNoteStatus, GRNStatus, ProductionOrderStatus } from '../../types';

type Status = InvoiceStatus | SalesOrderStatus | PurchaseOrderStatus | QuotationStatus | CreditDebitNoteStatus | GRNStatus | ProductionOrderStatus;

interface BadgeProps {
  status: Status;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  // Use a record with a string key to avoid TypeScript errors with enums
  // that share the same string value (e.g., 'Draft').
  const statusClasses: Record<string, string> = {
    // Invoice Statuses
    [InvoiceStatus.Paid]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [InvoiceStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [InvoiceStatus.Overdue]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    [InvoiceStatus.Draft]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',

    // Sales Order Statuses
    [SalesOrderStatus.Confirmed]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [SalesOrderStatus.Shipped]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    [SalesOrderStatus.Invoiced]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [SalesOrderStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',

    // Purchase Order Statuses
    [PurchaseOrderStatus.Approved]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [PurchaseOrderStatus.Received]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [PurchaseOrderStatus.Billed]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',

    // Quotation Statuses
    [QuotationStatus.Sent]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    [QuotationStatus.Accepted]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [QuotationStatus.Rejected]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',

    // Credit/Debit Note Statuses
    [CreditDebitNoteStatus.Issued]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    
    // GRN Statuses
    [GRNStatus.Completed]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',

    // Production Order Statuses
    [ProductionOrderStatus.Planned]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    [ProductionOrderStatus.InProgress]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  };

  const finalClasses = statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${finalClasses}`}>
      {status}
    </span>
  );
};