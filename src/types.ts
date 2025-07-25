export interface ColumnDefinition {
  field: string;
  header: string;
  type?: 'link' | 'button' | 'text';
  clickFn?: (row: any) => void;
  showLinkConditions?: (row: any) => boolean;
}