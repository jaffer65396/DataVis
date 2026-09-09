export type DataType = 'string' | 'number' | 'date' | 'boolean';

export interface ColumnMeta {
  name: string;
  type: DataType;
  sampleValues: any[];
  nullCount: number;
  uniqueCount: number;
  min?: number | string;
  max?: number | string;
  mean?: number;
}

export interface Dataset {
  id: string;
  name: string;
  sourceType: 'file' | 'database' | 'api' | 'sample';
  sourceName: string;
  columns: ColumnMeta[];
  data: Record<string, any>[];
  rowCount: number;
  createdAt: string;
  updatedAt: string;
}

export type TransformationType = 
  | 'filter'
  | 'sort'
  | 'rename'
  | 'calculated_column'
  | 'aggregate'
  | 'replace_null'
  | 'drop_duplicates'
  | 'change_type';

export interface TransformationStep {
  id: string;
  type: TransformationType;
  description: string;
  params: {
    column?: string;
    newColumnName?: string;
    condition?: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'contains' | 'not_contains' | 'is_null' | 'not_null';
    value?: any;
    sortDirection?: 'asc' | 'desc';
    formula?: string;
    groupBy?: string[];
    aggregations?: { column: string; agg: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX'; alias: string }[];
    replaceValue?: any;
    targetType?: DataType;
  };
}

export interface DataSourceConnection {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql' | 'sqlite' | 'rest_api';
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  ssl?: boolean;
  apiUrl?: string;
  apiMethod?: 'GET' | 'POST';
  status: 'connected' | 'disconnected' | 'testing' | 'error';
  lastTested?: string;
  errorMessage?: string;
}
