import API from '../../api/axios';
import type { Shop } from '../../types';

export const shopAPI = {
  getAll: async (searchTerm?: string) => {
    const url = searchTerm ? `/shops?search=${encodeURIComponent(searchTerm)}` : '/shops';
    const response = await API.get(url);
    return response.data.data;
  },
  getById: async (id: string | number) => {
    const response = await API.get(`/shops/${id}`);
    return response.data.data;
  },
  create: async (data: Partial<Shop>) => {
    const response = await API.post('/shops', data);
    return response.data.data;
  },
  update: async (id: string | number, data: Partial<Shop>) => {
    const response = await API.put(`/shops/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string | number) => {
    const response = await API.delete(`/shops/${id}`);
    return response.data;
  },
};

