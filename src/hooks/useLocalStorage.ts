import { useState, useCallback, useEffect } from 'react';
import { exportDataToFile } from '../utils/backup';

// Debounce timer for saving data
let backupTimeout: NodeJS.Timeout | null = null;

const triggerBackup = () => {
    if (backupTimeout) {
        clearTimeout(backupTimeout);
    }
    backupTimeout = setTimeout(() => {
        exportDataToFile();
    }, 1000); // 1s debounce
};

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const valueToStore =
          value instanceof Function ? (value as Function)(prev) : value;
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          triggerBackup();
        }
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}
