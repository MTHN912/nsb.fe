import React, { useEffect, useState } from 'react';
import styles from './css.module/Toast.module.css';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`${styles.toast} ${styles[`toast--${type}`]}`}>
      <button className={styles.toast__close} onClick={() => { setVisible(false); onClose?.(); }}>
        ×
      </button>
      {title && <div className={styles.toast__title}>{title}</div>}
      <div className={styles.toast__message}>{message}</div>
    </div>
  );
};
