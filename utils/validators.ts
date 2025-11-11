
/**
 * Checks if a string is not null, undefined, or empty.
 */
export function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Checks if a value is null, undefined or an empty string.
 */
export function isInvalidString(value: unknown): boolean {
  return !isValidString(value);
}

export const isValidNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};