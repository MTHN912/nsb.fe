import React, { useState } from 'react';
import styles from './css.module/Select.module.css';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({
  options,
  label,
  error,
  required,
  onChange,
  className,
  ...props
}) => {
  const [hasValue, setHasValue] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setHasValue(value !== '');
    onChange?.(value);
  };

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <select
        className={`${styles.select} ${hasValue ? styles.hasValue : ''} ${error ? styles.error : ''} ${className || ''}`}
        onChange={handleChange}
        required={required}
        {...props}
      >
        <option value="">{props.placeholder || 'Select...'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
