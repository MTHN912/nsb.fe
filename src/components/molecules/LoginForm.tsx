import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../atoms';
import { useAuth } from '../../hooks/useAuth';
import { LoginDto } from '../../services/auth';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import styles from './css.module/LoginForm.module.css';

interface LoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, className = '' }) => {
  const { t } = useTranslation();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!formData.email) {
      errors.email = t('login.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('login.errors.emailInvalid');
    }

    if (!formData.password) {
      errors.password = t('login.errors.passwordRequired');
    } else if (formData.password.length < 6) {
      errors.password = t('login.errors.passwordMinLength');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      onSuccess?.();
    } catch (err) {
      // Error is already handled by useAuth hook
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error for the field being changed
    setValidationErrors(prev => ({ ...prev, [name]: undefined }));
  };

  return (
    <form className={`${styles.loginForm} ${className}`} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('login.title')}</h2>
        <p className={styles.subtitle}>{t('login.subtitle')}</p>
      </div>

      <div className={styles.fields}>
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <Mail className={styles.inputIcon} size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('login.emailPlaceholder')}
              className={`${styles.input} ${validationErrors.email ? styles.inputError : ''}`}
            />
          </div>
          {validationErrors.email && <span className={styles.fieldError}>{validationErrors.email}</span>}
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <Lock className={styles.inputIcon} size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('login.passwordPlaceholder')}
              className={`${styles.input} ${validationErrors.password ? styles.inputError : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.togglePassword}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {validationErrors.password && <span className={styles.fieldError}>{validationErrors.password}</span>}
        </div>
      </div>

      <div className={styles.formOptions}>
        <label className={styles.rememberMe}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className={styles.checkbox}
          />
          <span>{t('login.rememberMe')}</span>
        </label>
        <a href="/forgot-password" className={styles.forgotPassword}>
          {t('login.forgotPassword')}
        </a>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className={styles.submitButton}
      >
        <LogIn size={20} className={styles.buttonIcon} />
        {t('login.signIn')}
      </Button>

      <div className={styles.divider}>
        <span>{t('login.or')}</span>
      </div>

      <div className={styles.socialLogin}>
        <button type="button" className={styles.socialButton}>
          <svg className={styles.socialIcon} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t('login.signInWithGoogle')}
        </button>
        <button type="button" className={styles.socialButton}>
          <svg className={styles.socialIcon} viewBox="0 0 24 24">
            <path fill="#00A1F1" d="M11.4 24H0V12.6L11.4 0h12v12L11.4 24z"/>
            <path fill="#0078D4" d="M11.4 24V12.6H0"/>
          </svg>
          {t('login.signInWithMicrosoft')}
        </button>
      </div>
    </form>
  );
};
