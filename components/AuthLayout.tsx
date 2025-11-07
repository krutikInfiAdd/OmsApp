import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ThemeToggler } from './ThemeToggler';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggler />
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <NavLink to="/" className="flex justify-center text-3xl font-bold text-primary-600 dark:text-primary-400">
            PrimeLedger
        </NavLink>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
