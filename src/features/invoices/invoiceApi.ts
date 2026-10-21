import API from '../../api/axios';

export interface CreateInvoiceData {
  customerId: string | number;
  items: Array<{ description: string; quantity: number; unitPrice: number }>;
  issueDate: string;
  dueDate: string;
  tax?: number;
  discount?: number;
  notes?: string;
}

export const invoiceAPI = {
  getAll: async (searchTerm?: string) => {
    const url = searchTerm ? `/invoices?search=${encodeURIComponent(searchTerm)}` : '/invoices';
    const response = await API.get(url);
    return response.data.data;
  },
  getById: async (id: string | number) => {
    const response = await API.get(`/invoices/${id}`);
    return response.data.data;
  },
  create: async (data: CreateInvoiceData) => {
    const response = await API.post('/invoices', data);
    return response.data.data;
  },
  updateStatus: async (id: string | number, status: string) => {
    const response = await API.patch(`/invoices/${id}/status`, { status });
    return response.data.data;
  },
  delete: async (id: string | number) => {
    const response = await API.delete(`/invoices/${id}`);
    return response.data;
  },
  getByCustomerId: async (customerId: string | number) => {
    const response = await API.get(`/invoices/customer/${customerId}`);
    return response.data.data;
  },
};
