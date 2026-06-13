export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalBookings: number;
  todayBookings: number;
  totalCustomers: number;
  activeStaff: number;
  revenue: number;
  monthlyRevenue: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
}

export interface Staff {
  id: string;
  userId: string;
  name: string;
  specialization: string[];
  rating: number;
  isActive: boolean;
  workingHours: {
    start: string;
    end: string;
  };
}
