import UserModel from "../models/user.model.js";
import KeyModel from "../models/key.model.js";

const findByEmail = async ({
  email,
  select = {
    userName: 1,
    email: 1,
    password: 1,
    isAdmin: 1,
    number: 1,
    googleId: 1,
    isVerified: 1,
  },
}) => {
  return await UserModel.findOne({ email: email }).select(select).lean();
};

const findRoleByUserId = async (userId) => {
  return await UserModel.findOne({ _id: userId }).select("-password").lean();
};

const findUserById = async (userId) => {
  return await UserModel.findOne({ _id: userId });
};

const findKeyStoreById = async (id) => {
  return await KeyModel.findOne({ _id: id });
};

export const accessRepository = {
  findByEmail,
  findRoleByUserId,
  findUserById,
  findKeyStoreById,
};
