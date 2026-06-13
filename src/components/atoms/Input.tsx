import React from 'react';
import styles from './css.module/Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  const inputClasses = [
    styles.input,
    icon && styles['input--hasIcon'],
    error && styles['input--error'],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputContainer}>
        <input
          className={inputClasses}
          {...props}
        />
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
