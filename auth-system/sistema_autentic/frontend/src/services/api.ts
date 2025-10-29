import axios from 'axios';
import { LoginData, ApiResponse, User } from '../types/auth';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token às requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (data: LoginData): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await api.post('/login', data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/logout');
    localStorage.removeItem('token');
    return response.data;
  },

  verifyToken: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/verify');
    return response.data;
  }
};