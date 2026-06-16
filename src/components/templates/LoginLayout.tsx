import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './css.module/LoginLayout.module.css';

interface LoginLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const LoginLayout: React.FC<LoginLayoutProps> = ({ children, className = '' }) => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.loginLayout} ${className}`}>
      <div className={styles.contentWrapper}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>{t('login.welcomeTitle')}</h1>
          <p className={styles.welcomeSubtitle}>{t('login.welcomeSubtitle')}</p>
          <div className={styles.wavePattern}></div>
        </div>
        <div className={styles.formSection}>
          {children}
        </div>
      </div>
    </div>
  );
};
