import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { Avatar } from '../atoms';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import styles from './css.module/Header.module.css';

interface HeaderProps {
  onMenuClick?: () => void;
  userName?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  userName = 'Admin User',
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.leftSection}>
        <button
          className={styles.iconButton}
          onClick={onMenuClick}
        >
          <Menu size={24} color="#525252" />
        </button>
        <div className={styles.searchContainer}>
          <Search size={18} color="#a3a3a3" />
          <input
            type="text"
            placeholder={t('header.searchPlaceholder')}
            className={styles.searchInput}
          />
        </div>
      </div>
      <div className={styles.rightSection}>
        <LanguageSwitcher />
        <div className={styles.notificationBadge}>
          <button className={styles.iconButton}>
            <Bell size={20} color="#525252" />
          </button>
          <span className={styles.badge}>3</span>
        </div>
        <div className={styles.userInfo}>
          <Avatar name={userName} size="md" />
          <span className={styles.userName}>{userName}</span>
        </div>
      </div>
    </header>
  );
};
