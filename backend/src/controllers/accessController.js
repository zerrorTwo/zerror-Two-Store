import {
  signUp,
  signIn,
  logout,
  refreshToken,
  signInByGG,
} from "../services/accessService.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { StatusCodes } from "http-status-codes";

const signUpController = asyncHandler(async (req, res, next) => {
  try {
    const { user, accessToken } = await signUp(req, res);
    res.status(StatusCodes.CREATED).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
});

const signInController = asyncHandler(async (req, res, next) => {
  try {
    const { user, accessToken } = await signIn(req, res);
    res.status(StatusCodes.OK).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
});

const signInGGController = asyncHandler(async (req, res, next) => {
  try {
    const { user, accessToken } = await signInByGG(req, res);
    const userConvert = user;
    res.status(StatusCodes.OK).json({ userConvert, accessToken });
  } catch (error) {
    next(error);
  }
});

const logoutController = asyncHandler(async (req, res, next) => {
  try {
    const deletedKey = await logout(req, res); // Gọi logout để xử lý các bước logout
    if (deletedKey) {
      res.status(StatusCodes.OK).json({ message: "Successfully logged out" });
    } else {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error logging out"
      );
    }
  } catch (error) {
    next(error); // Chuyển tiếp lỗi đến error handler
  }
});

const refreshTokenController = asyncHandler(async (req, res, next) => {
  try {
    // Gọi hàm refreshToken để set cookie và gửi phản hồi
    await refreshToken(req, res);
    // Đã gửi phản hồi trong hàm refreshToken, không cần làm gì thêm ở đây
  } catch (error) {
    next(error);
  }
});

export {
  signUpController,
  signInController,
  signInGGController,
  logoutController,
  refreshTokenController,
};
