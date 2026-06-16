import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { authService, LoginDto, AuthResponse } from '../services/auth';

interface UseAuthReturn {
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: AuthResponse['user'] | null;
}

export const useAuth = (): UseAuthReturn => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthResponse['user'] | null>(() => {
    const storedUser = localStorage.getItem('auth_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('access_token');
  });

  const login = useCallback(async (credentials: LoginDto) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      const { access_token, user: userData } = response.data;
      
      // Store in localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_response', JSON.stringify(response.data));
      
      // Store in sessionStorage
      sessionStorage.setItem('access_token', access_token);
      sessionStorage.setItem('auth_user', JSON.stringify(userData));
      sessionStorage.setItem('auth_response', JSON.stringify(response.data));
      
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

  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_response');
    
    // Clear sessionStorage
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_response');
    
    setUser(null);
    setIsAuthenticated(false);
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
