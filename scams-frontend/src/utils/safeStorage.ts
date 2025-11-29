/**
 * Safe localStorage wrapper with error handling
 */

export const safeStorage = {
  getItem: (key: string, defaultValue: string | null = null): string | null => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  },

  clear: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
      return false;
    }
  },
};

export const safeSessionStorage = {
  getItem: (key: string, defaultValue: string | null = null): string | null => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = sessionStorage.getItem(key);
      return item !== null ? item : defaultValue;
    } catch (error) {
      console.warn(`Error reading from sessionStorage (${key}):`, error);
      return defaultValue;
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Error writing to sessionStorage (${key}):`, error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing from sessionStorage (${key}):`, error);
      return false;
    }
  },

  clear: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing sessionStorage:', error);
      return false;
    }
  },
};
