import rateLimit from "express-rate-limit";

export const importLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute

  max: 10,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many import requests. Please try again later.",
  },
});