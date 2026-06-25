import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, FormField } from '../molecules';
import { Button, Input, SearchableSelect, SearchableMultiSelect } from '../atoms';
import { incomeService } from '../../services/income';
import { userService, type User } from '../../services/user';
import { serviceService, type Service } from '../../services/service';
import { toast } from '../atoms/ToastContainer';
import { storage } from '../../utils/storage';
import { ROLE_CODES } from '../../utils/constants';

export interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddIncomeModal: React.FC<AddIncomeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    incomeDate: '',
    serviceIds: [] as (string | number)[],
    serviceIncome: '',
    tipsIncome: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const fetchServices = async () => {
    try {
      const cachedServices = storage.get<Service[]>('services');
      if (cachedServices) {
        setServices(cachedServices);
        return;
      }

      const response = await serviceService.search({
        skip: 0,
        take: 100,
        orderBy: { createdAt: 'desc' },
      });
      setServices(response.data.data);
      storage.set('services', response.data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchServices();
    }
  }, [isOpen]);

  const handleChange = (field: string, value: string | (string | number)[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleServiceChange = (serviceIds: (string | number)[]) => {
    handleChange('serviceIds', serviceIds);
    
    // Auto-calculate service income based on selected services
    const totalServiceIncome = serviceIds.reduce((total: number, serviceId) => {
      const service = services.find(s => s.id === Number(serviceId));
      return total + (service?.price || 0);
    }, 0);
    
    setFormData((prev) => ({ 
      ...prev, 
      serviceIds,
      serviceIncome: totalServiceIncome.toString() 
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.userId) {
      newErrors.userId = t('userIncome.form.errors.userIdRequired');
    }
    if (!formData.incomeDate) {
      newErrors.incomeDate = t('userIncome.form.errors.incomeDateRequired');
    }
    if (formData.serviceIds.length === 0) {
      newErrors.serviceIds = t('userIncome.form.errors.serviceIdsRequired');
    }
    if (!formData.tipsIncome) {
      newErrors.tipsIncome = t('userIncome.form.errors.tipsIncomeRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      await incomeService.create({
        userId: Number(formData.userId),
        inComeDate: formData.incomeDate,
        serviceIncome: parseFloat(formData.serviceIncome),
        tipsIncome: parseFloat(formData.tipsIncome),
        serviceId: formData.serviceIds.map(id => Number(id)),
      });
      toast.success(t('userIncome.form.success'), t('common.success'));
      onSuccess?.();
      onClose();
      setFormData({
        userId: '',
        incomeDate: '',
        serviceIds: [],
        serviceIncome: '',
        tipsIncome: '',
      });
    } catch (error: any) {
      console.error('Error creating income:', error);
      const errorMessage = error.response?.data?.message || error.message || t('userIncome.form.error');
      toast.error(errorMessage, t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        {t('common.cancel')}
      </Button>
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? t('common.loading') : t('common.save')}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('userIncome.form.title')}
      footer={footer}
    >
      <form onSubmit={handleSubmit}>
        <FormField
          label={t('userIncome.form.user')}
          error={errors.userId}
          required
        >
          <SearchableSelect
            value={formData.userId}
            onChange={(value) => handleChange('userId', value)}
            placeholder={t('userIncome.form.placeholders.user')}
            options={users.map(user => ({
              value: user.id,
              label: `${user.firstName} ${user.lastName}`
            }))}
          />
        </FormField>

        <FormField
          label={t('userIncome.form.incomeDate')}
          error={errors.incomeDate}
          required
        >
          <Input
            type="date"
            value={formData.incomeDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('incomeDate', e.target.value)}
          />
        </FormField>

        <FormField
          label={t('userIncome.form.services')}
          error={errors.serviceIds}
          required
        >
          <SearchableMultiSelect
            selectedValues={formData.serviceIds}
            onChange={handleServiceChange}
            placeholder={t('userIncome.form.placeholders.services')}
            options={services.map(service => ({
              value: service.id,
              label: service.name,
              price: service.price
            }))}
          />
        </FormField>

        <FormField
          label={t('userIncome.form.serviceIncome')}
          error={errors.serviceIncome}
          required
        >
          <Input
            type="number"
            step="0.01"
            value={formData.serviceIncome}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('serviceIncome', e.target.value)}
            placeholder={t('userIncome.form.placeholders.serviceIncome')}
            readOnly
          />
        </FormField>

        <FormField
          label={t('userIncome.form.tipsIncome')}
          error={errors.tipsIncome}
          required
        >
          <Input
            type="number"
            step="0.01"
            value={formData.tipsIncome}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('tipsIncome', e.target.value)}
            placeholder={t('userIncome.form.placeholders.tipsIncome')}
          />
        </FormField>
      </form>
    </Modal>
  );
};
