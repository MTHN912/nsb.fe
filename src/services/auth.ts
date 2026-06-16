import { apiClient } from './api-client';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  suburb: string;
  postCode: string;
  phoneNumber: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  dealerId: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authService = {
  login: (data: LoginDto) => apiClient.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterDto) => apiClient.post<AuthResponse>('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  refreshToken: (token: string) => apiClient.post<AuthResponse>('/auth/refresh', { token }),
  me: () => apiClient.get<User>('/auth/me'),
};
