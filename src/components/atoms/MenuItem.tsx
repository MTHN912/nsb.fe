import React from 'react';
import styles from './css.module/MenuItem.module.css';

export interface MenuItemProps {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  active?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  onClick,
  active = false,
  children,
  className = '',
}) => {
  const menuItemClasses = [
    styles.menuItem,
    active && styles['menuItem--active'],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={menuItemClasses}
      onClick={onClick}
    >
      {icon}
      {label && <span>{label}</span>}
      {children}
    </div>
  );
};
