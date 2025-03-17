import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/async.handler.js";
import { userService } from "../services/user.service.js";
import { log } from "console";

const getCurrentUserProfile = asyncHandeler(async (req, res) => {
  const user = await userService.getCurrentUserProfile(req, res);
  res.status(StatusCodes.OK).json(user);
});

const updateCurrentUserProfile = asyncHandeler(async (req, res) => {
  const user = await userService.updateCurrentUserProfile(req, res);
  res.status(StatusCodes.OK).json(user);
});

const getAllUsers = asyncHandeler(async (req, res) => {
  const user = await userService.getAllUsers(req, res);
  res.status(StatusCodes.OK).json(user);
});

const getUserById = asyncHandeler(async (req, res) => {
  const user = await userService.getUserById(req, res);
  res.status(StatusCodes.OK).json(user);
});

const updateUserById = asyncHandeler(async (req, res) => {
  const user = await userService.updateUserById(req, res);
  res.status(StatusCodes.OK).json(user);
});

const deleteUserById = asyncHandeler(async (req, res) => {
  const user = await userService.deleteUserById(req, res);
  res.status(StatusCodes.OK).json(user);
});

const deleteManyUsers = asyncHandeler(async (req, res) => {
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
