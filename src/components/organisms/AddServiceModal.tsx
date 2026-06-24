import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, FormField } from '../molecules';
import { Button, Input, Select } from '../atoms';
import { serviceService } from '../../services/service';
import { toast } from '../atoms/ToastContainer';
import { storage } from '../../utils/storage';

export interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    price: '',
    currency: 'USD',
    duration: '',
    durationUnit: 'minutes',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'VND', label: 'VND' },
    { value: 'EUR', label: 'EUR' },
  ];

  const durationUnitOptions = [
    { value: 'minutes', label: 'Minutes' },
    { value: 'hours', label: 'Hours' },
  ];

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

    if (!formData.code.trim()) {
      newErrors.code = t('settings.services.form.errors.codeRequired');
    }
    if (!formData.name.trim()) {
      newErrors.name = t('settings.services.form.errors.nameRequired');
    }
    if (!formData.description.trim()) {
      newErrors.description = t('settings.services.form.errors.descriptionRequired');
    }
    if (!formData.price) {
      newErrors.price = t('settings.services.form.errors.priceRequired');
    }
    if (!formData.duration) {
      newErrors.duration = t('settings.services.form.errors.durationRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      await serviceService.create({
        code: formData.code,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        duration: parseInt(formData.duration),
        durationUnit: formData.durationUnit,
        isActive: true,
        sortOrder: 0,
      });

      const response = await serviceService.search({
        skip: 0,
        take: 100,
        orderBy: { createdAt: 'desc' },
      });
      storage.set('services', response.data.data);

      toast.success(t('settings.services.form.success'), t('common.success'));
      onSuccess?.();
      onClose();
      setFormData({
        code: '',
        name: '',
        description: '',
        price: '',
        currency: 'USD',
        duration: '',
        durationUnit: 'minutes',
      });
    } catch (error: any) {
      console.error('Error creating service:', error);
      const errorMessage = error.response?.data?.message || error.message || t('settings.services.form.error');
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
      title={t('settings.services.form.title')}
      footer={footer}
    >
      <form onSubmit={handleSubmit}>
        <FormField
          label={t('settings.services.form.code')}
          error={errors.code}
          required
        >
          <Input
            type="text"
            value={formData.code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('code', e.target.value)}
            placeholder={t('settings.services.form.placeholders.code')}
          />
        </FormField>

        <FormField
          label={t('settings.services.form.name')}
          error={errors.name}
          required
        >
          <Input
            type="text"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
            placeholder={t('settings.services.form.placeholders.name')}
          />
        </FormField>

        <FormField
          label={t('settings.services.form.description')}
          error={errors.description}
          required
        >
          <Input
            type="text"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('description', e.target.value)}
            placeholder={t('settings.services.form.placeholders.description')}
          />
        </FormField>

        <FormField
          label={t('settings.services.form.price')}
          error={errors.price}
          required
        >
          <Input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('price', e.target.value)}
            placeholder={t('settings.services.form.placeholders.price')}
          />
        </FormField>

        <FormField
          label={t('settings.services.form.currency')}
          error={errors.currency}
        >
          <Select
            value={formData.currency}
            onChange={(value) => handleChange('currency', value)}
            options={currencyOptions}
          />
        </FormField>

        <FormField
          label={t('settings.services.form.duration')}
          error={errors.duration}
          required
        >
          <Input
            type="number"
            value={formData.duration}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('duration', e.target.value)}
            placeholder={t('settings.services.form.placeholders.duration')}
          />
        </FormField>

        <FormField
          label={t('settings.services.form.durationUnit')}
          error={errors.durationUnit}
        >
          <Select
            value={formData.durationUnit}
            onChange={(value) => handleChange('durationUnit', value)}
            options={durationUnitOptions}
          />
        </FormField>
      </form>
    </Modal>
  );
};
