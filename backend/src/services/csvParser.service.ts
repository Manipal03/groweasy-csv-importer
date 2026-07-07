import Papa from "papaparse";

export const parseCSV = (buffer: Buffer) => {
  console.log("CSV parser started...");

  const csv = buffer.toString("utf-8");

  console.log(csv);

  const result = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  });

  console.log(result);

  if (result.errors.length > 0) {
    throw new Error("Invalid CSV file.");
  }

  return result.data;
};