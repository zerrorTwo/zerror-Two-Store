// packages
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import { APIS_V1 } from "./src/routes/v1/index.js";

//utils
import connectDB from "./src/config/db.js";
import { errorHandlingMiddleware } from "./src/middlewares/errorMiddleware.js";

dotenv.config();
console.log(process.env.PORT);

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

app.use("/v1/api", APIS_V1);
app.use(errorHandlingMiddleware);

app.listen(port, () => console.log(`Server listening on ${port}`));
