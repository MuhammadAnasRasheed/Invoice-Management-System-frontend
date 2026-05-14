import API from '../../api/axios';
import type { Customer } from '../../types';

export const customerAPI = {
  getAll: async () => {
    const response = await API.get('/customers');
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await API.get(`/customers/${id}`);
    return response.data.data;
  },
  create: async (data: Partial<Customer>) => {
    const response = await API.post('/customers', data);
    return response.data.data;
  },
  update: async (id: string, data: Partial<Customer>) => {
    const response = await API.put(`/customers/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    const response = await API.delete(`/customers/${id}`);
    return response.data;
  },
};