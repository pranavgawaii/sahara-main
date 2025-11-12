import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { VALIDATION_RULES, ERROR_MESSAGES } from '@/constants';
import type { FormField } from '@/types';

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date and Time Utilities
export const dateUtils = {
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    }).format(dateObj);
  },

  formatTime: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(dateObj);
  },

  formatRelativeTime: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return dateUtils.formatDate(dateObj);
  },

  isToday: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return dateObj.toDateString() === today.toDateString();
  },

  addDays: (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  isBetween: (date: Date, start: Date, end: Date) => {
    return date >= start && date <= end;
  },
};

// String Utilities
export const stringUtils = {
  capitalize: (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  truncate: (str: string, length: number, suffix = '...') => {
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },

  slugify: (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  generateId: (prefix = '') => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return prefix ? `${prefix}_${timestamp}_${randomStr}` : `${timestamp}_${randomStr}`;
  },

  extractInitials: (name: string, maxLength = 2) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, maxLength)
      .join('');
  },

  sanitizeHtml: (str: string) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },
};

// Number Utilities
export const numberUtils = {
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat('en-US', options).format(num);
  },

  formatCurrency: (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  formatPercentage: (value: number, decimals = 1) => {
    return `${(value * 100).toFixed(decimals)}%`;
  },

  clamp: (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  },

  roundToDecimal: (value: number, decimals: number) => {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  isInRange: (value: number, min: number, max: number) => {
    return value >= min && value <= max;
  },
};

// Array Utilities
export const arrayUtils = {
  unique: <T>(array: T[]) => {
    return Array.from(new Set(array));
  },

  groupBy: <T, K extends keyof T>(array: T[], key: K) => {
    return array.reduce((groups, item) => {
      const group = item[key] as unknown as string;
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  sortBy: <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc') => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  chunk: <T>(array: T[], size: number) => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  shuffle: <T>(array: T[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },
};

// Validation Utilities
export const validationUtils = {
  isEmail: (email: string) => {
    return VALIDATION_RULES.email.test(email);
  },

  isPhone: (phone: string) => {
    return VALIDATION_RULES.phone.test(phone);
  },

  isInstitutionCode: (code: string) => {
    return VALIDATION_RULES.institutionCode.test(code);
  },

  isStrongPassword: (password: string) => {
    const rules = VALIDATION_RULES.password;
    const checks = {
      length: password.length >= rules.minLength,
      uppercase: rules.requireUppercase ? /[A-Z]/.test(password) : true,
      lowercase: rules.requireLowercase ? /[a-z]/.test(password) : true,
      numbers: rules.requireNumbers ? /\d/.test(password) : true,
      special: rules.requireSpecialChars ? /[!@#$%^&*(),.?":{}|<>]/.test(password) : true,
    };
    
    return Object.values(checks).every(Boolean);
  },

  validateForm: (values: Record<string, any>, fields: FormField[]) => {
    const errors: Record<string, string> = {};
    
    fields.forEach(field => {
      const value = values[field.name];
      
      // Required field validation
      if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
        errors[field.name] = `${field.label} is required`;
        return;
      }
      
      // Type-specific validation
      if (value) {
        switch (field.type) {
          case 'email':
            if (!validationUtils.isEmail(value)) {
              errors[field.name] = 'Please enter a valid email address';
            }
            break;
          case 'number':
            if (isNaN(Number(value))) {
              errors[field.name] = 'Please enter a valid number';
            }
            break;
        }
      }
      
      // Custom validation
      if (field.validation?.custom && value) {
        const result = field.validation.custom(value);
        if (typeof result === 'string') {
          errors[field.name] = result;
        } else if (!result) {
          errors[field.name] = `Invalid ${field.label.toLowerCase()}`;
        }
      }
    });
    
    return errors;
  },
};

// Local Storage Utilities
export const storageUtils = {
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  },

  get: <T = any>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return defaultValue || null;
    }
  },

  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  },
};

// URL Utilities
export const urlUtils = {
  buildUrl: (base: string, path: string, params?: Record<string, string | number>) => {
    const url = new URL(path, base);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
      });
    }
    return url.toString();
  },

  getQueryParams: (search?: string) => {
    const params = new URLSearchParams(search || window.location.search);
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  },

  updateQueryParams: (params: Record<string, string | null>) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
    });
    window.history.replaceState({}, '', url.toString());
  },
};

// Accessibility Utilities
export const a11yUtils = {
  announceToScreenReader: (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    document.body.appendChild(announcement);
    announcement.textContent = message;
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  },
};

// Performance Utilities
export const performanceUtils = {
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  throttle: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  },

  memoize: <T extends (...args: any[]) => any>(func: T) => {
    const cache = new Map();
    return (...args: Parameters<T>): ReturnType<T> => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func(...args);
      cache.set(key, result);
      return result;
    };
  },
};

// Error Handling Utilities
export const errorUtils = {
  getErrorMessage: (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    return ERROR_MESSAGES.genericError;
  },

  isNetworkError: (error: unknown): boolean => {
    return error instanceof Error && 
           (error.message.includes('fetch') || 
            error.message.includes('network') ||
            error.message.includes('NetworkError'));
  },

  logError: (error: unknown, context?: string) => {
    const message = errorUtils.getErrorMessage(error);
    const logData = {
      message,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    
    console.error('Application Error:', logData);
    
    // In production, you might want to send this to an error tracking service
    // like Sentry, LogRocket, etc.
  },
};