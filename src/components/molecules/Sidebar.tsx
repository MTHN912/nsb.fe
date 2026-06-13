import React, { useState } from 'react';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Building2, ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '../atoms';
import styles from './css.module/Sidebar.module.css';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path?: string;
  active?: boolean;
  children?: SidebarItem[];
}

interface SidebarProps {
  items?: SidebarItem[];
  onItemClick?: (path: string) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  onItemClick,
  className = '',
}) => {
  const { t } = useTranslation();

  const [activePath, setActivePath] = useState('/dashboard');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const sidebarItems = items || [
    { icon: <LayoutDashboard size={20} />, label: t('sidebar.dashboard'), path: '/dashboard', active: activePath === '/dashboard' },
    { icon: <Calendar size={20} />, label: t('sidebar.bookings'), path: '/bookings', active: activePath === '/bookings' },
    { icon: <Users size={20} />, label: t('sidebar.customers'), path: '/customers', active: activePath === '/customers' },
    {
      icon: <Users size={20} />,
      label: t('sidebar.users'),
      children: [
        { icon: <Users size={16} />, label: t('sidebar.staff'), path: '/staff', active: activePath === '/staff' },
        { icon: <LayoutDashboard size={16} />, label: t('sidebar.userIncome'), path: '/user-income', active: activePath === '/user-income' },
      ],
    },
    { icon: <Building2 size={20} />, label: t('sidebar.dealer'), path: '/dealer', active: activePath === '/dealer' },
    { icon: <Settings size={20} />, label: t('sidebar.settings'), path: '/settings', active: activePath === '/settings' },
  ];

  const handleItemClick = (path: string) => {
    setActivePath(path);
    onItemClick?.(path);
  };

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <aside className={`${styles.sidebar} ${className}`}>
      <div className={styles.logo}> Online Service Booking</div>
      <nav className={styles.nav}>
        {sidebarItems.map((item, index) => {
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openDropdown === item.label;

          return (
            <div key={index} className={styles.dropdownContainer}>
              <MenuItem
                icon={item.icon}
                active={item.active}
                onClick={() => {
                  if (hasChildren) {
                    handleDropdownToggle(item.label);
                  } else if (item.path) {
                    handleItemClick(item.path);
                  }
                }}
              >
                <span style={{ flex: 1 }}>{item.label}</span>
                {hasChildren && (
                  isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                )}
              </MenuItem>
              {hasChildren && isOpen && (
                <div>
                  {item.children?.map((child, childIndex) => (
                    <MenuItem
                      key={childIndex}
                      icon={child.icon}
                      label={child.label}
                      active={child.active}
                      onClick={() => child.path && handleItemClick(child.path)}
                      className={styles.dropdownItem}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className={styles.footer}>
        <div
          className={styles.logoutItem}
          onClick={() => console.log('Logout')}
        >
          <LogOut size={20} />
          <span>{t('sidebar.logout')}</span>
        </div>
      </div>
    </aside>
  );
};

