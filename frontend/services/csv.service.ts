import Papa from "papaparse";
import { CSVRow } from "@/types/crm";

export function parseCSV(
  file: File
): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,

      complete(results) {
        resolve(results.data);
      },

      error(error) {
        reject(error);
      },
    });
  });
}