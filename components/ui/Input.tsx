import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Add any custom props here if needed
}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  const baseClasses =
    'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white';

  return <input className={`${baseClasses} ${className}`} {...props} />;
};
