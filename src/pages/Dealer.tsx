import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './css.module/Dealer.module.css';

export const Dealer: React.FC = () => {
  const { t } = useTranslation();


  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('dealer.title')}</h1>
        <p className={styles.subtitle}>{t('dealer.subtitle')}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.comingSoon}>
          {t('dashboard.comingSoon')}
        </div>
      </div>
    </div>
  );
};
