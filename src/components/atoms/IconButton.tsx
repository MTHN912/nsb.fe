import React from 'react';
import { Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import styles from './css.module/IconButton.module.css';

export type IconButtonVariant = 'edit' | 'delete' | 'active' | 'inactive';

export interface IconButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: IconButtonVariant;
  className?: string;
  children?: React.ReactNode;
  title?: string;
}

const iconMap: Record<IconButtonVariant, React.ReactNode> = {
  edit: <Pencil size={16} />,
  delete: <Trash2 size={16} />,
  active: <CheckCircle size={16} />,
  inactive: <XCircle size={16} />,
};

export const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  disabled = false,
  variant,
  className,
  children,
  title,
}) => {
  const variantClass = variant ? styles[`iconButton--${variant}`] : '';
  const disabledClass = disabled ? styles['iconButton--disabled'] : '';

  return (
    <button
      className={`${styles.iconButton} ${variantClass} ${disabledClass} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children || (variant && iconMap[variant])}
    </button>
  );
};
