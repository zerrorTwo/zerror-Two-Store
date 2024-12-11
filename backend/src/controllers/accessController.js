import { signUp, signIn } from "../services/accessService.js";
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

export { signUpController, signInController };
