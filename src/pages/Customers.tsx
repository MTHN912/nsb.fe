import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './css.module/Customers.module.css';

export const Customers: React.FC = () => {
  const { t } = useTranslation();


  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('customers.title')}</h1>
        <p className={styles.subtitle}>{t('customers.subtitle')}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.comingSoon}>
          {t('dashboard.comingSoon')}
        </div>
      </div>
    </div>
  );
};
