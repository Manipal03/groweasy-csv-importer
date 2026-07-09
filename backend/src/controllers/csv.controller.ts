import { Request, Response } from "express";

import { parseCSV } from "../services/csvParser.service";

import {
  testGroqConnection,
  extractCRMRecords,
} from "../services/aiExtractor.service";

import {
  validateRecords,
} from "../services/validation.service";

import {logInfo, logSuccess, logError} from "../utils/logger";

export const uploadCSV = (req: Request, res: Response): void => {

  if (!req.file) {
    logInfo('CSV Import Started')
    res.status(400).json({
      success: false,
      message: "No CSV uploaded.",
    });
    return;
  }

  const rows = parseCSV(req.file.buffer);
  logInfo(`Parsed ${rows.length} rows`);

  res.json({
    success: true,
    totalRows: rows.length,
    preview: rows,
  });

};

export const testAI = async (_req: Request, res: Response) => {

  try {

    const result = await testGroqConnection();

    res.json({
      success: true,
      result,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }

};

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

    const aiResult =
      await extractCRMRecords(rows);
      logSuccess("AI Extraction complete");

    const validation =
      validateRecords(aiResult.records);
      logSuccess("Validation complete");

    return res.json({

      success: true,

      totalRows: rows.length,

      processedRecords:
        validation.validRecords.length,

      invalidRecords:
        validation.invalidRecords.length,

      duplicateRecords:
        validation.duplicateRecords.length,

      failedBatches:
        aiResult.failedBatches,

      crmRecords:
        validation.validRecords,

    });

  } catch (err) {

    logError("Error occurred while importing CSV.");
    console.error(err);

    return res.status(500).json({

      success: false,

      message: "Import failed.",

    });

  }

};