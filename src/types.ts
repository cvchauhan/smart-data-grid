export interface DataGridConfig {
  data: Record<string, any>[];
  header: { key: string; label: string }[];
  pagination?: boolean;
  filter?: boolean;
}
