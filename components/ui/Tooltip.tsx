import React from 'react';

interface TooltipProps {
  children: React.ReactElement;
  text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  return (
    <div className="relative group">
      {/* Fix: Explicitly provide a generic type to React.cloneElement.
          This prevents TypeScript from inferring the child's props as 'unknown'
          and allows adding the 'aria-label' attribute. */}
      {React.cloneElement<any>(children, { 'aria-label': text })}
      <span
        role="tooltip"
        className="absolute hidden group-hover:block w-max bg-gray-900 text-white text-xs rounded-md px-2 py-1 -top-8 left-1/2 -translate-x-1/2 dark:bg-gray-700 pointer-events-none transition-opacity"
      >
        {text}
        {/* Arrow */}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900 dark:border-t-gray-700"></span>
      </span>
    </div>
  );
};
