import { StatusCodes } from "http-status-codes";
import UserModel from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import bcyptPassword from "../utils/bcryptPassword.js";

const getCurrentUserProfile = async (req, res) => {
  const userId = req.user;
  const user = UserModel.findById(userId);
  return user;
};

const updateCurrentUserProfile = async (req, res) => {
  const userId = req.user;
  if (!userId) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }
  user.userName = req.body.userName || user.userName;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    if (req.body.password !== req.body.comfirmPassword) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Passwords do not match");
    }
    const bcryptPassword = await bcyptPassword(password);
    user.password = bcryptPassword;
  }
  const updatedUser = await user.save();
  const { password, ...userWithoutPassword } = updatedUser.toObject();
  return userWithoutPassword;
};

const getAllUsers = async (req, res) => {
  return await UserModel.find({});
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  return user;
};

const updateUserById = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found");
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  user.userName = req.body.userName || user.userName;
  user.email = req.body.email || user.email;
  if (req.body.isAdmin !== undefined) {
    user.isAdmin = req.body.isAdmin;
  }

  if (req.body.password) {
    const bcryptPassword = await bcyptPassword(password);
    user.password = bcryptPassword;
  }
  const updatedUser = await user.save();
  const { password, ...userWithoutPassword } = updatedUser.toObject();
  return userWithoutPassword;
};

const deleteUserById = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  const userName = user.userName;
  await UserModel.deleteOne(user);
  return { message: `User ${userName} deleted successfully` };
};

export const userService = {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
