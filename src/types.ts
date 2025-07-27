// src/types/index.ts

export interface ColumnConfig {
  field: string;
  header: string;
  type?: "text" | "button" | "link";
  sortable?: boolean;
  clickFn?: (row: any) => void;
  showLinkConditions?: (row: any) => boolean;
}

export interface SmartDataGridProps {
  dataSource?: any[];
  columns?: ColumnConfig[];
  defaultSortKey?: string;
  paginationOptions?: number[];
  enableSelection?: boolean;
  onSelectionChange?: (selectedRows: any[]) => void;
  theme?: "modern" | "classic" | "dark";
  title?: string;
  searchable?: boolean;
  enableExport?: boolean;
  exportFormats?: ("csv" | "json" | "excel")[];
  exportFileName?: string;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export interface ExportOptions {
  format: "csv" | "json" | "excel";
  selectedRowsOnly?: boolean;
  excludeColumns?: string[];
}
