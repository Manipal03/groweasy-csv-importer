import { Router } from "express";
import multer from "multer";
import { uploadCSV } from "../controllers/csv.controller";

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

router.post(
  "/upload",
  upload.single("file"),
  uploadCSV
);

export default router;