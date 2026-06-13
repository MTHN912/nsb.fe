import { apiClient } from './api-client';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}

export const customerService = {
  getAll: () => apiClient.get<Customer[]>('/customers'),
  getById: (id: string) => apiClient.get<Customer>(`/customers/${id}`),
  create: (data: CreateCustomerDto) => apiClient.post<Customer>('/customers', data),
  update: (id: string, data: Partial<Customer>) => apiClient.patch<Customer>(`/customers/${id}`, data),
  delete: (id: string) => apiClient.delete(`/customers/${id}`),
  search: (query: string) => apiClient.get<Customer[]>(`/customers/search?q=${query}`),
};
