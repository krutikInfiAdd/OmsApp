import React from 'react';

export interface Customer {
  id: string;
  name: string;
  email: string;
  gstin: string;
  companyId: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  creditLimit: number;
}

export interface Company {
  id:string;
  name: string;
  gstin: string;
  pan: string;
  address: string;
  email: string;
  phone: string;
  state: string;
  country: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  gstin: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  gstin: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
}

export type ProductUnit = 'PCS' | 'KG' | 'LTR' | 'BOX' | 'SET';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  hsnCode: string;
  unit: ProductUnit;
  rate: number;
  taxId?: string;
  categoryId?: string;
  subcategoryId?: string;
  stock: number;
}

export enum InvoiceStatus {
  Paid = 'Paid',
  Pending = 'Pending',
  Overdue = 'Overdue',
  Draft = 'Draft',
}

export type DiscountType = 'percentage' | 'fixed';

export interface InvoiceItem {
  product: Product;
  quantity: number;
  rate: number;
  discountValue?: number; // The value of the discount
  discountType?: DiscountType; // The type of discount ('percentage' or 'fixed')
  tax: number; // This is the tax percentage
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: Customer;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  items: InvoiceItem[];
}

export enum SalesOrderStatus {
  Draft = 'Draft',
  Confirmed = 'Confirmed',
  Shipped = 'Shipped',
  Invoiced = 'Invoiced',
  Cancelled = 'Cancelled',
}

export interface SalesOrderItem {
  product: Product;
  quantity: number;
  rate: number;
  discountValue?: number;
  discountType?: DiscountType;
  tax: number; // tax percentage
  total: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customer: Customer;
  orderDate: string;
  shipmentDate: string;
  amount: number;
  status: SalesOrderStatus;
  items: SalesOrderItem[];
}

export enum PurchaseOrderStatus {
  Draft = 'Draft',
  Approved = 'Approved',
  Received = 'Received',
  Billed = 'Billed',
  Cancelled = 'Cancelled',
}

export interface PurchaseOrderItem {
  product: Product;
  quantity: number;
  rate: number;
  tax: number; // tax percentage
  total: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: Supplier;
  orderDate: string;
  expectedDeliveryDate: string;
  amount: number;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
}

export enum QuotationStatus {
  Draft = 'Draft',
  Sent = 'Sent',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}

export interface QuotationItem {
  product: Product;
  quantity: number;
  rate: number;
  discountValue?: number;
  discountType?: DiscountType;
  tax: number; // tax percentage
  total: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customer: Customer;
  issueDate: string;
  expiryDate: string;
  amount: number;
  status: QuotationStatus;
  items: QuotationItem[];
}

export enum CreditDebitNoteType {
  Credit = 'Credit',
  Debit = 'Debit',
}

export enum CreditDebitNoteStatus {
  Draft = 'Draft',
  Issued = 'Issued',
}

export interface CreditDebitNote {
  id: string;
  noteNumber: string;
  type: CreditDebitNoteType;
  customer: Customer;
  invoiceId?: string; // Optional: Link to an original invoice
  issueDate: string;
  amount: number;
  reason: string;
  status: CreditDebitNoteStatus;
}

export interface NavItem {
  label: string;
  path?: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  children?: NavItem[];
}

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortKey?: keyof T; // Used for sorting columns with function accessors
}

export enum UserRole {
  Admin = 'Admin',
  Accountant = 'Accountant',
  Sales = 'Sales',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Password should be optional on the client-side representation
  companyId: string;
  role: UserRole;
}

export enum TaxType {
  GST = 'GST',
  Cess = 'Cess',
  TDS = 'TDS',
}

export interface Tax {
  id: string;
  name: string;
  type: TaxType;
  rate: number;
  description?: string;
}

export enum AccountType {
  Asset = 'Asset',
  Liability = 'Liability',
  Equity = 'Equity',
  Income = 'Income',
  Expense = 'Expense',
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
}

export interface JournalVoucherEntry {
  accountId: string;
  debit: number;
  credit: number;
}

export interface JournalVoucher {
  id: string;
  voucherNumber: string;
  date: string;
  narration: string;
  entries: JournalVoucherEntry[];
}

export interface BankStatementTransaction {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
}

export interface Gstr1B2BSummary {
  id: string; // invoice id
  gstin: string;
  receiverName: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceValue: number;
  placeOfSupply: string;
  taxableValue: number;
  igst: number;
  cgst: number;
  sgst: number;
}

export interface Gstr1B2CSummary {
  id: string; // combination of state and rate
  placeOfSupply: string;
  taxRate: number;
  taxableValue: number;
  igst: number;
  cgst: number;
  sgst: number;
}

export interface Gstr1HsnSummary {
  id: string; // hsn code
  hsnCode: string;
  description: string;
  uqc: ProductUnit;
  totalQuantity: number;
  totalValue: number;
  taxableValue: number;
  igst: number;
  cgst: number;
  sgst: number;
}

export enum GRNStatus {
  Completed = 'Completed',
}

export interface GRNItem {
  product: Product;
  orderedQuantity: number;
  receivedQuantity: number;
}

export interface GRN {
  id: string;
  grnNumber: string;
  purchaseOrderId: string;
  purchaseOrderNumber: string;
  supplier: Supplier;
  grnDate: string;
  items: GRNItem[];
  status: GRNStatus;
}

export interface BOMItem {
  product: Product;
  quantity: number;
}

export interface BOM {
  id: string;
  bomNumber: string;
  product: Product; // Finished Good
  items: BOMItem[];
  creationDate: string;
}

export enum ProductionOrderStatus {
  Planned = 'Planned',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  bomId: string;
  quantityToProduce: number;
  orderDate: string;
  expectedCompletionDate: string;
  status: ProductionOrderStatus;
  actualQuantityProduced?: number;
}