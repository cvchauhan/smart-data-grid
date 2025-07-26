import React, { useEffect, useState } from 'react';
import { ColumnDefinition } from '../types';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Props {
  dataSource?: string;
  columns?: string;
  defaultSortKey?: string;
  paginationOptions?: string;
  enableSelection?: string;
  action?: (rows: any[]) => void;
}

const SmartDataGrid: React.FC<Props> = (props) => {
  const parseJSON = <T,>(value: any, fallback: T): T => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  const [tableData, setTableData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColumnDefinition[]>([]);
  const [pagination, setPagination] = useState<number[]>([10, 20, 30, 50, 100]);
  const [selectionEnabled, setSelectionEnabled] = useState(false);

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // When props are available, parse them once
  useEffect(() => {
    const parsedData = parseJSON<any[]>(props.dataSource, []);
    const parsedColumns = parseJSON<ColumnDefinition[]>(props.columns, []);
    const parsedPagination = parseJSON<number[]>(props.paginationOptions, [10, 20, 30, 50, 100]);
    const parsedSelection = props.enableSelection === 'true';

    setTableData(parsedData);
    setColumnDefs(parsedColumns);
    setPagination(parsedPagination);
    setSelectionEnabled(parsedSelection);
    setRowsPerPage(parsedPagination[0]);
    setSelectedRows([]);
    setCurrentPage(1);
  }, [props.dataSource, props.columns, props.paginationOptions, props.enableSelection]);

  const sortedData = props.defaultSortKey
    ? [...tableData].sort((a, b) => (a[props.defaultSortKey!] > b[props.defaultSortKey!] ? 1 : -1))
    : tableData;

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
    props.action?.(updated);
  };

  const toggleSelectAll = () => {
    const allSelected = selectedRows.length === paginatedData.length;
    const updated = allSelected ? [] : [...paginatedData];
    setSelectedRows(updated);
    props.action?.(updated);
  };

  return (
    <div className="container mt-3">
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            {selectionEnabled && (
              <th scope="col">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={selectedRows.length === paginatedData.length}
                />
              </th>
            )}
            {columnDefs.map(col => (
              <th key={col.field}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, i) => (
            <tr key={i}>
              {selectionEnabled && (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row)}
                    onChange={() => toggleRowSelection(row)}
                  />
                </td>
              )}
              {columnDefs.map(col => {
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
          {pagination.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SmartDataGrid;
