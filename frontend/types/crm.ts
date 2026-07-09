export interface CSVRow {
  [key: string]: string;
}

export interface CRMRecord {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
}

export interface ImportResponse {
  success: boolean;
  totalRows: number;
  crmRecords: CRMRecord[];
}