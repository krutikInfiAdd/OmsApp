import React, { useState, useMemo, useEffect } from 'react';

type SortDirection = 'asc' | 'desc';

interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

// Helper to get nested property values
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const useDataTable = <T extends { id: any }>(
  initialData: T[],
  searchKeys: (keyof T | string)[],
  initialItemsPerPage: number = 10
) => {
  const [data, setData] = useState<T[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const lowercasedFilter = searchTerm.toLowerCase();
    return data.filter(item => {
      return searchKeys.some(key => {
        const value = getNestedValue(item, key as string);
        return value?.toString().toLowerCase().includes(lowercasedFilter);
      });
    });
  }, [data, searchTerm, searchKeys]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key as string);
        const bValue = getNestedValue(b, sortConfig.key as string);
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const requestSort = (key: keyof T) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return {
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
    totalItems: sortedData.length,
  };
};