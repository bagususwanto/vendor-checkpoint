import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDateTime(
  date: string | Date | null | undefined,
  dateFormat: string = 'dd MMM yyyy HH:mm',
): string {
  if (!date) return '-';

  let dateObj: Date;

  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  // Check if date is valid
  if (isNaN(dateObj.getTime())) return '-';

  return format(dateObj, dateFormat, { locale: id });
}
