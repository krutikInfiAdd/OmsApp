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

export interface Product {
  id: string;
  name: string;
  hsnCode: string;
  price: number;
}

export enum InvoiceStatus {
  Paid = 'Paid',
  Pending = 'Pending',
  Overdue = 'Overdue',
  Draft = 'Draft',
}

export interface InvoiceItem {
  product: Product;
  quantity: number;
  rate: number;
  tax: number;
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

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Password should be optional on the client-side representation
  companyId: string;
}
