import dns from 'node:dns'; 
dns.setServers(['1.1.1.1', '8.8.8.8']);
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan"
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit"
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import authRoutes from "./routes/authroutes.js"
import companyRoutes from "./routes/companyroutes.js"
import jobRoutes from "./routes/jobroutes.js"
import applicationRoutes from "./routes/applicationroutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js";
// import errorMiddleware from "./middleware/errorMiddleware.js";




dotenv.config();



connectDB();

const app = express();


app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use(limiter);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }));
// app.use(errorMiddleware())





// Routes
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;