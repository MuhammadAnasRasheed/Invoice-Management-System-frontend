import API from '../../api/axios';
import type { Customer } from '../../types';

export const customerAPI = {
  getAll: async (searchTerm?: string, shopId?: string | number) => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (shopId && shopId !== 'all') params.append('shopId', String(shopId));
    const queryString = params.toString();
    const url = queryString ? `/customers?${queryString}` : '/customers';
    const response = await API.get(url);
    return response.data.data;
  },
  getById: async (id: string | number) => {
    const response = await API.get(`/customers/${id}`);
    return response.data.data;
  },
  create: async (data: Partial<Customer>) => {
    const response = await API.post('/customers', data);
    return response.data.data;
  },
  update: async (id: string | number, data: Partial<Customer>) => {
    const response = await API.put(`/customers/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string | number) => {
    const response = await API.delete(`/customers/${id}`);
    return response.data;
  },
};
