import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/api.error.js";
import bcyptPassword from "../utils/bcrypt.password.js";
import {
  findUserById,
  updateUser,
  findPaginatedUsers,
  countUsers,
  findUserByIdWithDetails,
  deleteUser,
  deleteManyUsersRepo,
  saveUser,
} from "../repositories/user.repository.js";

const getCurrentUserProfile = async (req, res) => {
  const userId = req.userId;
  return await findUserById(userId);
};

const updateCurrentUserProfile = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const user = await findUserByIdWithDetails(userId);
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  user.userName = req.body.userName || user.userName;
  user.email = req.body.email || user.email;
  user.number = req.body.number || user.number;

  if (req.body.password) {
    if (req.body.password !== req.body.comfirmPassword) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Passwords do not match");
    }
    const bcryptPassword = await bcyptPassword(req.body.password);
    user.password = bcryptPassword;
  }

  const updatedUser = await saveUser(user);
  const { password, ...userWithoutPassword } = updatedUser.toObject();
  return userWithoutPassword;
};

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const users = await findPaginatedUsers(page, limit);
    const totalUsers = await countUsers();

    return {
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      users,
    };
  } catch (error) {
    throw error;
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found");
  }

  const user = await findUserByIdWithDetails(userId);
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

  const user = await findUserByIdWithDetails(userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  user.userName = req.body.userName || user.userName;
  user.email = req.body.email || user.email;
  user.number = req.body.number || user.number;
  if (req.body.isAdmin !== undefined) {
    user.isAdmin = req.body.isAdmin;
  }

  if (req.body?.password) {
    const bcryptPassword = await bcyptPassword(req.body.password);
    user.password = bcryptPassword;
  }

  const updatedUser = await saveUser(user);
  const { password, ...userWithoutPassword } = updatedUser.toObject();
  return userWithoutPassword;
};

const deleteUserById = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    throw new ApiError(StatusCodes.NOT_FOUND, "UserId not found");
  }

  const user = await findUserByIdWithDetails(userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const userName = user.userName;
  await deleteUser(userId);
  return { message: `User ${userName} deleted successfully` };
};

const deleteManyUsers = async (req, res) => {
  const userIds = req.body;

  if (!userIds) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Users not found");
  }

  const response = await deleteManyUsersRepo(userIds);
  if (!response) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to delete users"
    );
  }
  return { message: `Users deleted successfully` };
};

export const userService = {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  deleteManyUsers,
};
