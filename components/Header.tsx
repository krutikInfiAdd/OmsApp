import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { MenuIcon } from './icons/MenuIcon';
import { ThemeToggler } from './ThemeToggler';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();
  const { companies } = useData();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userCompany, setUserCompany] = useState('');

  useEffect(() => {
    const company = companies.find(c => c.id === user?.companyId);
    setUserCompany(company?.name || 'Unknown Company');
  }, [user, companies]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="text-gray-500 dark:text-gray-400 focus:outline-none lg:hidden mr-3"
          aria-label="Open sidebar"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <div className="relative w-full max-w-xs sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search transactions, customers..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggler />
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 cursor-pointer focus:outline-none">
            <img
              className="h-9 w-9 rounded-full object-cover"
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
              alt="User avatar"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium">{user?.name || 'Guest'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{userCompany}</p>
            </div>
            <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
           {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
              <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Profile</span>
              <button
                onClick={signOut}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;