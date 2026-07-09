import { Router } from "express";
import multer from "multer";

import {
  uploadCSV,
  testAI,
  importCSV,
} from "../controllers/csv.controller";

import { importLimiter } from "../middleware/rateLimiter";


const router = Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    console.log("📄 File:", file.originalname);

    if (
      file.mimetype === "text/csv" ||
      file.originalname.toLowerCase().endsWith(".csv")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed."));
    }
  },
});

/**
 * Preview CSV
 */
router.post(
  "/upload",
  upload.single("file"),
  uploadCSV
);

/**
 * Temporary AI Test
 */
router.get(
  "/test-ai",
  testAI
);

/**
 * AI Import
 */
router.post(
  "/import",
  importLimiter,
  upload.single("file"),
  importCSV
);
router.post(
  "/import",
  upload.single("file"),
  importCSV
);

export default router;