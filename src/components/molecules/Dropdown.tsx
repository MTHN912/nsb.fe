import React, { useState, ReactNode } from 'react';
import styles from './css.module/Dropdown.module.css';

export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${styles.container} ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      <div className={`${styles.content} ${isOpen ? styles['content--open'] : ''}`}>
        {children}
      </div>
    </div>
  );
};
