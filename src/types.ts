export interface ColumnDefinition {
  field: string;
  header: string;
  type?: "link" | "button" | "text";
  clickFn?: (row: any) => void;
  showLinkConditions?: (row: any) => boolean;
}

export interface SmartDataGridProps {
  dataSource?: any[];
  columns?: ColumnDefinition[];
  defaultSortKey?: string;
  paginationOptions?: number[];
  enableSelection?: boolean;
  onSelectionChange?: (rows: any[]) => void;
  theme?: "light" | "dark" | "modern";
  title?: string;
  searchable?: boolean;
}
