import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NavItem } from '../types';
import { NAVIGATION_LINKS } from '../constants';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // Expand parent menu of the active link
  useEffect(() => {
    const activeParent = NAVIGATION_LINKS.find(item => 
      item.children?.some(child => location.pathname.startsWith(child.path || ''))
    );
    if (activeParent) {
      setOpenMenus(prev => [...new Set([...prev, activeParent.label])]);
    }
  }, [location.pathname]);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);


  const toggleMenu = (label: string) => {
    setOpenMenus(prev => 
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
    );
  };

  const renderNavItem = (item: NavItem) => {
    const isParentActive = item.children?.some(child => location.pathname.startsWith(child.path || 'non-existent-path'));

    if (item.children) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleMenu(item.label)}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left rounded-lg transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 ${
              isParentActive ? 'font-semibold text-primary-600 dark:text-primary-400' : 'font-medium text-gray-600 dark:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </div>
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${openMenus.includes(item.label) ? 'rotate-180' : ''}`} />
          </button>
          {openMenus.includes(item.label) && (
            <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
              {item.children.map(child => renderNavItem(child))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.label}
        to={item.path || '/'}
        className={({ isActive }) =>
          `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isActive
              ? 'bg-primary-500 text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`
        }
      >
        {item.icon && <item.icon className="w-5 h-5 mr-3" />}
        <span>{item.label}</span>
      </NavLink>
    );
  };

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <NavLink to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">PrimeLedger</NavLink>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {NAVIGATION_LINKS.map(renderNavItem)}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>
      
      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden lg:flex lg:flex-col">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
