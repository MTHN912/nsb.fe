import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { STORAGE_KEYS } from '../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
          localStorage.removeItem(STORAGE_KEYS.AUTH_RESPONSE);
          sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          sessionStorage.removeItem(STORAGE_KEYS.AUTH_USER);
          sessionStorage.removeItem(STORAGE_KEYS.AUTH_RESPONSE);
          document.cookie.split(';').forEach(cookie => {
            const cookieName = cookie.split('=')[0].trim();
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          });
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public get<T = any>(url: string, config?: InternalAxiosRequestConfig) {
    return this.client.get<T>(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig) {
    return this.client.post<T>(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig) {
    return this.client.put<T>(url, data, config);
  }

  public patch<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig) {
    return this.client.patch<T>(url, data, config);
  }

  public delete<T = any>(url: string, config?: InternalAxiosRequestConfig) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
