import { createNew } from "../services/userService.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createUser = asyncHandler(async (req, res, next) => {
  try {
    const newUser = await createNew(req, res);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

export { createUser };
