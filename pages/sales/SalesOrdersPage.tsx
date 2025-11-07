import React from 'react';
import { Card } from '../../components/ui/Card';

const SalesOrdersPage: React.FC = () => {
  const title = "Sales Orders";
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>
      <Card>
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Feature Coming Soon!</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            The "{title}" module is currently under development.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
             Check back later for updates.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SalesOrdersPage;
