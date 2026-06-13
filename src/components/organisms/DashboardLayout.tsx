import React from 'react';
import { Sidebar, Header } from '../molecules';
import styles from './css.module/DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePath?: string;
  onNavigate?: (path: string) => void;
  userName?: string;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  onNavigate,
  userName = 'Admin User',
  className = '',
}) => {
  return (
    <>
      <Sidebar onItemClick={onNavigate} />
      <Header userName={userName} />
      <main className={`${styles.main} ${className}`}>
        {children}
      </main>
    </>
  );
};
