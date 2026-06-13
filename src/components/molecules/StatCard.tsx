import React from 'react';
import { Card } from '../atoms';
import { useTranslation } from 'react-i18next';
import styles from './css.module/StatCard.module.css';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <Card className={className}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.title}>{title}</div>
          <div className={styles.value}>{value}</div>
          {trend && (
            <div className={`${styles.trend} ${trend.isPositive ? styles['trend--positive'] : styles['trend--negative']}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className={styles.trendLabel}>{t('dashboard.vsLastMonth')}</span>
            </div>
          )}
        </div>
        {icon && <div className={styles.iconContainer}>{icon}</div>}
      </div>
    </Card>
  );
};
