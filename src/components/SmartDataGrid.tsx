// src/components/SmartDataGridReact.tsx
import React, { useEffect, useState, useMemo } from "react";
import { SmartDataGridProps } from "../types";
import "./SmartDataGrid.css"; // Custom styles

const SmartDataGridReact: React.FC<SmartDataGridProps> = ({
  dataSource = [],
  columns = [],
  defaultSortKey,
  paginationOptions = [10, 20, 30, 50, 100],
  enableSelection = false,
  onSelectionChange,
  theme = "modern",
  title,
  searchable = true,
  enableExport = false,
  exportFormats = ["csv", "json"],
  exportFileName = "data-export",
}) => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(defaultSortKey ? { key: defaultSortKey, direction: "asc" } : null);

  const stablePaginationOptions = useMemo(
    () => paginationOptions,
    [JSON.stringify(paginationOptions)]
  );

  useEffect(() => {
    setRowsPerPage(stablePaginationOptions[0] || 10);
  }, []);

  useEffect(() => {
    setSelectedRows([]);
    setCurrentPage(1);
  }, [dataSource]);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchTerm) return dataSource;
    return dataSource.filter((row) =>
      columns.some((col) =>
        String(row[col.field]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [dataSource, searchTerm, columns]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
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
    setSortConfig((current) => {
      if (current?.key === field) {
        return current.direction === "asc"
          ? { key: field, direction: "desc" }
          : null;
      }
      return { key: field, direction: "asc" };
    });
  };

  const toggleRowSelection = (row: any) => {
    const isSelected = selectedRows.some(
      (selectedRow) => JSON.stringify(selectedRow) === JSON.stringify(row)
    );
    const updated = isSelected
      ? selectedRows.filter((r) => JSON.stringify(r) !== JSON.stringify(row))
      : [...selectedRows, row];
    setSelectedRows(updated);
    onSelectionChange?.(updated);
  };

  // Fixed: Select all now works across all filtered/sorted data, not just current page
  const toggleSelectAll = () => {
    const allSelected = selectedRows.length === sortedData.length;
    const updated = allSelected ? [] : [...sortedData];
    setSelectedRows(updated);
    onSelectionChange?.(updated);
  };

  // Helper function to check if current page's select all should be checked
  const isCurrentPageFullySelected = () => {
    return (
      paginatedData.length > 0 &&
      paginatedData.every((row) =>
        selectedRows.some(
          (selectedRow) => JSON.stringify(selectedRow) === JSON.stringify(row)
        )
      )
    );
  };

  // Helper function to check if current page has any selections
  const hasCurrentPageSelections = () => {
    return paginatedData.some((row) =>
      selectedRows.some(
        (selectedRow) => JSON.stringify(selectedRow) === JSON.stringify(row)
      )
    );
  };

  const getSortIcon = (field: string) => {
    if (sortConfig?.key !== field) return "↕️";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  // Export functionality
  const exportToCSV = (data: any[]) => {
    if (data.length === 0) return;

    // Get headers for export (exclude action columns)
    const exportColumns = columns.filter(
      (col) => col.type !== "button" && col.type !== "link"
    );
    const headers = exportColumns.map((col) => col.header).join(",");

    // Get data rows
    const csvRows = data.map((row) =>
      exportColumns
        .map((col) => {
          const value = row[col.field];
          // Escape commas and quotes in CSV
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || "";
        })
        .join(",")
    );

    const csvContent = [headers, ...csvRows].join("\n");
    downloadFile(csvContent, `${exportFileName}.csv`, "text/csv");
  };

  const exportToJSON = (data: any[]) => {
    if (data.length === 0) return;

    // Filter out action columns for cleaner export
    const exportColumns = columns.filter(
      (col) => col.type !== "button" && col.type !== "link"
    );
    const cleanData = data.map((row) => {
      const cleanRow: any = {};
      exportColumns.forEach((col) => {
        cleanRow[col.field] = row[col.field];
      });
      return cleanRow;
    });

    const jsonContent = JSON.stringify(cleanData, null, 2);
    downloadFile(jsonContent, `${exportFileName}.json`, "application/json");
  };

  const exportToExcel = (data: any[]) => {
    if (data.length === 0) return;

    // Create HTML table for Excel
    const exportColumns = columns.filter(
      (col) => col.type !== "button" && col.type !== "link"
    );
    const headers = exportColumns
      .map((col) => `<th>${col.header}</th>`)
      .join("");
    const rows = data
      .map(
        (row) =>
          `<tr>${exportColumns
            .map((col) => `<td>${row[col.field] || ""}</td>`)
            .join("")}</tr>`
      )
      .join("");

    const htmlTable = `
      <table>
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;

    downloadFile(
      htmlTable,
      `${exportFileName}.xls`,
      "application/vnd.ms-excel"
    );
  };

  const downloadFile = (
    content: string,
    fileName: string,
    mimeType: string
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = (format: string) => {
    // Determine what data to export
    const dataToExport = selectedRows.length > 0 ? selectedRows : sortedData;

    switch (format.toLowerCase()) {
      case "csv":
        exportToCSV(dataToExport);
        break;
      case "json":
        exportToJSON(dataToExport);
        break;
      case "excel":
      case "xls":
        exportToExcel(dataToExport);
        break;
      default:
        console.error("Unsupported export format:", format);
    }
  };

  return (
    <div className={`smart-data-grid ${theme}`}>
      {/* Header */}
      <div className="grid-header">
        {title && <h3 className="grid-title">{title}</h3>}
        <div className="grid-controls">
          {searchable && (
            <div className="search-box">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          )}

          <div className="rows-per-page">
            <label>Show</label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(+e.target.value);
                setCurrentPage(1);
              }}
              className="rows-select"
            >
              {stablePaginationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <label>entries</label>
          </div>

          {/* Export Dropdown */}
          {enableExport && (
            <div className="export-controls">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleExport(e.target.value);
                    e.target.value = ""; // Reset selection
                  }
                }}
                className="export-select"
                defaultValue=""
              >
                <option value="" disabled>
                  Export...
                </option>
                {exportFormats.includes("csv") && (
                  <option value="csv">Export as CSV</option>
                )}
                {exportFormats.includes("json") && (
                  <option value="json">Export as JSON</option>
                )}
                {exportFormats.includes("excel") && (
                  <option value="excel">Export as Excel</option>
                )}
              </select>
              {selectedRows.length > 0 && (
                <span className="export-info">
                  ({selectedRows.length} selected)
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selection Info */}
      {enableSelection && selectedRows.length > 0 && (
        <div className="selection-info">
          <span>{selectedRows.length} row(s) selected</span>
          <button
            onClick={() => {
              setSelectedRows([]);
              onSelectionChange?.([]);
            }}
            className="clear-selection"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              {enableSelection && (
                <th className="checkbox-column">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={
                      selectedRows.length === sortedData.length &&
                      sortedData.length > 0
                    }
                    ref={(input) => {
                      if (input) {
                        input.indeterminate =
                          hasCurrentPageSelections() &&
                          !isCurrentPageFullySelected() &&
                          selectedRows.length < sortedData.length;
                      }
                    }}
                    className="checkbox"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSortable = col.sortable !== false; // default to true unless explicitly false

                return (
                  <th
                    key={col.field}
                    onClick={() =>
                      isSortable ? handleSort(col.field) : undefined
                    }
                    className={`sortable-header ${
                      isSortable ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div className="header-content">
                      <span>{col.header}</span>
                      {isSortable && (
                        <span className="sort-icon">
                          {getSortIcon(col.field)}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, i) => {
                const isSelected = selectedRows.some(
                  (selectedRow) =>
                    JSON.stringify(selectedRow) === JSON.stringify(row)
                );
                return (
                  <tr key={i} className={isSelected ? `${theme}-selected` : ""}>
                    {enableSelection && (
                      <td className="checkbox-column">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRowSelection(row)}
                          className="checkbox"
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const value = row[col.field];
                      const show = col.showLinkConditions?.(row) ?? true;

                      if (col.type === "link" && show) {
                        return (
                          <td key={col.field}>
                            <button
                              className="link-button"
                              onClick={() => col.clickFn?.(row)}
                            >
                              {value}
                            </button>
                          </td>
                        );
                      }
                      if (col.type === "button" && show) {
                        return (
                          <td key={col.field}>
                            <button
                              className="action-button"
                              onClick={() => col.clickFn?.(row)}
                            >
                              {value}
                            </button>
                          </td>
                        );
                      }
                      return <td key={col.field}>{value}</td>;
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (enableSelection ? 1 : 0)}
                  className="no-data"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="grid-footer">
        <div className="info">
          Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
          {Math.min(currentPage * rowsPerPage, sortedData.length)} of{" "}
          {sortedData.length} entries
          {searchTerm && ` (filtered from ${dataSource.length} total entries)`}
          {selectedRows.length > 0 && ` • ${selectedRows.length} selected`}
        </div>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="page-btn"
          >
            ⏮️
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="page-btn"
          >
            ◀️
          </button>

          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum =
                currentPage <= 3
                  ? i + 1
                  : currentPage >= totalPages - 2
                  ? totalPages - 4 + i
                  : currentPage - 2 + i;

              if (pageNum < 1 || pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`page-number ${
                    currentPage === pageNum ? "active" : ""
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            ▶️
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            ⏭️
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartDataGridReact;
