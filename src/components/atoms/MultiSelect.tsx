import React, { useState } from 'react';
import styles from './css.module/MultiSelect.module.css';

export interface MultiSelectOption {
  value: string | number;
  label: string;
  price?: number;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  selectedValues: (string | number)[];
  onChange: (values: (string | number)[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  label,
  error,
  required,
  placeholder,
  selectedValues,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value: string | number) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const selectedOptions = options.filter((opt) => selectedValues.includes(opt.value));

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.dropdown}>
        <div
          className={`${styles.selectBox} ${error ? styles.error : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOptions.length > 0 ? (
            <div className={styles.selectedItems}>
              {selectedOptions.map((opt) => (
                <span key={opt.value} className={styles.chip}>
                  {opt.label}
                  <button
                    type="button"
                    className={styles.removeChip}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(opt.value);
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <span className={styles.placeholder}>{placeholder || 'Select...'}</span>
          )}
          <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
        </div>
        {isOpen && (
          <div className={styles.options}>
            {options.map((option) => (
              <div
                key={option.value}
                className={`${styles.option} ${selectedValues.includes(option.value) ? styles.selected : ''}`}
                onClick={() => toggleOption(option.value)}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => toggleOption(option.value)}
                  className={styles.checkbox}
                />
                <span>{option.label}</span>
                {option.price !== undefined && (
                  <span className={styles.price}>${option.price.toFixed(2)}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
