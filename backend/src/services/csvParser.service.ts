import Papa from "papaparse";

export const parseCSV = (
  buffer: Buffer
): Record<string, string>[] => {

  const csv = buffer.toString("utf-8");

  const result = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    throw new Error("Invalid CSV.");
  }

  return result.data;
};