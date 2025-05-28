import {
  signUp,
  signIn,
  logout,
  refreshToken,
  signInByGG,
  forgotPassword,
  resetPassword,
} from "../services/access.service.js";
import asyncHandler from "../middlewares/async.handler.js";
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

const signInGGController = asyncHandler(async (req, res) => {
  try {
    const { user, accessToken } = await signInByGG(req, res);
    const userConvert = {
      userName: user.userName,
      email: user.email,
      isAdmin: user.isAdmin || false,
      isVerified: user.isVerified || true,
      _id: user._id,
    };

    const frontendUrl =
      `${process.env.FRONTEND_URL}/login` || "http://localhost:5173/login";
    const userStringified = JSON.stringify(userConvert);
    const encodedUser = encodeURIComponent(userStringified);
    const queryParams = new URLSearchParams({
      accessToken,
      user: encodedUser,
    }).toString();
    res.redirect(`${frontendUrl}?${queryParams}`);
  } catch (error) {
    console.error("Google sign-in error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"
      }/login?error=google_login_failed`
    );
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

const forgotPasswordController = asyncHandler(async (req, res, next) => {
  try {
    const { success, message } = await forgotPassword(req, res);
    res.status(StatusCodes.OK).json({ success, message });
  } catch (error) {
    next(error);
  }
});

const resetPasswordController = asyncHandler(async (req, res, next) => {
  try {
    const { success, message } = await resetPassword(req, res);
    res.status(StatusCodes.OK).json({ success, message });
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
  forgotPasswordController,
  resetPasswordController,
};
