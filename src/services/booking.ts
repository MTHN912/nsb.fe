import { apiClient } from './api-client';

export interface Booking {
  id: string;
  customerId: string;
  staffId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  customerId: string;
  staffId: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}

export const bookingService = {
  getAll: () => apiClient.get<Booking[]>('/bookings'),
  getById: (id: string) => apiClient.get<Booking>(`/bookings/${id}`),
  create: (data: CreateBookingDto) => apiClient.post<Booking>('/bookings', data),
  update: (id: string, data: Partial<Booking>) => apiClient.patch<Booking>(`/bookings/${id}`, data),
  delete: (id: string) => apiClient.delete(`/bookings/${id}`),
  getByDate: (date: string) => apiClient.get<Booking[]>(`/bookings?date=${date}`),
  getByStaff: (staffId: string) => apiClient.get<Booking[]>(`/bookings?staffId=${staffId}`),
};
