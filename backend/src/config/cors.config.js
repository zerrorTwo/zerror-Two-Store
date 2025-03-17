import { WHITELIST_DOMAINS } from "../constants/white.list.js";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/api.error.js";

dotenv.config();

// Cấu hình CORS Option trong dự án thực tế (Video số 62 trong chuỗi MERN Stack Pro)
export const corsOptions = {
  origin: function (origin, callback) {
    // Nếu không có origin (vd: Postman) và đang ở chế độ dev, cho phép truy cập
    if (!origin && process.env.BUILD_MODE === "dev") {
      return callback(null, true);
    }

    // Nếu origin nằm trong danh sách whitelist, cho phép truy cập
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true);
    }

    // Nếu không, trả về lỗi CORS
    return callback(
      new ApiError(
        StatusCodes.FORBIDDEN,
        `${origin} not allowed by our CORS Policy.`
      )
    );
  },

  optionsSuccessStatus: 200,
  credentials: true, // Cho phép gửi cookies nếu cần
};
