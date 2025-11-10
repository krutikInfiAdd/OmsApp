import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon?: React.ReactNode;
}

export const Textarea: React.FC<TextareaProps> = ({ className = '', icon, ...props }) => {
  const baseClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white';
  const withIconClasses = icon ? 'pl-10' : '';

  if (icon) {
    return (
      <div className="relative">
        <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
           {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-gray-400" })}
        </div>
        <textarea className={`${baseClasses} ${withIconClasses} ${className}`} {...props} />
      </div>
    );
  }
  
  return <textarea className={`${baseClasses} ${className}`} {...props} />;
};
