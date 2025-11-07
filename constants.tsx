

import React from 'react';
import { NavItem } from './types';
import { HomeIcon } from './components/icons/HomeIcon';
import { InvoiceIcon } from './components/icons/InvoiceIcon';
import { PurchaseIcon } from './components/icons/PurchaseIcon';
import { InventoryIcon } from './components/icons/InventoryIcon';
import { AccountingIcon } from './components/icons/AccountingIcon';
import { ReportsIcon } from './components/icons/ReportsIcon';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { ProductIcon } from './components/icons/ProductIcon';

export const NAVIGATION_LINKS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: HomeIcon },
  {
    label: 'Sales',
    icon: InvoiceIcon,
    children: [
      { label: 'Invoices', path: '/sales/invoices', icon: () => null },
      { label: 'Sales Orders', path: '/sales/orders', icon: () => null },
      { label: 'Quotations', path: '/sales/quotations', icon: () => null },
    ],
  },
  {
    label: 'Purchases',
    icon: PurchaseIcon,
    children: [
      { label: 'Purchase Orders', path: '/purchases/orders', icon: () => null },
    ],
  },
    {
    label: 'Inventory',
    icon: InventoryIcon,
    children: [
      { label: 'Stock Management', path: '/inventory/stock', icon: () => null },
      { label: 'Goods Received (GRN)', path: '/inventory/grn', icon: () => null },
    ],
  },
  {
    label: 'Products',
    icon: ProductIcon,
    children: [
      { label: 'Product Master', path: '/products/master', icon: () => null },
      { label: 'Category Master', path: '/products/categories', icon: () => null },
      { label: 'Subcategory Master', path: '/products/subcategories', icon: () => null },
    ],
  },
  {
    label: 'Production',
    icon: InventoryIcon,
    children: [
      { label: 'Bill of Materials', path: '/production/bom', icon: () => null },
    ],
  },
    {
    label: 'Accounting',
    icon: AccountingIcon,
    children: [
      { label: 'Journal Vouchers', path: '/accounting/journal', icon: () => null },
      { label: 'Credit/Debit Notes', path: '/accounting/credit-debit-notes', icon: () => null },
      { label: 'Balance Sheet', path: '/accounting/balance-sheet', icon: () => null },
    ],
  },
  {
    label: 'Bank',
    icon: AccountingIcon,
    children: [
      { label: 'Reconciliation', path: '/reconciliation', icon: () => null },
    ],
  },
  {
    label: 'GST',
    icon: ReportsIcon,
    children: [
      { label: 'GSTR-1', path: '/gst/gstr1', icon: () => null },
    ],
  },
  {
    label: 'Reports',
    icon: ReportsIcon,
    children: [
        { label: 'Sales Summary', path: '/reports/sales', icon: () => null },
    ],
  },
  {
    label: 'Settings',
    icon: SettingsIcon,
    children: [
      { label: 'Company Profile', path: '/settings/company', icon: () => null },
      { label: 'Customer Master', path: '/settings/customers', icon: () => null },
      { label: 'Supplier Master', path: '/settings/suppliers', icon: () => null },
      { label: 'Vendor Master', path: '/settings/vendors', icon: () => null },
      { label: 'Tax Master', path: '/settings/taxes', icon: () => null },
      { label: 'Users & Roles', path: '/settings/users', icon: () => null },
    ],
  },
];