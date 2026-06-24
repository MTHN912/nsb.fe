import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { userService, User } from '../services/user';
import { DataTable, Button, CreateUserModal, ActionButtons } from '../components';
import { TableColumn } from '../components/atoms';
import styles from './css.module/Staff.module.css';

export const Staff: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchUsers = async (page: number) => {
    try {
      setLoading(true);
      const skip = (page - 1) * pageSize;
      const response = await userService.search({
        skip,
        take: pageSize,
        where: {
          roles: {
            some: {
              role: {
                code: 'staff'
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      });
      setUsers(response.data.data);
      setTotalUsers(response.data.total);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleAddUser = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateUserSuccess = () => {
    fetchUsers(currentPage);
  };

  const columns: TableColumn<User>[] = [
    {
      key: 'email',
      title: t('staff.columns.email'),
      render: (user) => user.email || '-',
    },
    {
      key: 'firstName',
      title: t('staff.columns.firstName'),
      render: (user) => user.firstName,
    },
    {
      key: 'lastName',
      title: t('staff.columns.lastName'),
      render: (user) => user.lastName,
    },
    {
      key: 'address',
      title: t('staff.columns.address'),
      render: (user) => {
        const parts = [user.addressLine1, user.city, user.state, user.zipCode].filter(Boolean);
        return parts.join(', ');
      },
    },
    {
      key: 'phone',
      title: t('staff.columns.phone'),
      render: (user) => user.phoneNumber,
    },
    {
      key: 'role',
      title: t('staff.columns.role'),
      render: (user) => user.roles[0]?.role.name || '-',
    },
    {
      key: 'actions',
      title: t('common.actions'),
      // headerAlign: 'center',
      // align: 'center',
      render: (user) => (
        <ActionButtons
          onEdit={() => console.log('Edit user:', user.id)}
          onDelete={() => console.log('Delete user:', user.id)}
          onToggleActive={() => console.log('Toggle active:', user.id)}
          isActive={user.isActive}
          editTitle={t('common.edit')}
          deleteTitle={t('common.delete')}
          activeTitle={t('common.active')}
          inactiveTitle={t('common.inactive')}
        />
      ),
    },
  ];

  const totalPages = Math.ceil(totalUsers / pageSize);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('staff.title')}</h1>
          <p className={styles.subtitle}>{t('staff.subtitle')}</p>
        </div>
        <Button onClick={handleAddUser}>
          {t('staff.addUser')}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(user) => user.id}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        loading={loading}
      />

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateUserSuccess}
      />
    </div>
  );
};
