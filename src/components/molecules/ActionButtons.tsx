import React from 'react';
import { IconButton } from '../atoms';
import styles from './css.module/ActionButtons.module.css';

export interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleActive?: () => void;
  isActive?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showActive?: boolean;
  editTitle?: string;
  deleteTitle?: string;
  activeTitle?: string;
  inactiveTitle?: string;
  className?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  onToggleActive,
  isActive = false,
  showEdit = true,
  showDelete = true,
  showActive = true,
  editTitle,
  deleteTitle,
  activeTitle,
  inactiveTitle,
  className,
}) => {
  return (
    <div className={`${styles.actionButtons} ${className || ''}`}>
      {showEdit && onEdit && (
        <IconButton
          variant="edit"
          onClick={onEdit}
          title={editTitle}
        />
      )}
      {showDelete && onDelete && (
        <IconButton
          variant="delete"
          onClick={onDelete}
          title={deleteTitle}
        />
      )}
      {showActive && onToggleActive && (
        <IconButton
          variant={isActive ? 'active' : 'inactive'}
          onClick={onToggleActive}
          title={isActive ? activeTitle : inactiveTitle}
        />
      )}
    </div>
  );
};
