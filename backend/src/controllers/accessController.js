import { signUp, signIn, logout } from "../services/accessService.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { StatusCodes } from "http-status-codes";

const signUpController = asyncHandler(async (req, res, next) => {
  try {
    const newUser = await signUp(req, res);
    res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    next(error);
  }
});

const signInController = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await signIn({ email, password });
    res.status(StatusCodes.OK).json({
      user,
      tokens,
    });
  } catch (error) {
    next(error);
  }
});

const logoutController = asyncHandler(async (req, res, next) => {
  const { keyStore } = req;
  console.log(keyStore);

  const deletedKey = await logout({ keyStore });

  if (deletedKey) {
    res.status(StatusCodes.OK).json({ message: "Successfully logged out" });
  } else {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error logging out");
  }
});

export { signUpController, signInController, logoutController };
