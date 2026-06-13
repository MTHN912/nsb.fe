import React, { useEffect, useState } from 'react';
import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import { StatCard } from '../components';
import { DashboardStats } from '../types';
import { useTranslation } from 'react-i18next';
import styles from './css.module/Dashboard.module.css';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    todayBookings: 0,
    totalCustomers: 0,
    activeStaff: 0,
    revenue: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalBookings: 0,
        todayBookings: 0,
        totalCustomers: 0,
        activeStaff: 0,
        revenue: 0,
        monthlyRevenue: 0,
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div>{t('dashboard.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('dashboard.title')}</h1>
        <p className={styles.subtitle}>{t('dashboard.subtitle')}</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          title={t('dashboard.totalBookings')}
          value={stats.totalBookings}
          icon={<Calendar size={24} />}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title={t('dashboard.todayBookings')}
          value={stats.todayBookings}
          icon={<Calendar size={24} />}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title={t('dashboard.totalCustomers')}
          value={stats.totalCustomers}
          icon={<Users size={24} />}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title={t('dashboard.activeStaff')}
          value={stats.activeStaff}
          icon={<TrendingUp size={24} />}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title={t('dashboard.revenue')}
          value="0"
          icon={<DollarSign size={24} />}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title={t('dashboard.monthlyRevenue')}
          value="0"
          icon={<DollarSign size={24} />}
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      <div className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>{t('dashboard.recentBookings')}</h2>
        <div className={styles.comingSoon}>
          {t('dashboard.comingSoon')}
        </div>
      </div>
    </div>
  );
};
