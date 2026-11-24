import API from '../../api/axios';

export interface StatusItem {
  id: number | string;
  name: string;
  label: string;
  color: string;
  isTerminal: boolean;
  displayOrder?: number;
}

export const statusAPI = {
  getAll: async () => {
    const response = await API.get('/statuses');
    return response.data.data;
  },
  getTransitions: async (statusId: string | number) => {
    const response = await API.get(`/statuses/${statusId}/transitions`);
    return response.data.data;
  },
};