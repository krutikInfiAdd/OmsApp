import React from 'react';

// Fix: Update CardProps to accept any standard HTML div attributes by extending React.HTMLAttributes<HTMLDivElement>.
// This allows passing props like 'id', which is needed for the printing functionality in InvoiceViewPage and QuotationViewPage.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    // Fix: Spread the rest of the props onto the underlying div element to apply them.
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};