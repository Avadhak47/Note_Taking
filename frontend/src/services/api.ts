import axios, { AxiosResponse } from 'axios';
import { User, Note, SignupFormData, LoginFormData, OTPFormData, NoteFormData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data: SignupFormData): Promise<AxiosResponse<{ message: string; userId: string }>> =>
    api.post('/auth/signup', data),
  
  verifyOTP: (data: OTPFormData): Promise<AxiosResponse<{ message: string; token: string; user: User }>> =>
    api.post('/auth/verify-otp', data),
  
  login: (data: LoginFormData): Promise<AxiosResponse<{ message: string; token: string; user: User }>> =>
    api.post('/auth/login', data),
  
  resendOTP: (email: string): Promise<AxiosResponse<{ message: string }>> =>
    api.post('/auth/resend-otp', { email }),
  
  getProfile: (): Promise<AxiosResponse<{ user: User }>> =>
    api.get('/auth/profile'),
  
  googleAuth: (): string =>
    `${API_BASE_URL}/auth/google`,
};

// Notes API
export const notesAPI = {
  getNotes: (params?: { page?: number; limit?: number; search?: string; tag?: string }): Promise<AxiosResponse<{ 
    notes: Note[]; 
    pagination: { page: number; limit: number; total: number; pages: number } 
  }>> =>
    api.get('/notes', { params }),
  
  getNoteById: (id: string): Promise<AxiosResponse<{ note: Note }>> =>
    api.get(`/notes/${id}`),
  
  createNote: (data: NoteFormData): Promise<AxiosResponse<{ message: string; note: Note }>> =>
    api.post('/notes', data),
  
  updateNote: (id: string, data: Partial<NoteFormData>): Promise<AxiosResponse<{ message: string; note: Note }>> =>
    api.put(`/notes/${id}`, data),
  
  deleteNote: (id: string): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/notes/${id}`),
  
  togglePin: (id: string): Promise<AxiosResponse<{ message: string; note: Note }>> =>
    api.patch(`/notes/${id}/toggle-pin`),
};

export default api;
