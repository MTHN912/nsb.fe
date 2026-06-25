import React, { useState, useRef, useEffect } from 'react';
import styles from './css.module/SearchableSelect.module.css';

export interface SearchableSelectOption {
  value: string | number;
  label: string;
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  label,
  error,
  required,
  placeholder,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue: string | number) => {
    onChange?.(String(optionValue));
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
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
          {selectedOption ? (
            <span className={styles.selectedValue}>{selectedOption.label}</span>
          ) : (
            <span className={styles.placeholder}>{placeholder || 'Select...'}</span>
          )}
          <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
        </div>
        {isOpen && (
          <div className={styles.options}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className={styles.optionsList}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`${styles.option} ${value === option.value ? styles.selected : ''}`}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>No results found</div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
