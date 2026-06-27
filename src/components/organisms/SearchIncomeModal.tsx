import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, FormField } from '../molecules';
import { Button, Input, SearchableSelect } from '../atoms';
import { userService, type User } from '../../services/user';
import { storage } from '../../utils/storage';
import { ROLE_CODES } from '../../utils/constants';
import type { UserIncomeData } from '../../services/income';
import styles from './css.module/SearchIncomeModal.module.css';

export interface SearchIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (userId: string, startDate: string, endDate: string) => Promise<UserIncomeData[]>;
}

export const SearchIncomeModal: React.FC<SearchIncomeModalProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    userId: '',
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchResults, setSearchResults] = useState<UserIncomeData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchUsers = async () => {
    try {
      const cachedUsers = storage.get<User[]>('staff_users');
      if (cachedUsers) {
        setUsers(cachedUsers);
        return;
      }

      const response = await userService.search({
        skip: 0,
        take: 100,
        where: {
          roles: {
            some: {
              role: {
                code: ROLE_CODES.STAFF
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      });
      setUsers(response.data.data);
      storage.set('staff_users', response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.userId) {
      newErrors.userId = t('userIncome.form.errors.userRequired');
    }
    if (!formData.startDate) {
      newErrors.startDate = t('userIncome.form.errors.startDateRequired');
    }
    if (!formData.endDate) {
      newErrors.endDate = t('userIncome.form.errors.endDateRequired');
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = t('userIncome.form.errors.endDateAfterStart');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSearching(true);
      const results = await onSearch(formData.userId, formData.startDate, formData.endDate);
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching income:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        {t('common.close')}
      </Button>
      {hasSearched ? (
        <Button onClick={() => setHasSearched(false)}>
          {t('common.newSearch')}
        </Button>
      ) : (
        <Button onClick={handleSubmit} disabled={isSearching}>
          {isSearching ? t('common.loading') : t('common.search')}
        </Button>
      )}
    </>
  );

  const totalServiceIncome = searchResults.reduce((sum, income) => {
    const serviceIncome = income.services.reduce((s, item) => s + item.service.price, 0);
    return sum + serviceIncome;
  }, 0);

  const totalTips = searchResults.reduce((sum, income) => sum + (income.staffTip?.amount || 0), 0);

  const totalIncome = totalServiceIncome + totalTips;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('userIncome.searchModal.title')}
      footer={footer}
    >
      {!hasSearched ? (
        <form onSubmit={handleSubmit}>
          <FormField
            label={t('userIncome.form.user')}
            error={errors.userId}
            required
          >
            <SearchableSelect
              value={formData.userId}
              onChange={(value) => setFormData((prev) => ({ ...prev, userId: value }))}
              placeholder={t('userIncome.form.placeholders.user')}
              options={users.map(user => ({
                value: user.id,
                label: `${user.firstName} ${user.lastName}`
              }))}
            />
          </FormField>

          <FormField
            label={t('userIncome.searchModal.startDate')}
            error={errors.startDate}
            required
          >
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
            />
          </FormField>

          <FormField
            label={t('userIncome.searchModal.endDate')}
            error={errors.endDate}
            required
          >
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </FormField>
        </form>
      ) : (
        <div className={styles.resultsContainer}>
          {searchResults.length === 0 ? (
            <p className={styles.noResults}>{t('userIncome.searchModal.noResults')}</p>
          ) : (
            <>
              <div className={styles.resultsList}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t('userIncome.columns.incomeDate')}</th>
                      <th>{t('userIncome.columns.serviceIncome')}</th>
                      <th>{t('userIncome.columns.tipsIncome')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((income) => (
                      <tr key={income.id}>
                        <td>{new Date(income.inComeDate).toLocaleDateString('en-GB', { timeZone: 'UTC' })}</td>
                        <td>
                          ${income.services.reduce((sum, item) => sum + item.service.price, 0).toFixed(2)}
                        </td>
                        <td>${(income.staffTip?.amount || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>{t('userIncome.summary.totalServiceIncome')}:</span>
                    <span className={styles.summaryValue}>${totalServiceIncome.toFixed(2)}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>{t('userIncome.summary.totalTips')}:</span>
                    <span className={styles.summaryValue}>${totalTips.toFixed(2)}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>{t('userIncome.summary.totalIncome')}:</span>
                    <span className={styles.summaryValue}>${totalIncome.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};
