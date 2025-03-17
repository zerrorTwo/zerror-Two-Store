import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import path from "path";
import { APIS_V1 } from "./src/routes/v1/index.js";
import connectDB from "./src/config/db.js";
import { errorHandlingMiddleware } from "./src/middlewares/error.middleware.js";
import passportMiddleware from "./src/auth/AuthStrategy/google.strategy.js";
import { corsOptions } from "./src/config/cors.config.js";
// import "./src/jobs/momoJob.js"; // Import file cron job

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

passportMiddleware(app);
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // or 'same-site' if appropriate
  next();
});

// Serve static files from the "uploads" directory
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/v1/api", APIS_V1);
app.use(errorHandlingMiddleware);

app.listen(port, () => console.log(`Server listening on ${port}`));
