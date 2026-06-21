import { formatDateInTimezone, formatDateTimeInTimezone } from './timezone';
export { STORAGE_KEYS } from './constants';

export const formatDate = (date: string | Date): string => {
  return formatDateInTimezone(date, 'vi-VN');
};

export const formatDateTime = (date: string | Date): string => {
  return formatDateTimeInTimezone(date, 'vi-VN');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};
