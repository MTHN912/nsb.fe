import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './css.module/LanguageSwitcher.module.css';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setIsOpen(false);
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'vi', name: 'Tiếng Việt' },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentLanguage?.name || 'Language'}
      </button>
      {isOpen && (
        <div className={styles.dropdown}>
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`${styles.option} ${lang.code === i18n.language ? styles['option--active'] : ''}`}
              onClick={() => changeLanguage(lang.code)}
            >
              {lang.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
