import UserModel from "../models/user.model.js";

const createUser = async (data) => {
  return await UserModel.create(data);
};

// Lấy thông tin user hiện tại
const findUserById = async (userId) => {
  return await UserModel.findById(userId)
    .select("_id name email password isAdmin")
    .lean();
};

const findByUserEmail = async (email) => {
  return await UserModel.findOne({ email: email }).select("-password");
};

// Cập nhật thông tin user
const updateUser = async (userId, data) => {
  return await UserModel.findByIdAndUpdate(userId, data, {
    new: true,
  });
};

// Lấy danh sách user có phân trang
const findPaginatedUsers = async (page, limit) => {
  const skip = (page - 1) * limit;
  return await UserModel.find({})
    .select("_id userName email password isAdmin")
    .skip(skip)
    .limit(limit)
    .lean();
};

// Đếm tổng số user
const countUsers = async () => {
  return await UserModel.countDocuments({});
};

// Lấy user theo ID
const findUserByIdWithDetails = async (userId) => {
  return await UserModel.findById(userId);
};

// Xóa user theo ID
const deleteUser = async (userId) => {
  return await UserModel.deleteOne({ _id: userId });
};

// Xóa nhiều user
const deleteManyUsersRepo = async (userIds) => {
  return await UserModel.deleteMany({ _id: { $in: userIds } });
};

// Lưu thông tin user
const saveUser = async (user) => {
  return await user.save();
};

export const userRepository = {
  findUserById,
  updateUser,
  findPaginatedUsers,
  countUsers,
  findUserByIdWithDetails,
  deleteUser,
  deleteManyUsersRepo,
  saveUser,
  findByUserEmail,
  createUser,
};
