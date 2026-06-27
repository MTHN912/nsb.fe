import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth';
import { STORAGE_KEYS } from '../../utils/constants';

export const AuthCheck: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      
      if (!token && location.pathname !== '/login') {
        navigate('/login');
        return;
      }

      if (token && location.pathname === '/login') {
        navigate('/dashboard');
        return;
      }

      if (token) {
        try {
          await authService.getProfile();
        } catch (error: any) {
          if (error.response?.status === 401) {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
            localStorage.removeItem(STORAGE_KEYS.AUTH_RESPONSE);
            sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            sessionStorage.removeItem(STORAGE_KEYS.AUTH_USER);
            sessionStorage.removeItem(STORAGE_KEYS.AUTH_RESPONSE);
            
            if (location.pathname !== '/login') {
              navigate('/login');
            }
          }
        }
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 300000);

    return () => clearInterval(interval);
  }, [navigate, location.pathname]);

  return null;
};
