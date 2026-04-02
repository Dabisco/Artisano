import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "@/routes/authRoutes.js";
import { errorHandler } from "@/middleware/errorHandler.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests (e.g., from your frontend)
app.use(express.json()); // Parse incoming JSON payloads
app.use(cookieParser()); // Parse incoming cookie payloads

// Basic Health Check Route
app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "success", message: "Artisan Connect API is running!" });
});

// API Routes
app.use("/api/auth", authRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
