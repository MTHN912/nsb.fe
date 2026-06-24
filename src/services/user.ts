import { apiClient } from './api-client';

export interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Dealer {
  id: number;
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  createdAt: string;
  role: Role;
}

export interface User {
  id: number;
  email: string | null;
  password: string | null;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  avatar: string | null;
  dateOfBirth: string | null;
  gender: 'male' | 'female' | 'other';
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  dealerId: number;
  roles: UserRole[];
  dealer: Dealer;
}

export interface SearchUsersDto {
  skip: number;
  take: number;
  where?: Record<string, any>;
  orderBy?: Record<string, string>;
}

export interface SearchUsersResponse {
  data: User[];
  total: number;
}

export interface CreateStaffDto {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber: string;
}

export const userService = {
  search: (params: SearchUsersDto) => apiClient.post<SearchUsersResponse>('/users/search', params),
  getAll: () => apiClient.get<User[]>('/users'),
  getById: (id: number) => apiClient.get<User>(`/users/${id}`),
  create: (data: Partial<User>) => apiClient.post<User>('/users', data),
  createStaff: (data: CreateStaffDto) => apiClient.post<User>('/users/staff', data),
  update: (id: number, data: Partial<User>) => apiClient.patch<User>(`/users/${id}`, data),
  delete: (id: number) => apiClient.delete(`/users/${id}`),
  updateStatus: (id: number, status: boolean) =>
    apiClient.patch<User>(`/users/${id}/status`, { isActive: status }),
};
