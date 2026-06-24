import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, type TabItem, type TableColumn, Button } from '../components/atoms';
import { DataTable, ActionButtons } from '../components/molecules';
import { AddServiceModal } from '../components/organisms';
import { serviceService, type Service } from '../services';
import styles from './css.module/Settings.module.css';

export const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalServices, setTotalServices] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * pageSize;
      const response = await serviceService.search({
        skip,
        take: pageSize,
        where: {
          isActive: true,
        },
        orderBy: {
          sortOrder: 'asc',
        },
      });
      setServices(response.data.data);
      setTotalServices(response.data.total);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'services') {
      fetchServices();
    }
  }, [activeTab, currentPage, pageSize]);

  const columns: TableColumn<Service>[] = [
    {
      key: 'name',
      title: t('settings.services.columns.name'),
      render: (service: Service) => service.name,
    },
    {
      key: 'code',
      title: t('settings.services.columns.code'),
      render: (service: Service) => service.code,
    },
    {
      key: 'description',
      title: t('settings.services.columns.description'),
      render: (service: Service) => service.description,
    },
    {
      key: 'price',
      title: t('settings.services.columns.price'),
      render: (service: Service) => `${service.price} ${service.currency}`,
    },
    {
      key: 'duration',
      title: t('settings.services.columns.duration'),
      render: (service: Service) => `${service.duration} ${service.durationUnit}`,
    },
    {
      key: 'actions',
      title: t('common.actions'),
      headerAlign: 'center',
      align: 'center',
      render: (service: Service) => (
        <ActionButtons
          onEdit={() => console.log('Edit service:', service.id)}
          onDelete={() => console.log('Delete service:', service.id)}
          onToggleActive={() => console.log('Toggle active:', service.id)}
          isActive={service.isActive}
          editTitle={t('common.edit')}
          deleteTitle={t('common.delete')}
          activeTitle={t('common.active')}
          inactiveTitle={t('common.inactive')}
        />
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleAddService = () => {
    setIsAddServiceModalOpen(true);
  };

  const handleCreateServiceSuccess = () => {
    fetchServices();
  };

  const totalPages = Math.ceil(totalServices / pageSize);

  const tabs: TabItem[] = [
    {
      id: 'packages',
      label: t('settings.tabs.packages'),
      content: (
        <div className={styles.comingSoon}>
          {t('common.comingSoon')}
        </div>
      ),
    },
    {
      id: 'services',
      label: t('settings.tabs.services'),
      content: (
        <>
          <div className={styles.header}>
            <Button onClick={handleAddService}>
              {t('settings.services.addService')}
            </Button>
          </div>
          <DataTable
            data={services}
            columns={columns}
            loading={loading}
            keyExtractor={(service) => service.id.toString()}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('settings.title')}</h1>
        <p className={styles.subtitle}>{t('settings.subtitle')}</p>
      </div>

      <div className={styles.content}>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={() => setIsAddServiceModalOpen(false)}
        onSuccess={handleCreateServiceSuccess}
      />
    </div>
  );
};
