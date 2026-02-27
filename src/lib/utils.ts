import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Утилита для объединения классов Tailwind CSS без конфликтов.
 * Позволяет динамически формировать классы компонентов.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
