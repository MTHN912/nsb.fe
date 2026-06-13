import { apiClient } from './api-client';

export interface UserIncomeData {
  id: number;
  userId: number;
  inComeDate: string;
  staffComissonId: number;
  staffTipsId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  staffCommission: {
    amount: number;
  };
  staffTip: {
    amount: number;
  };
  services: Array<{
    service: {
      price: number;
    };
  }>;
}

export interface SearchIncomeDto {
  skip: number;
  take: number;
  where?: Record<string, any>;
  orderBy?: Record<string, string>;
}

export interface SearchIncomeResponse {
  data: UserIncomeData[];
  total: number;
}

export interface CreateIncomeDto {
  userId: number;
  inComeDate: string;
  serviceIncome: number;
  tipsIncome: number;
  serviceId: number[];
}

export const incomeService = {
  search: (params: SearchIncomeDto) => apiClient.post<SearchIncomeResponse>('/income/search', params),
  getAll: () => apiClient.get<UserIncomeData[]>('/income'),
  getById: (id: number) => apiClient.get<UserIncomeData>(`/income/${id}`),
  getByUser: (userId: number) => apiClient.get<UserIncomeData[]>(`/income/user/${userId}`),
  create: (data: CreateIncomeDto) => apiClient.post<UserIncomeData>('/income', data),
  update: (id: number, data: Partial<CreateIncomeDto>) => apiClient.patch<UserIncomeData>(`/income/${id}`, data),
};
