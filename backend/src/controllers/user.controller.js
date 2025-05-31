import { StatusCodes } from "http-status-codes";
import asyncHandler from "../middlewares/async.handler.js";
import { userService } from "../services/user.service.js";

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await userService.getCurrentUserProfile(req, res);
  res.status(StatusCodes.OK).json(user);
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateCurrentUserProfile(req, res);
  res.status(StatusCodes.OK).json(user);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const user = await userService.getAllUsers(req, res);
  res.status(StatusCodes.OK).json(user);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req, res);
  res.status(StatusCodes.OK).json(user);
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await userService.updateUserById(req, res);
  res.status(StatusCodes.OK).json(user);
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await userService.deleteUserById(req, res);
  res.status(StatusCodes.OK).json(user);
});

const deleteManyUsers = asyncHandler(async (req, res) => {
  const users = await userService.deleteManyUsers(req, res);
  res.status(StatusCodes.OK).json(users);
});

export {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  deleteManyUsers,
};
