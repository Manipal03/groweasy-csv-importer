import { Request, Response } from "express";
import { parseCSV } from "../services/csvParser.service";

import {
  testGroqConnection,
  extractCRMRecords,
} from "../services/aiExtractor.service";

/**
 * Preview uploaded CSV
 */
export const uploadCSV = (req: Request, res: Response): void => {
  console.log("================================");
  console.log("✅ uploadCSV Controller Reached");
  console.log("================================");

  if (!req.file) {
    res.status(400).json({
      success: false,
      message: "No CSV file uploaded.",
    });
    return;
  }

  try {
    const rows = parseCSV(req.file.buffer);

    res.status(200).json({
      success: true,
      totalRows: rows.length,
      preview: rows,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to parse CSV.",
    });
  }
};

/**
 * Temporary Groq Connection Test
 */
export const testAI = async (_req: Request, res: Response) => {
  try {
    const result = await testGroqConnection();

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Groq connection failed.",
    });
  }
};

/**
 * AI CSV Import
 */
export const importCSV = async (
  req: Request,
  res: Response
) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No CSV uploaded.",
    });
  }

  try {
    const rows = parseCSV(req.file.buffer);

    const crmRecords = await extractCRMRecords(rows);

    return res.status(200).json({
      success: true,
      totalRows: rows.length,
      crmRecords,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Import failed.",
    });
  }
};