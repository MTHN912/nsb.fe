import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { authService, LoginDto, AuthResponse } from '../services/auth';
import { STORAGE_KEYS } from '../utils/constants';

interface UseAuthReturn {
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: AuthResponse['user'] | null;
}

const clearAuthData = () => {
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
};

export const useAuth = (): UseAuthReturn => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthResponse['user'] | null>(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  });

  const login = useCallback(async (credentials: LoginDto) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      const { access_token, user: userData } = response.data;

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEYS.AUTH_RESPONSE, JSON.stringify(response.data));

      sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      sessionStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userData));
      sessionStorage.setItem(STORAGE_KEYS.AUTH_RESPONSE, JSON.stringify(response.data));

      setUser(userData);
      setIsAuthenticated(true);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || t('login.errors.loginFailed');
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  return {
    login,
    logout,
    isLoading,
    error,
    isAuthenticated,
    user,
  };
};
