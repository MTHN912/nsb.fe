import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, FormField } from '../molecules';
import { Button, Input } from '../atoms';
import { userService } from '../../services/user';
import { toast } from '../atoms/ToastContainer';
import { storage } from '../../utils/storage';
import { ROLE_CODES } from '../../utils/constants';

export interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('staff.form.errors.firstNameRequired');
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('staff.form.errors.lastNameRequired');
    }
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = t('staff.form.errors.addressRequired');
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t('staff.form.errors.phoneRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      await userService.createStaff({
        firstName: formData.firstName,
        lastName: formData.lastName,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zipCode: formData.zipCode || undefined,
        phoneNumber: formData.phoneNumber,
      });

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
      storage.set('staff_users', response.data.data);

      toast.success(t('staff.form.success'), t('common.success'));
      onSuccess?.();
      onClose();
      setFormData({
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      const errorMessage = error.response?.data?.message || error.message || t('staff.form.error');
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
      title={t('staff.form.title')}
      footer={footer}
    >
      <form onSubmit={handleSubmit}>
        <FormField
          label={t('staff.columns.firstName')}
          error={errors.firstName}
          required
        >
          <Input
            value={formData.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('firstName', e.target.value)}
            placeholder={t('staff.form.placeholders.firstName')}
          />
        </FormField>

        <FormField
          label={t('staff.columns.lastName')}
          error={errors.lastName}
          required
        >
          <Input
            value={formData.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lastName', e.target.value)}
            placeholder={t('staff.form.placeholders.lastName')}
          />
        </FormField>

        <FormField
          label={t('staff.columns.address')}
          error={errors.addressLine1}
          required
        >
          <Input
            value={formData.addressLine1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('addressLine1', e.target.value)}
            placeholder={t('staff.form.placeholders.address')}
          />
        </FormField>

        <FormField
          label={t('staff.columns.addressLine2')}
        >
          <Input
            value={formData.addressLine2}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('addressLine2', e.target.value)}
            placeholder={t('staff.form.placeholders.addressLine2')}
          />
        </FormField>

        <FormField
          label={t('staff.columns.city')}
        >
          <Input
            value={formData.city}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('city', e.target.value)}
            placeholder={t('staff.form.placeholders.city')}
          />
        </FormField>

        <FormField
          label={t('staff.columns.state')}
        >
          <Input
            value={formData.state}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('state', e.target.value)}
            placeholder={t('staff.form.placeholders.state')}
          />
        </FormField>

        <FormField
          label={t('staff.columns.zipCode')}
        >
          <Input
            value={formData.zipCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('zipCode', e.target.value)}
            placeholder={t('staff.form.placeholders.zipCode')}
          />
        </FormField>

        <FormField
          label={t('staff.columns.phone')}
          error={errors.phoneNumber}
          required
        >
          <Input
            value={formData.phoneNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('phoneNumber', e.target.value)}
            placeholder={t('staff.form.placeholders.phone')}
          />
        </FormField>
      </form>
    </Modal>
  );
};
