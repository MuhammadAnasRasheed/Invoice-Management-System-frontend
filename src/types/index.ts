export interface User {
  id: number | string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  id: number | string;
  name: string;
  address: string;
  city: string;
  country: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber?: string;
  shopId?: number | string | null;
  shop?: Shop | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: number | string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type InvoiceStatus =
  | 'draft'
  | 'pending'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export interface Invoice {
  id: number | string;
  invoiceNumber: string;
  customer: Customer;
  shop?: Shop | null;
  shopId?: number | string | null;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: InvoiceStatus;
  notes?: string;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isError: boolean;
  message: string;
}

export interface ShopState {
  shops: Shop[];
  currentShop: Shop | null;
  selectedShopId: string | number | 'all';
  isLoading: boolean;
  isError: boolean;
  message: string;
}

export interface CustomerState {
  customers: Customer[];
  currentCustomer: Customer | null;
  isLoading: boolean;
  isError: boolean;
  message: string;
}

export interface InvoiceState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  customerInvoices: Invoice[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}
