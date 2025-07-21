import { useState, useEffect } from 'react';

export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  } = {}
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;

  const [state, setState] = useState<T>(() => {
    // Return default value during SSR
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const valueInLocalStorage = window.localStorage.getItem(key);
      if (valueInLocalStorage) {
        return deserialize(valueInLocalStorage);
      }
      return defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, serialize(state));
    } catch {
      // Ignore localStorage errors (quota exceeded, etc.)
    }
  }, [key, state, serialize]);

  return [state, setState];
} 