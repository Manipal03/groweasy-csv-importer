import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import csvRoutes from "./routes/csv.routes";

dotenv.config();
console.log("Groq Key Loaded:", !!process.env.GROQ_API_KEY);
console.log("Model:", process.env.MODEL);


const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json());

// ======================
// Root Route
// ======================
app.get("/", (_req, res) => {
  res.status(200).json({
    app: "GrowEasy CSV Importer Backend",
    status: "Running ",
    version: "1.0.0"
  });
});

// ======================
// Health Check
// ======================
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running "
  });
});

// ======================
// CSV Routes
// (We'll implement these next)
// ======================
app.use("/api/csv", csvRoutes);

// ======================
// Start Server
// ======================
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});