import Papa, { ParseResult } from "papaparse";
import api from "@/lib/api";
import { CSVRow } from "@/types/crm";

export function parseCSV(file: File): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,

      complete(results: ParseResult<CSVRow>) {
        resolve(results.data);
      },

      error(error) {
        reject(error);
      },
    });
  });
}

export async function uploadCSV(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/csv/import", formData);

  return response.data;
}