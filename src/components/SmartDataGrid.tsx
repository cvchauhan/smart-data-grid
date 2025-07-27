// src/components/SmartDataGridReact.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { SmartDataGridProps } from '../types';
import './SmartDataGrid.css'; // Custom styles

const SmartDataGrid: React.FC<SmartDataGridProps> = ({
  dataSource = [],
  columns = [],
  defaultSortKey,
  paginationOptions = [10, 20, 30, 50, 100],
  enableSelection = false,
  onSelectionChange,
  theme = 'modern',
  title,
  searchable = true
}) => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(
    defaultSortKey ? { key: defaultSortKey, direction: 'asc' } : null
  );

  const stablePaginationOptions = useMemo(() => paginationOptions, [JSON.stringify(paginationOptions)]);
  
  useEffect(() => {
    setRowsPerPage(stablePaginationOptions[0] || 10);
  }, [stablePaginationOptions]);

  useEffect(() => {
    setSelectedRows([]);
    setCurrentPage(1);
  }, [dataSource]);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchTerm) return dataSource;
    return dataSource.filter(row =>
      columns.some(col => 
        String(row[col.field] || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [dataSource, searchTerm, columns]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate sorted data
  const paginatedData = useMemo(() => {
    return sortedData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleSort = (field: string) => {
    setSortConfig(current => {
      if (current?.key === field) {
        return current.direction === 'asc' 
          ? { key: field, direction: 'desc' }
          : null;
      }
      return { key: field, direction: 'asc' };
    });
  };

  const toggleRowSelection = (row: any) => {
    const isSelected = selectedRows.includes(row);
    const updated = isSelected
      ? selectedRows.filter(r => r !== row)
      : [...selectedRows, row];
    setSelectedRows(updated);
    onSelectionChange?.(updated);
  };

  const toggleSelectAll = () => {
    const allSelected = selectedRows.length === paginatedData.length;
    const updated = allSelected ? [] : [...paginatedData];
    setSelectedRows(updated);
    onSelectionChange?.(updated);
  };

  const getSortIcon = (field: string) => {
    if (sortConfig?.key !== field) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Debug info
  console.log('Debug Info:', {
    dataSource: dataSource.length,
    columns: columns.length,
    filteredData: filteredData.length,
    paginatedData: paginatedData.length
  });

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-gray-50 border-b">
        {title && <h3 className="text-xl font-semibold text-gray-900">{title}</h3>}
        <div className="flex items-center gap-6">
          {searchable && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-10 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <label>Show</label>
            <select 
              value={rowsPerPage} 
              onChange={(e) => {
                setRowsPerPage(+e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded"
            >
              {stablePaginationOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <label>entries</label>
          </div>
        </div>
      </div>

      {/* Selection Info */}
      {enableSelection && selectedRows.length > 0 && (
        <div className="flex justify-between items-center px-6 py-3 bg-blue-50 border-b text-blue-800">
          <span>{selectedRows.length} row(s) selected</span>
          <button 
            onClick={() => {
              setSelectedRows([]);
              onSelectionChange?.([]);
            }}
            className="px-3 py-1 border border-blue-300 text-blue-600 rounded hover:bg-blue-100"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {enableSelection && (
                <th className="w-12 px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    className="w-4 h-4"
                  />
                </th>
              )}
              {columns.map(col => (
                <th 
                  key={col.field}
                  onClick={() => handleSort(col.field)}
                  className="px-6 py-4 text-left font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <span>{col.header}</span>
                    <span className="text-xs text-gray-400">{getSortIcon(col.field)}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSource.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (enableSelection ? 1 : 0)} className="px-6 py-12 text-center text-gray-500 italic">
                  No data source provided
                </td>
              </tr>
            ) : columns.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-gray-500 italic">
                  No columns defined
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <tr 
                  key={i} 
                  className={`border-b hover:bg-gray-50 ${selectedRows.includes(row) ? 'bg-blue-50' : ''}`}
                >
                  {enableSelection && (
                    <td className="w-12 px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row)}
                        onChange={() => toggleRowSelection(row)}
                        className="w-4 h-4"
                      />
                    </td>
                  )}
                  {columns.map(col => {
                    const value = row[col.field];
                    const show = col.showLinkConditions?.(row) ?? true;

                    if (col.type === 'link' && show) {
                      return (
                        <td key={col.field} className="px-6 py-4">
                          <button 
                            className="text-blue-600 hover:text-blue-800 underline" 
                            onClick={() => col.clickFn?.(row)}
                          >
                            {value}
                          </button>
                        </td>
                      );
                    }
                    if (col.type === 'button' && show) {
                      return (
                        <td key={col.field} className="px-6 py-4">
                          <button 
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700" 
                            onClick={() => col.clickFn?.(row)}
                          >
                            {value}
                          </button>
                        </td>
                      );
                    }
                    return <td key={col.field} className="px-6 py-4">{value}</td>;
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (enableSelection ? 1 : 0)} className="px-6 py-12 text-center text-gray-500 italic">
                  No data matches your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {sortedData.length > 0 && (
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} entries
            {searchTerm && ` (filtered from ${dataSource.length} total entries)`}
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⏮️
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ◀️
            </button>
            
            <div className="flex gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = currentPage <= 3 
                  ? i + 1 
                  : currentPage >= totalPages - 2 
                    ? totalPages - 4 + i 
                    : currentPage - 2 + i;
                
                if (pageNum < 1 || pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === pageNum 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ▶️
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⏭️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartDataGrid;