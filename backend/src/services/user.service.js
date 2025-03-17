import { StatusCodes } from "http-status-codes";
import UserModel from "../models/user.model.js";
import ApiError from "../utils/api.error.js";
import bcyptPassword from "../utils/bcrypt.password.js";

const getCurrentUserProfile = async (req, res) => {
  const userId = req.user;
  const user = UserModel.findById(userId)
    .select("_id name email password isAdmin")
    .lean();
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
  try {
    const page = parseInt(req.query.page) || 1; // Mặc định là trang 1
    const limit = parseInt(req.query.limit) || 10; // Mặc định là 10 sản phẩm mỗi trang

    // Tính số sản phẩm cần skip
    const skip = (page - 1) * limit;

    // Lấy danh sách sản phẩm từ database với phân trang
    const users = await UserModel.find({})
      .select("_id userName email password isAdmin")
      .skip(skip)
      .limit(limit)
      .lean();

    // Tính tổng số sản phẩm
    const totalUsers = await UserModel.countDocuments({});

    // Tạo response với dữ liệu phân trang
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
  user.number = req.body.number || user.number;
  if (req.body.isAdmin !== undefined) {
    user.isAdmin = req.body.isAdmin;
  }

  if (req.body?.password) {
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

const deleteManyUsers = async (req, res) => {
  const users = req.body;

  if (!users) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Users not found");
  }
  const respone = await UserModel.deleteMany(users);

  if (!respone) {
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
