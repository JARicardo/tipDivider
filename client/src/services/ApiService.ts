import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASEPATH,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  async init() {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  async save(data: any) {
    try {
      const response = await apiClient.post('/example', data);
      return response.data;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },
};
