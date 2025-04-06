import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASEPATH,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default class APIService {
  async init() {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  }

  async paymentMethods() {
    try {
      const response = await apiClient.get('/payment-methods');
      return response.data;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }

  async payments() {
    try {
      const response = await apiClient.get('/payments');
      return response.data;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  }

  async saveTip(tip: any) {
    try {
      const response = await apiClient.post('/tips', tip);
      return response.data;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }

  async savePayment(payment: any) {
    try {
      const response = await apiClient.post('/payments', payment);
      return response.data;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }
}

export const apiService = new APIService();
