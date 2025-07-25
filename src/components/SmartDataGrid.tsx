import React, { useState } from 'react';
import { ColumnDefinition } from '../types';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Props {
  dataSource: any[];
  columns: ColumnDefinition[];
  defaultSortKey?: string;
  paginationOptions?: number[];
  enableSelection?: boolean;
  action?: (rows: any[]) => void;
}

const SmartDataGrid: React.FC<Props> = ({
  dataSource = [],
  columns = [],
  defaultSortKey,
  paginationOptions = [10, 20, 30, 50, 100],
  enableSelection = false,
  action
}) => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(paginationOptions[0]);

  const sortedData = defaultSortKey
    ? [...dataSource].sort((a, b) => (a[defaultSortKey] > b[defaultSortKey] ? 1 : -1))
    : dataSource;

  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const toggleRowSelection = (row: any) => {
    const isSelected = selectedRows.includes(row);
    const updated = isSelected
      ? selectedRows.filter(r => r !== row)
      : [...selectedRows, row];
    setSelectedRows(updated);
    action?.(updated);
  };

  const toggleSelectAll = () => {
    const allSelected = selectedRows.length === paginatedData.length;
    const updated = allSelected ? [] : [...paginatedData];
    setSelectedRows(updated);
    action?.(updated);
  };

  return (
    <div className="container mt-3">
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            {enableSelection && (
              <th scope="col">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={selectedRows.length === paginatedData.length}
                />
              </th>
            )}
            {columns.map(col => (
              <th scope="col" key={col.field}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, i) => (
            <tr key={i}>
              {enableSelection && (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row)}
                    onChange={() => toggleRowSelection(row)}
                  />
                </td>
              )}
              {columns.map(col => {
                const value = row[col.field];
                const show = col.showLinkConditions?.(row) ?? true;

                if (col.type === 'link' && show) {
                  return (
                    <td key={col.field}>
                      <a role="button" className="text-primary" onClick={() => col.clickFn?.(row)}>{value}</a>
                    </td>
                  );
                }
                if (col.type === 'button' && show) {
                  return (
                    <td key={col.field}>
                      <button className="btn btn-sm btn-primary" onClick={() => col.clickFn?.(row)}>{value}</button>
                    </td>
                  );
                }
                return <td key={col.field}>{value}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex align-items-center gap-2">
        <label className="form-label mb-0 me-2">Rows per page:</label>
        <select className="form-select w-auto" onChange={(e) => setRowsPerPage(+e.target.value)} value={rowsPerPage}>
          {paginationOptions.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SmartDataGrid;