import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './css.module/Bookings.module.css';

export const Bookings: React.FC = () => {
  const { t } = useTranslation();


  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('bookings.title')}</h1>
        <p className={styles.subtitle}>{t('bookings.subtitle')}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.comingSoon}>
          {t('dashboard.comingSoon')}
        </div>
      </div>
    </div>
  );
};
