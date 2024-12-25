// packages
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import { APIS_V1 } from "./src/routes/v1/index.js";
import cors from "cors";

//utils
import connectDB from "./src/config/db.js";
import { errorHandlingMiddleware } from "./src/middlewares/errorMiddleware.js";
import passportMiddleware from "./src/auth/AuthStrategy/googleStategy.js";

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(compression());

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow cookies and credentials if needed
  })
);

passportMiddleware(app);

app.use("/v1/api", APIS_V1);
app.use(errorHandlingMiddleware);

app.listen(port, () => console.log(`Server listening on ${port}`));
