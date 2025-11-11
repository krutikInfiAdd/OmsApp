// src/utils/localStorage.ts

/**
 * Set a value in localStorage
 * @param key The key to store the value
 * @param value The value to store (string, number, boolean, or object)
 */
export const setValue = <T>(key: string, value: T): void => {
  try {
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

/**
 * Get a value from localStorage
 * @param key The key to retrieve
 * @returns The stored value, or null if not found
 */
export const getValue = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    // Try parsing JSON, fallback to string
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};
