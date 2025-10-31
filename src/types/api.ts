export interface ParsedField {
  name: string;
  value: string;
  type: string;
  isChangeable: boolean;
  mappedTo?: {
    apiName: string;
    fieldName: string;
  };
}

export interface ApiResponse {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
}

export interface UploadedFile {
  id: string;
  name: string;
  content: string;
}

export interface CurlCommand {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
}

export interface FieldMapping {
  type: string;
  source: string;
  field: string;
}

export interface ApiMapping {
  apiName: string;
  endpoint: string;
  headers?: Record<string, string>;
  mappings: Record<string, FieldMapping>;
}
