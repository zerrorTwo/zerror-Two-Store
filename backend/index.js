import express from "express";
import dotenv from "dotenv";

dotenv.config();
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import path from "path";
import { APIS_V1 } from "./src/routes/v1/index.js";
import { uploadRoute } from "./src/routes/v1/upload.route.js";
import connectDB from "./src/config/db.js";
import { errorHandlingMiddleware } from "./src/middlewares/error.middleware.js";
import passportMiddleware from "./src/auth/AuthStrategy/passport.strategy.js";
import { corsOptions } from "./src/config/cors.config.js";
import fs from "fs";
import session from "express-session";
import compressionOptions from "./src/config/compression.config.js";
import { rateLimit } from "express-rate-limit";
import limiter from "./src/config/limitter.config.js";
import helmetOptions from "./src/config/helmet.config.js";
import sessionOptions from "./src/config/session.config.js";

connectDB();

const app = express();

const port = process.env.PORT || 5000;

// Điều chỉnh thứ tự middleware
app.use(cors(corsOptions));
app.use(compression(compressionOptions));
app.use(rateLimit(limiter));
app.use(cookieParser());
app.use(helmet(helmetOptions));
app.use(session(sessionOptions));

passportMiddleware(app);
// Sau đó mới xử lý body-parser cho các routes khác
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Chào bạn đến với FE P store");
});
// Các routes khác
app.use("/v1/api", APIS_V1);
app.use(errorHandlingMiddleware);

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(process.cwd(), "uploads");
const categoriesImgDir = path.join(uploadsDir, "categoriesImg");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(categoriesImgDir)) {
  fs.mkdirSync(categoriesImgDir);
}
// Serve static files from the "uploads" directory
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Đặt routes upload trước các middleware xử lý body
app.use("/v1/api/upload", uploadRoute);

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.listen(port, () => console.log(`Server listening on ${port}`));
