import { Request, Response } from "express";
import { parseCSV } from "../services/csvParser.service";

export const uploadCSV = (req: Request, res: Response): void => {
  console.log("================================");
  console.log("✅ uploadCSV Controller Reached");
  console.log("================================");

  console.log(req.file);

  if (!req.file) {
    res.status(400).json({
      success: false,
      message: "No CSV file uploaded."
    });
    return;
  }

  try {
    const rows = parseCSV(req.file.buffer);

    res.status(200).json({
      success: true,
      totalRows: rows.length,
      preview: rows
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to parse CSV."
    });
  }
};