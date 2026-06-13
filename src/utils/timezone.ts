/**
 * Timezone utility functions for handling date/time conversions
 * Uses the configured timezone from environment variables
 */

export const TIMEZONE = import.meta.env.VITE_TIMEZONE || 'America/Chicago';

/**
 * Convert a date to the configured timezone and return as Date object
 */
export const toLocalTimezone = (date: string | Date): Date => {
  const d = new Date(date);
  // Use Intl.DateTimeFormat to convert to the target timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });
  
  const parts = formatter.formatToParts(d);
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1;
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
  const second = parseInt(parts.find(p => p.type === 'second')?.value || '0');
  
  return new Date(year, month, day, hour, minute, second);
};

/**
 * Format a date in the configured timezone
 * Converts UTC date from BE to display in configured timezone
 */
export const formatDateInTimezone = (date: string | Date, locale: string = 'vi-VN'): string => {
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Format a datetime in the configured timezone
 * Converts UTC date from BE to display in configured timezone
 */
export const formatDateTimeInTimezone = (date: string | Date, locale: string = 'vi-VN'): string => {
  const d = new Date(date);
  return d.toLocaleString(locale, {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Convert a local date (from date picker) to start of day in configured timezone (ISO string)
 * This treats the input date as if it's in the configured timezone
 */
export const getStartOfDayInTimezone = (localDate: string): string => {
  // Parse the date parts directly from the string
  const [year, month, day] = localDate.split('-').map(Number);
  
  // Create a date object representing midnight in the configured timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });
  
  // Create a date in UTC that will represent the target time in the configured timezone
  const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  
  // Format to get the actual time in the target timezone
  const parts = formatter.formatToParts(utcDate);
  const targetYear = parseInt(parts.find(p => p.type === 'year')?.value || '0');
  const targetMonth = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1;
  const targetDay = parseInt(parts.find(p => p.type === 'day')?.value || '0');
  const targetHour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  const targetMinute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
  const targetSecond = parseInt(parts.find(p => p.type === 'second')?.value || '0');
  
  // Create the final date in the target timezone and convert to ISO
  const targetDate = new Date(targetYear, targetMonth, targetDay, targetHour, targetMinute, targetSecond);
  return targetDate.toISOString();
};

/**
 * Convert a local date (from date picker) to end of day in configured timezone (ISO string)
 * This treats the input date as if it's in the configured timezone
 */
export const getEndOfDayInTimezone = (localDate: string): string => {
  // Parse the date parts directly from the string
  const [year, month, day] = localDate.split('-').map(Number);
  
  // Create a date object representing end of day in the configured timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });
  
  // Create a date in UTC that will represent the target time in the configured timezone
  const utcDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  
  // Format to get the actual time in the target timezone
  const parts = formatter.formatToParts(utcDate);
  const targetYear = parseInt(parts.find(p => p.type === 'year')?.value || '0');
  const targetMonth = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1;
  const targetDay = parseInt(parts.find(p => p.type === 'day')?.value || '0');
  const targetHour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  const targetMinute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
  const targetSecond = parseInt(parts.find(p => p.type === 'second')?.value || '0');
  
  // Create the final date in the target timezone and convert to ISO
  const targetDate = new Date(targetYear, targetMonth, targetDay, targetHour, targetMinute, targetSecond);
  return targetDate.toISOString();
};

/**
 * Get the current timezone identifier
 */
export const getCurrentTimezone = (): string => {
  return TIMEZONE;
};
