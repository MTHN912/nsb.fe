import React, { useState, useRef, useEffect } from 'react';
import styles from './css.module/SearchableMultiSelect.module.css';

export interface SearchableMultiSelectOption {
  value: string | number;
  label: string;
  price?: number;
}

export interface SearchableMultiSelectProps {
  options: SearchableMultiSelectOption[];
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  selectedValues: (string | number)[];
  onChange: (values: (string | number)[]) => void;
}

export const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  options,
  label,
  error,
  required,
  placeholder,
  selectedValues,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOption = (value: string | number) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const selectedOptions = options.filter((opt) => selectedValues.includes(opt.value));

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
