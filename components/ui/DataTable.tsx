import React from 'react';
import { useDataTable } from '../../hooks/useDataTable';
import { Column } from '../../types';
import { Input } from './Input';
import { Pagination } from './Pagination';
import { SwitchVerticalIcon } from '../icons/SwitchVerticalIcon';
import { ArrowUpIcon } from '../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';
import { SearchIcon } from '../icons/SearchIcon';

interface DataTableProps<T extends { id: any }> {
  columns: Column<T>[];
  data: T[];
  searchKeys: (keyof T | string)[];
  searchPlaceholder?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  searchKeys,
  searchPlaceholder = 'Search...'
}: DataTableProps<T>): React.ReactElement {
  
  const {
    paginatedData,
    requestSort,
    sortConfig,
    handleSearch,
    searchTerm,
    currentPage,
    totalPages,
    handlePageChange,
    itemsPerPage,
    handleItemsPerPageChange,
    totalItems,
  } = useDataTable(data, searchKeys);

  const getSortIcon = (key?: keyof T) => {
    if (!key || !sortConfig || sortConfig.key !== key) {
      return <SwitchVerticalIcon className="h-4 w-4 ml-1 text-gray-400" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUpIcon className="h-4 w-4 ml-1" />;
    }
    return <ArrowDownIcon className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 print:hidden">
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearch}
          icon={<SearchIcon />}
          className="w-full sm:w-auto sm:max-w-xs"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {col.sortKey ? (
                    <button className="flex items-center focus:outline-none" onClick={() => requestSort(col.sortKey!)}>
                      {col.header}
                      {getSortIcon(col.sortKey)}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                {columns.map((col, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : (getNestedValue(row, col.accessor as string) as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 0 && paginatedData.length === 0 ? (
         <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">
              No results found for your search.
            </p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No data available.</p>
        </div>
      ) : (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalItems={totalItems}
        />
      )}
    </div>
  );
}

// Helper to get nested property values
const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};