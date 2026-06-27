import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { incomeService } from '../services/income';
import type { UserIncomeData } from '../services/income';
import { DataTable, Button, ActionButtons, AddIncomeModal, SearchIncomeModal, Input } from '../components';
import { TableColumn } from '../components/atoms';
import { getStartOfDayInTimezone, getEndOfDayInTimezone } from '../utils/timezone';
import styles from './css.module/UserIncome.module.css';

export const UserIncome: React.FC = () => {
  const { t } = useTranslation();
  const [incomes, setIncomes] = useState<UserIncomeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [searchName, setSearchName] = useState('');

  const parseName = (name: string): { firstName?: string; lastName?: string } => {
    const trimmed = name.trim();
    if (!trimmed) return {};

    const words = trimmed.split(/\s+/);
    if (words.length === 1) {
      return { firstName: words[0], lastName: undefined };
    } else if (words.length >= 2) {
      const firstName = words.slice(0, -1).join(' ');
      const lastName = words[words.length - 1];
      return { firstName, lastName };
    }
    return {};
  };

  const fetchIncomes = async (page: number) => {
    try {
      setLoading(true);
      const skip = (page - 1) * pageSize;
      const where: Record<string, any> = {};

      if (filterStartDate || filterEndDate) {
        const dateFilter: Record<string, string> = {};

        if (filterStartDate) {
          dateFilter.gte = getStartOfDayInTimezone(filterStartDate);
        }

        if (filterEndDate) {
          dateFilter.lte = getEndOfDayInTimezone(filterEndDate);
        }

        where.inComeDate = dateFilter;
      }

      if (searchName) {
        const parsed = parseName(searchName);

        if (parsed.lastName === undefined && parsed.firstName) {
          const [firstNameResult, lastNameResult] = await Promise.all([
            incomeService.search({
              skip,
              take: pageSize,
              where: {
                ...where,
                user: { firstName: { contains: parsed.firstName, mode: 'insensitive' } }
              },
              orderBy: { inComeDate: 'desc' },
            }),
            incomeService.search({
              skip,
              take: pageSize,
              where: {
                ...where,
                user: { lastName: { contains: parsed.firstName, mode: 'insensitive' } }
              },
              orderBy: { inComeDate: 'desc' },
            })
          ]);

          const mergedData = [...firstNameResult.data.data, ...lastNameResult.data.data];
          const uniqueData = mergedData.filter((item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
          );
          setIncomes(uniqueData);
          setTotalIncomes(Math.max(firstNameResult.data.total, lastNameResult.data.total));
        } else if (parsed.firstName && parsed.lastName) {
          where.user = {
            firstName: { contains: parsed.firstName, mode: 'insensitive' },
            lastName: { contains: parsed.lastName, mode: 'insensitive' }
          };
        }
      }

      if (!searchName || (searchName && parseName(searchName).lastName !== undefined)) {
        const response = await incomeService.search({
          skip,
          take: pageSize,
          where: Object.keys(where).length > 0 ? where : undefined,
          orderBy: { inComeDate: 'desc' },
        });
        setIncomes(response.data.data);
        setTotalIncomes(response.data.total);
      }
    } catch (error) {
      console.error('Error fetching incomes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes(currentPage);
  }, [currentPage, pageSize, filterStartDate, filterEndDate, searchName]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleAddIncome = () => {
    setIsAddModalOpen(true);
  };

  const handleEditIncome = (id: number) => {
    console.log('Edit income:', id);
  };

  const handleCreateIncomeSuccess = () => {
    fetchIncomes(currentPage);
  };

  const handleSearchIncome = async (userId: string, startDate: string, endDate: string) => {
    const response = await incomeService.search({
      skip: 0,
      take: 1000,
      where: {
        userId: parseInt(userId),
        inComeDate: {
          gte: getStartOfDayInTimezone(startDate),
          lte: getEndOfDayInTimezone(endDate),
        },
      },
      orderBy: { inComeDate: 'desc' },
    });
    return response.data.data;
  };

  const columns: TableColumn<UserIncomeData>[] = [
    {
      key: 'lastName',
      title: t('userIncome.columns.lastName'),
      render: (income) => income.user.lastName,
    },
    {
      key: 'firstName',
      title: t('userIncome.columns.firstName'),
      render: (income) => income.user.firstName,
    },
    {
      key: 'phoneNumber',
      title: t('userIncome.columns.phoneNumber'),
      render: (income) => income.user.phoneNumber,
    },
    {
      key: 'incomeDate',
      title: t('userIncome.columns.incomeDate'),
      render: (income) => new Date(income.inComeDate).toLocaleDateString('en-GB', { timeZone: 'UTC' }),
    },
    {
      key: 'serviceIncome',
      title: t('userIncome.columns.serviceIncome'),
      render: (income) => {
        const serviceIncome = income.services.reduce((sum, item) => sum + item.service.price, 0);
        return `$${serviceIncome.toFixed(2)}`;
      },
    },
    {
      key: 'tipsIncome',
      title: t('userIncome.columns.tipsIncome'),
      render: (income) => `$${(income.staffTip?.amount || 0).toFixed(2)}`,
    },
    {
      key: 'actions',
      title: t('common.actions'),
      headerAlign: 'center',
      align: 'center',
      render: (income) => (
        <ActionButtons
          onEdit={() => handleEditIncome(income.id)}
          editTitle={t('common.edit')}
        />
      ),
    },
  ];

  const totalPages = Math.ceil(totalIncomes / pageSize);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('userIncome.title')}</h1>
          <p className={styles.subtitle}>{t('userIncome.subtitle')}</p>
        </div>
        <div className={styles.headerButtons}>
          <Button variant="secondary" onClick={() => setIsSearchModalOpen(true)}>
            {t('userIncome.searchIncome')}
          </Button>
          <Button onClick={handleAddIncome}>
            {t('userIncome.addIncome')}
          </Button>
        </div>
      </div>

      <div className={styles.filters}>
        <Input
          type="text"
          value={searchName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
          placeholder={t('userIncome.filters.searchName')}
        />
        <Input
          type="date"
          value={filterStartDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterStartDate(e.target.value)}
          placeholder={t('userIncome.filters.startDate')}
        />
        <Input
          type="date"
          value={filterEndDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterEndDate(e.target.value)}
          placeholder={t('userIncome.filters.endDate')}
        />
      </div>

      <DataTable
        columns={columns}
        data={incomes}
        keyExtractor={(income) => income.id.toString()}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        loading={loading}
      />

      <AddIncomeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleCreateIncomeSuccess}
      />

      <SearchIncomeModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleSearchIncome}
      />
    </div>
  );
};
