import {
  signUp,
  signIn,
  logout,
  refreshToken,
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

const logoutController = asyncHandler(async (req, res, next) => {
  const deletedKey = await logout(req, res);

  if (deletedKey) {
    res.status(StatusCodes.OK).json({ message: "Successfully logged out" });
  } else {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error logging out");
  }
});

const refreshTokenController = asyncHandler(async (req, res, next) => {
  try {
    const accessToken = await refreshToken(req, res);
    res.status(StatusCodes.OK).json(accessToken);
  } catch (error) {
    next(error);
  }
});

export {
  signUpController,
  signInController,
  logoutController,
  refreshTokenController,
};
