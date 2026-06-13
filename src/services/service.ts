import { apiClient } from './api-client';

export interface Service {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  durationUnit: string;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchServicesDto {
  skip: number;
  take: number;
  where?: Record<string, any>;
  orderBy?: Record<string, string>;
}

export interface SearchServicesResponse {
  data: Service[];
  total: number;
}

export const serviceService = {
  search: (params: SearchServicesDto) => apiClient.post<SearchServicesResponse>('/services/search', params),
  getAll: () => apiClient.get<Service[]>('/services'),
  getById: (id: number) => apiClient.get<Service>(`/services/${id}`),
  create: (data: Partial<Service>) => apiClient.post<Service>('/services', data),
  update: (id: number, data: Partial<Service>) => apiClient.patch<Service>(`/services/${id}`, data),
  delete: (id: number) => apiClient.delete(`/services/${id}`),
};
