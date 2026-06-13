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

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const authService = {
  login: (data: LoginDto) => apiClient.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterDto) => apiClient.post<AuthResponse>('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  refreshToken: (token: string) => apiClient.post<AuthResponse>('/auth/refresh', { token }),
  me: () => apiClient.get<AuthResponse['user']>('/auth/me'),
};
