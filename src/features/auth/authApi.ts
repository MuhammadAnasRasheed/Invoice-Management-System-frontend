import API from '../../api/axios';
import type { User } from '../../types';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const authAPI = {
  register: async (data: RegisterData) => {
    const response = await API.post('/users/register', data);
    return response.data.data;
  },
  login: async (data: LoginData) => {
    const response = await API.post('/users/login', data);
    return response.data.data;
  },
  getMe: async () => {
    const response = await API.get('/users/me');
    return response.data.data;
  },
  logout: async () => {
    const response = await API.post('/users/logout');
    return response.data;
  },
};